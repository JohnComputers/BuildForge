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

## Configure Square payment links

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
