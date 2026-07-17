# Athlex

The marketplace where athletes showcase their reach and brands find, vet, and sponsor the right talent — with secure payments built in.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase**, deployable to **Vercel**. Dark mode only.

---

## What's in here

- **Marketing site** — landing page (with the "reach telemetry" signature), dedicated `/for-athletes` and `/for-brands` pages, `/pricing`, responsive nav with a mobile drawer.
- **Auth** — Supabase email/password sign-up (athlete/brand role selection) and login, with a demo-credentials autofill in dev.
- **Dashboards** — athlete and sponsor dashboards behind an auth guard, each with its own sidebar (+ mobile drawer): Overview, Profile, Inquiries, Deals, Payouts / Opportunities, and a shared Billing page.
- **Discovery** — search page with filters, backed by real Supabase queries, plus public athlete profile pages.
- **Billing (demo)** — plan switcher, dummy payment-method form, and billing history. No live Stripe charge is made — see [Billing / Stripe status](#billing--stripe-status) below.
- **Database** — full Postgres schema with enums, indexes, and Row Level Security (`supabase/migrations/`).
- **Design system** — tokens in `tailwind.config.ts` + `app/globals.css` (single dark theme), primitives in `components/ui`.

---

## Prerequisites

- **Node.js 20+**
- **pnpm** (`npm install -g pnpm`) — `npm` also works, the lockfiles for both are committed
- A **Supabase** project (free tier is fine)
- A **Stripe** account (test mode) — only needed once you wire up real billing; the app runs fully without it

---

## Step-by-step: run it locally

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```
Fill in `.env.local`:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (keep secret) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys (optional for now) |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (optional for now) |
| `STRIPE_WEBHOOK_SECRET` | from `stripe listen` (optional for now) |

### 3. Set up the database
Using the Supabase CLI:
```bash
supabase link --project-ref <your-project-ref>
supabase db push          # applies every file in supabase/migrations/, in order
```
Then seed the lookup tables (sports, industries) — paste `supabase/seed.sql` into the Supabase SQL editor, or run it via `psql`/the CLI. `supabase db push` does **not** run `seed.sql` automatically.

> No CLI? Open the Supabase **SQL Editor** and run each file in `supabase/migrations/` in numeric order, then `seed.sql`.

### 4. Start the app
```bash
pnpm dev
```
Open **http://localhost:3000**. The login page shows demo credentials in dev mode — use "Fill in" to sign in without creating an account (you'll need that user to actually exist in your Supabase project first; see `scripts/seed-demo-athletes.mjs` for a script that provisions demo athletes end-to-end).

### 5. (Optional) Forward Stripe webhooks
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET` and restart `pnpm dev`. Not required to use the app — see below.

---

## Billing / Stripe status

Stripe is **not wired up yet**. The `/billing` page and the pricing page's Pro/Elite buttons run a self-contained demo flow instead:

- Switching plans calls `lib/actions/billing.ts`, which writes the new tier directly to the `subscriptions` table and shows a "Payment successful" popup — no card is charged, nothing touches Stripe.
- The payment-method form on `/billing` is cosmetic; it doesn't persist anywhere.
- `lib/stripe/client.ts`, `app/api/checkout/route.ts`, and `app/api/webhooks/stripe/route.ts` are real, working Stripe integration code (checkout session creation, signature-verified webhook with idempotency) — they're just not called from the UI yet. To go live: set the Stripe env vars, add real `STRIPE_PRICE_PRO` / `STRIPE_PRICE_ELITE` price IDs, and point the billing page's "Switch plan" action at `/api/checkout` instead of `upgradePlan`.

---

## Scripts

| Command | Does |
|---|---|
| `pnpm dev` | Run locally |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `node scripts/seed-demo-athletes.mjs` | Provisions demo athlete users + profiles in Supabase (requires `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` in the environment) |

---

## Deploy to production (Vercel)

1. Push this repo to GitHub.
2. Import it in **Vercel** → New Project.
3. Add all env vars from `.env.local` to the Vercel project (set `NEXT_PUBLIC_APP_URL` to your domain).
4. Deploy. Every PR gets a preview URL automatically.
5. When you're ready to go live with billing: add a Stripe webhook endpoint pointing to `https://<your-domain>/api/webhooks/stripe`, put its signing secret in Vercel, and flip the billing page over to `/api/checkout` (see above).

---

## Project structure

```
app/
  (marketing)/       landing, pricing, for-athletes, for-brands + shared nav/footer
  (auth)/            login, signup (Supabase auth)
  (dashboard)/       athlete + sponsor dashboards, shared /billing (auth-guarded)
    athlete/         overview, profile, inquiries, deals, payouts
    sponsor/         overview, profile, opportunities, deals
  athletes/[slug]/   public athlete profiles
  search/            discovery + filters
  api/               health check, stripe checkout + webhook
  icon.tsx           generated favicon
components/
  ui/                button (with loading state), card, badge, input, avatar, spinner
  marketing/         nav (+ mobile drawer), footer, stat-ticker, checkout button, athlete CTA
  dashboard/         nav link, mobile sidebar, billing plans, payment method form, opportunity form
lib/
  supabase/          browser, server (with request-deduped auth helpers), admin, middleware clients
  stripe/            server client + plan definitions
  actions/           server actions — auth, profile, inquiries, opportunities, billing
  data/              athlete read queries
  validation/        zod schemas (shared client + server)
supabase/
  migrations/        schema + RLS, applied in order (0001–0012)
  seed.sql           lookup data (sports, industries)
scripts/
  seed-demo-athletes.mjs   provisions demo athlete users + profiles
middleware.ts         session refresh + route protection
```

---

## Notes

- Auth and dashboards are fully wired to Supabase — no demo/hardcoded data remains for athletes, profiles, inquiries, deals, or opportunities. RLS policies scope every query to the signed-in user; several tables (`sports`, `industries`, `deals`, `subscriptions`) needed explicit policies added after the initial schema — see the numbered migrations for what each one fixes.
- The webhook (`app/api/webhooks/stripe/route.ts`) already has idempotency via a `webhook_events` table and is ready to be the source of truth for real payment state once Stripe is connected — never mark a deal paid from the client.
- Stripe uses two models when you do connect it: **Billing** (subscriptions) and **Connect** (marketplace payouts).
