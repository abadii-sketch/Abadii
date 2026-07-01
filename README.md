# Abadii / عبادي

Heat-ready labour recruitment. Employers in heatwave-affected regions search, filter, and shortlist verified, heat-acclimated workers ready to relocate — with sponsorship tracking built in.

Stack: Next.js 14 (App Router) · TypeScript · Prisma + PostgreSQL · NextAuth (credentials) · Tailwind CSS · next-intl (EN/AR, full RTL).

This app was scaffolded and type-checked end-to-end. The only thing not run in the build sandbox was downloading Prisma's query-engine binary and Google Fonts, both blocked by sandbox network rules — neither is an issue on a normal host with internet access.

---

## 1. What's included

- **Auth**: email/password sign-up and sign-in, role-based (worker vs employer)
- **Worker profiles**: trade, years of outdoor heat experience, languages, availability, heat-safety training and medical clearance flags, verification status
- **Employer dashboard**: filter by trade / country of origin / min. heat experience, shortlist workers, free-plan unlock limit (5/month) as a monetization hook you can extend
- **Public worker profile page**
- **Bilingual routing**: `/en/...` and `/ar/...`, with automatic RTL layout switching for Arabic
- **Database schema** covering users, worker/employer profiles, skills, shortlists, and reviews — ready for the features in the brainstorm (verification, ratings, sponsorship tracking) to be layered on

Not included yet (intentionally, since you said monetization/extra features come later): payments, file/video upload storage, messaging, visa-document tracker UI, admin moderation panel. The schema and folder structure are built to make adding these straightforward.

---

## 2. Local setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template and fill in values
cp .env.example .env

# 3. Push the schema to your database
npm run db:push

# 4. (Optional) Seed demo accounts + a sample worker
npm run db:seed
# Creates worker.demo@abadii.app / employer.demo@abadii.app, password: password123

# 5. Run the dev server
npm run dev
```

Visit `http://localhost:3000` — it will redirect to `/en`.

---

## 3. Getting a Postgres database (pick one, free tiers all work)

**Neon** (recommended, generous free tier, serverless Postgres):
1. Go to neon.tech → create a project
2. Copy the connection string it gives you (includes `?sslmode=require`)
3. Paste into `DATABASE_URL` in `.env`

**Supabase**:
1. Create a project at supabase.com
2. Project Settings → Database → Connection string → URI
3. Use the "Transaction" pooler string for `DATABASE_URL`

**Railway**: New Project → Add PostgreSQL → copy the `DATABASE_URL` from the Variables tab.

---

## 4. Deploying to Vercel (recommended host for Next.js)

1. Push this project to a GitHub repository.
2. Go to vercel.com → **New Project** → import the repo.
3. In **Environment Variables**, add:
   - `DATABASE_URL` — your Postgres connection string from step 3
   - `NEXTAUTH_SECRET` — generate one locally with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your production URL, e.g. `https://abadii.vercel.app` (you can add this after the first deploy gives you the URL, then redeploy)
4. Deploy. Vercel runs `npm run build`, which runs `prisma generate` automatically via the `postinstall` script.
5. After the first deploy, run the schema push against your production database once:
   ```bash
   DATABASE_URL="your-production-url" npx prisma db push
   ```
   You can run this from your local machine — it just needs the connection string.
6. Visit your deployed URL and test sign-up as both a worker and an employer.

### Custom domain
In Vercel: Project → Settings → Domains → add `abadii.com` (or whatever you register) and follow the DNS instructions. Update `NEXTAUTH_URL` to match once it's live.

---

## 5. Project structure

```
prisma/schema.prisma          Database models
prisma/seed.ts                 Demo data
src/i18n.ts, middleware.ts     Locale routing (en/ar) + RTL
src/messages/en.json, ar.json  All UI copy — edit these to change any text
src/lib/auth.ts                NextAuth config
src/lib/prisma.ts              Prisma client singleton
src/components/Logo.tsx        Abadii logo (SVG, reusable)
src/app/(site)/[locale]/       All pages (landing, sign-up/in, worker onboarding, employer dashboard, worker profile)
src/app/api/                   Route handlers (register, workers, shortlist, auth)
```

---

## 6. Extending toward monetization (next phase, as you said)

The schema already has `EmployerPlan` (FREE / GROWTH / UNLIMITED) and a monthly unlock counter enforced in `src/app/api/shortlist/route.ts`. To add real billing:

1. Add Stripe Checkout for employer plan upgrades, store the Stripe customer/subscription ID on `EmployerProfile`.
2. On successful payment webhook, update `employer.plan`.
3. Gate the unlock limit check (already written) on `employer.plan !== 'FREE'`.

Other natural next builds, in rough priority order: file upload for ID docs / video intros (use S3 or Vercel Blob), an admin view to approve `verificationStatus`, in-app messaging between shortlisted employer/worker pairs, and a visa/sponsorship checklist attached to each `Shortlist` record.
