# BuildForge AI

Plan car modifications, estimate build costs, and project horsepower — staged like a real shop would do it. A fully client-side Next.js app with no backend, no paid APIs, and no AI subscriptions. Everything runs on local data in the browser.

![BuildForge AI](public/.nojekyll)

## Stack

- **Next.js 14** (App Router, static export)
- **TypeScript**
- **Tailwind CSS** with a custom motorsport-telemetry design system
- **Framer Motion** for scroll, parallax, and microinteractions
- **jsPDF** for client-side PDF export
- Local JSON data (64+ vehicles, 42+ modifications) — no external services

## Features

- **Build Planner** — vehicle + budget + HP goal + build type → staged roadmap with per-stage cost and horsepower
- **Three tiers** — Free preview (first 2 mods), Full Build ($9.99), Performance Build Pro ($19.99)
- **Square Payment Links** — checkout opens in a new tab, redirects to a success page that unlocks content
- **PDF export** — shop-ready spec sheet
- **Marketing** — referral codes, affiliate + UTM tracking via URL params
- **Hidden admin dashboard** at `/admin` — builds, purchases, revenue, top vehicles (local storage)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build (static export)

```bash
npm run build
```

The exported static site lands in `out/`.

## Accounts & saving purchases (Firebase)

The app supports optional account login (email/password + Google) and saves each
purchase to the user's account in Firestore, so an unlock follows them across
devices. If you don't configure Firebase, the app still works — purchases just
unlock on the local device only and the login UI is hidden.

### 1. Create a Firebase project
1. Go to console.firebase.google.com → **Add project**.
2. Inside the project, **Build → Authentication → Get started**. Enable **Email/Password** and **Google** sign-in providers.
3. **Build → Firestore Database → Create database** (start in production mode, pick a region).
4. Project settings (gear icon) → **Your apps → Web (`</>`)** → register an app → copy the `firebaseConfig` values.

### 2. Wire the keys in
Copy `.env.local.example` to `.env.local` and paste your values:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourproject
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

These are public by design (Firebase web keys are not secrets); access is controlled by security rules.

### 3. Publish the Firestore rules
Copy the contents of `firestore.rules` into Firebase Console → Firestore → **Rules** → Publish.

### 4. Authorize your domain
Authentication → **Settings → Authorized domains** → add your live domain (e.g. `yourname.github.io`, your Netlify/Vercel domain, and `localhost` is already allowed). Google sign-in is blocked on unlisted domains.

### 5. Rebuild
`NEXT_PUBLIC_*` values are baked in at build time, so run `npm run build` again after editing `.env.local`.

> **Security note:** this is a client-only app, so the account tier is written from the browser. That makes unlocks *persistent and synced*, but not tamper-proof — a technical user could grant themselves a tier. To fully secure purchases, verify Square payments server-side with a webhook + Cloud Function that writes the tier using the Admin SDK, then set the Firestore user-doc write rule to `if false`. See `firestore.rules` for the exact line.

## Secure backend (tamper-proof purchases)

By default the app unlocks purchases on the client, which syncs across devices
but is **not tamper-proof**. To make purchases genuinely secure, deploy the
included Cloud Functions backend (`functions/`). It moves payment verification
to the server: the browser can no longer grant itself a plan.

**How it works:** a signed-in user's Buy click calls the `createCheckout`
function, which creates a Square link stamped with their `uid` and a server-set
price. After payment, Square calls `squareWebhook`, which verifies the request
signature, confirms the payment completed, and writes the tier with the Admin
SDK. Firestore rules forbid the browser from writing tiers at all. The unlock
then appears in the UI live via a realtime listener.

> **Cost:** Cloud Functions require Firebase's **Blaze** (pay-as-you-go) plan,
> which has a free monthly allotment. At low volume this is effectively $0, but
> a card must be on file.

### 1. Prerequisites
- Firebase Auth + Firestore already set up (see the section above).
- Firebase CLI: `npm i -g firebase-tools`, then `firebase login`.
- Upgrade the project to the **Blaze** plan in the Firebase Console.

### 2. Point the CLI at your project
From the project root:

```bash
firebase use --add        # pick your Firebase project, give it an alias
cd functions && npm install && cd ..
```

### 3. Configure Square (server side)
Get an **access token** and **location ID** from the Square Developer dashboard
(developer.squareup.com → your app → Credentials / Locations).

```bash
cp functions/.env.example functions/.env     # fill SQUARE_ENV, SQUARE_LOCATION_ID, SUCCESS_BASE_URL
firebase functions:secrets:set SQUARE_ACCESS_TOKEN
```

(`SQUARE_WEBHOOK_URL` is filled in step 5, and `SQUARE_WEBHOOK_SIGNATURE_KEY` in step 6.)

### 4. First deploy
```bash
firebase deploy --only functions,firestore:rules
```

Note the deployed URL of `squareWebhook` (shown in the output, like
`https://us-central1-YOURPROJECT.cloudfunctions.net/squareWebhook`).

### 5. Register the webhook in Square
Square Developer dashboard → your app → **Webhooks → Subscriptions → Add endpoint**:
- URL: the `squareWebhook` URL from step 4.
- Events: subscribe to **payment.updated** (and optionally **payment.created**).
- Copy the generated **Signature key**.

Put that URL into `functions/.env` as `SQUARE_WEBHOOK_URL`, then store the signature key:

```bash
firebase functions:secrets:set SQUARE_WEBHOOK_SIGNATURE_KEY
firebase deploy --only functions      # redeploy so the new config takes effect
```

### 6. Turn the backend on in the frontend
In `.env.local`:

```
NEXT_PUBLIC_USE_BACKEND=true
```

Rebuild and redeploy the site (`npm run build`). Checkout now requires login and
runs entirely through the verified server flow; the legacy Square dashboard
links are no longer used.

### 7. Test
Use Square **sandbox** first (`SQUARE_ENV=sandbox`, sandbox token, sandbox test
cards). Buy a plan while logged in — after payment you should be redirected to
`/success`, see "Confirming payment", and watch it flip to unlocked within a few
seconds as the webhook lands.

## Square payment redirects (legacy / no-backend mode)

Open `src/lib/payments.ts` and replace the two placeholders with your real Square Payment Link URLs:

```ts
export const FULL_BUILD_PAYMENT_LINK = 'https://square.link/u/XXXXXXXX';
export const PRO_BUILD_PAYMENT_LINK  = 'https://square.link/u/YYYYYYYY';
```

In your Square Payment Link settings, set the **post-payment redirect URL** to your deployed success page:

- Full: `https://YOURDOMAIN/success/?plan=full`
- Pro:  `https://YOURDOMAIN/success/?plan=pro`

The app also appends `redirect_url`, `ref`, `affiliate`, and `utm_*` parameters automatically when present.

## Marketing / referral links

Any visitor arriving with tracking params has them captured and attached to purchases:

```
https://YOURDOMAIN/?ref=CREATORCODE&utm_source=youtube&utm_campaign=summer
```

## Admin dashboard

Visit `/admin` and enter the access code (`forge` by default — change `PASSCODE` in `src/app/admin/page.tsx`). All metrics are stored in the browser via `localStorage`.

## Deployment

### Vercel
Import the repo and deploy. No configuration needed.

### Cloudflare Pages
Build command `npm run build`, output directory `out`.

### GitHub Pages
GitHub Pages serves from a subpath (`/<repo-name>/`). Build with the base path set:

```bash
BASE_PATH=/your-repo-name npm run build
```

Then publish the `out/` directory (a `.nojekyll` file is already included so asset folders aren't stripped). The repo reads `BASE_PATH` in `next.config.js` and wires up `basePath` / `assetPrefix` automatically.

## Notes

Cost and horsepower figures are planning estimates, not binding quotes. Tune the data in `src/lib/vehicles.ts` and `src/lib/mods.ts` to match your market.
