import { getReferral } from './storage';
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// ─────────────────────────────────────────────────────────────
// Replace these two placeholders with your real Square payment links.
// Create them at: Square Dashboard → Online → Payment Links.
// ─────────────────────────────────────────────────────────────
export const FULL_BUILD_PAYMENT_LINK: string = 'FULL_BUILD_PAYMENT_LINK';
export const PRO_BUILD_PAYMENT_LINK: string = 'PRO_BUILD_PAYMENT_LINK';

export type Plan = 'full' | 'pro';

export const PLAN_PRICE: Record<Plan, number> = {
  full: 4.99,
  pro: 9.99,
};

function basePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

/** Where Square should send the customer after a successful payment. */
export function successUrl(plan: Plan): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${basePath()}/success/?plan=${plan}`;
}

/**
 * Build the outbound checkout URL. Appends the affiliate / referral / UTM
 * context as query params so commissions can be reconciled in Square.
 */
export function buildCheckoutUrl(plan: Plan): string {
  const link = plan === 'pro' ? PRO_BUILD_PAYMENT_LINK : FULL_BUILD_PAYMENT_LINK;
  const ref = getReferral();
  const params = new URLSearchParams();

  if (ref.code) params.set('ref', ref.code);
  if (ref.affiliate) params.set('affiliate', ref.affiliate);
  if (ref.utm_source) params.set('utm_source', ref.utm_source);
  if (ref.utm_medium) params.set('utm_medium', ref.utm_medium);
  if (ref.utm_campaign) params.set('utm_campaign', ref.utm_campaign);
  params.set('redirect_url', successUrl(plan));

  // If the placeholder hasn't been replaced yet, return a marker the UI can detect.
  if (link === 'FULL_BUILD_PAYMENT_LINK' || link === 'PRO_BUILD_PAYMENT_LINK') {
    return `#payment-link-not-configured-${plan}`;
  }

  const sep = link.includes('?') ? '&' : '?';
  return `${link}${sep}${params.toString()}`;
}

export function isConfigured(plan: Plan): boolean {
  const link = plan === 'pro' ? PRO_BUILD_PAYMENT_LINK : FULL_BUILD_PAYMENT_LINK;
  return link !== 'FULL_BUILD_PAYMENT_LINK' && link !== 'PRO_BUILD_PAYMENT_LINK';
}

/**
 * Secure path: ask the Cloud Functions backend to create a Square checkout
 * bound to the signed-in user and a server-side price. Returns the URL to open.
 */
export async function createSecureCheckout(plan: Plan): Promise<string> {
  if (!functions) throw new Error('Secure backend is not configured.');
  const call = httpsCallable<{ plan: Plan }, { url: string }>(functions, 'createCheckout');
  const result = await call({ plan });
  if (!result.data || !result.data.url) throw new Error('No checkout URL returned.');
  return result.data.url;
}
