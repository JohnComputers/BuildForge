'use strict';

/**
 * BuildForge AI — secure payment backend (Firebase Cloud Functions, gen 2).
 *
 * createCheckout : authenticated callable. Creates a Square Payment Link bound
 *                  to the caller's uid and a SERVER-SIDE price, so neither the
 *                  plan nor the amount can be tampered with by the client.
 * squareWebhook  : public HTTPS endpoint that Square calls after payment. It
 *                  verifies the request signature, confirms the payment really
 *                  completed, reads the uid/plan from the order metadata, and
 *                  grants the entitlement using the Admin SDK (which bypasses
 *                  Firestore rules — the browser cannot do this).
 *
 * No Square SDK dependency: we use built-in fetch (Node 20) + crypto.
 */

const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret, defineString } = require('firebase-functions/params');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

// Secrets (set with: firebase functions:secrets:set NAME)
const SQUARE_ACCESS_TOKEN = defineSecret('SQUARE_ACCESS_TOKEN');
const SQUARE_WEBHOOK_SIGNATURE_KEY = defineSecret('SQUARE_WEBHOOK_SIGNATURE_KEY');

// Plain config (set in .env or with firebase functions config; here via params)
const SQUARE_LOCATION_ID = defineString('SQUARE_LOCATION_ID');
const SQUARE_ENV = defineString('SQUARE_ENV', { default: 'production' });
const SQUARE_WEBHOOK_URL = defineString('SQUARE_WEBHOOK_URL');
const SUCCESS_BASE_URL = defineString('SUCCESS_BASE_URL');

// Server-side source of truth. Amounts in cents.
const PRICES = { full: 499, pro: 999 };
const PLAN_NAMES = {
  full: 'BuildForge — Full Build Plan',
  pro: 'BuildForge — Performance Build Pro',
};
const RANK = { free: 0, full: 1, pro: 2 };

function apiBase() {
  return SQUARE_ENV.value() === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';
}

const SQUARE_VERSION = '2024-09-19';

// ── Create a checkout bound to the authenticated user ────────────────────────
exports.createCheckout = onCall(
  { secrets: [SQUARE_ACCESS_TOKEN] },
  async (request) => {
    const uid = request.auth && request.auth.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Please sign in to purchase.');

    const plan = request.data && request.data.plan;
    if (plan !== 'full' && plan !== 'pro') {
      throw new HttpsError('invalid-argument', 'Unknown plan.');
    }

    const payload = {
      idempotency_key: crypto.randomUUID(),
      order: {
        location_id: SQUARE_LOCATION_ID.value(),
        line_items: [
          {
            name: PLAN_NAMES[plan],
            quantity: '1',
            base_price_money: { amount: PRICES[plan], currency: 'USD' },
          },
        ],
        // The webhook trusts these values, never the client.
        metadata: { uid: uid, plan: plan },
      },
      checkout_options: {
        redirect_url: `${SUCCESS_BASE_URL.value()}/success/?plan=${plan}`,
        ask_for_shipping_address: false,
      },
    };

    const res = await fetch(`${apiBase()}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Square-Version': SQUARE_VERSION,
        Authorization: `Bearer ${SQUARE_ACCESS_TOKEN.value()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.payment_link) {
      console.error('Square createPaymentLink error', JSON.stringify(json));
      throw new HttpsError('internal', 'Could not create checkout.');
    }
    return { url: json.payment_link.url };
  },
);

// ── Square webhook: verify, confirm payment, grant entitlement ───────────────
exports.squareWebhook = onRequest(
  { secrets: [SQUARE_WEBHOOK_SIGNATURE_KEY, SQUARE_ACCESS_TOKEN] },
  async (req, res) => {
    // 1. Verify the signature over (notificationUrl + rawBody).
    const signature = req.get('x-square-hmacsha256-signature') || '';
    const raw = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body || {});
    const hmac = crypto.createHmac('sha256', SQUARE_WEBHOOK_SIGNATURE_KEY.value());
    hmac.update(SQUARE_WEBHOOK_URL.value() + raw);
    const expected = hmac.digest('base64');

    let valid = false;
    try {
      const a = Buffer.from(signature);
      const b = Buffer.from(expected);
      valid = a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch (_) {
      valid = false;
    }
    if (!valid) {
      res.status(401).send('invalid signature');
      return;
    }

    try {
      const event = req.body || {};
      if (event.type === 'payment.updated' || event.type === 'payment.created') {
        const payment = event.data && event.data.object && event.data.object.payment;
        if (!payment || payment.status !== 'COMPLETED') {
          res.status(200).send('ignored (not completed)');
          return;
        }
        const orderId = payment.order_id;
        if (!orderId) {
          res.status(200).send('ignored (no order)');
          return;
        }

        // 2. Pull the order to read trusted metadata + amount.
        const orderRes = await fetch(`${apiBase()}/v2/orders/${orderId}`, {
          headers: {
            'Square-Version': SQUARE_VERSION,
            Authorization: `Bearer ${SQUARE_ACCESS_TOKEN.value()}`,
          },
        });
        const orderJson = await orderRes.json();
        if (!orderRes.ok || !orderJson.order) {
          console.error('Square order fetch failed', JSON.stringify(orderJson));
          res.status(200).send('order fetch failed');
          return;
        }

        const order = orderJson.order;
        const meta = order.metadata || {};
        const uid = meta.uid;
        const plan = meta.plan;
        if (!uid || (plan !== 'full' && plan !== 'pro')) {
          res.status(200).send('no entitlement metadata');
          return;
        }

        // 3. Defense in depth: confirm the paid amount matches the plan.
        const paid = (order.total_money && order.total_money.amount) || 0;
        if (paid < PRICES[plan]) {
          console.warn('Amount mismatch for', uid, plan, paid);
          res.status(200).send('amount mismatch');
          return;
        }

        // 4. Grant the tier with the Admin SDK; never downgrade.
        const ref = db.collection('users').doc(uid);
        await db.runTransaction(async (tx) => {
          const snap = await tx.get(ref);
          const current = (snap.exists && snap.data().tier) || 'free';
          const next = RANK[plan] > (RANK[current] || 0) ? plan : current;
          tx.set(
            ref,
            { tier: next, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
            { merge: true },
          );
        });
      }

      res.status(200).send('ok');
    } catch (err) {
      console.error('Webhook handler error', err);
      // 200 so Square doesn't retry forever; the error is logged for inspection.
      res.status(200).send('error logged');
    }
  },
);
