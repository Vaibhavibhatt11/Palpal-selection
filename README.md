# PalPal Catalog

Secure, mobile-first product catalog + admin panel for a local shop.

## Tech
- Next.js (App Router) + TypeScript + Tailwind
- Prisma ORM + Neon Postgres (free)
- NextAuth Credentials (admin login)
- Zod validation
- Cloudinary upload (fallback to Supabase Storage or local dev)

## Setup
1) Install deps
```bash
npm install
```

2) Create `.env` from `.env.example`

3) Neon Postgres (free)
- Create a Neon project.
- Set `DATABASE_URL` to the **pooler** connection string (`-pooler` host) with `?sslmode=require&pgbouncer=true`.

4) Cloudinary (preferred)
- Create a Cloudinary account and set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- If you skip Cloudinary, set Supabase Storage variables (below) or local dev storage will be used.

5) Supabase Storage fallback (optional)
- If you want storage fallback, create a Supabase project and a bucket named `product-images` (public).
- Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Prisma
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

The seed:
- Creates default ShopSettings
- Creates admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Adds 5 sample products

## Run
```bash
npm run dev
```
Open http://localhost:3000

## Vercel (free, no custom domain)
1) Push repo to GitHub.
2) Import in Vercel.
3) Add environment variables from `.env.example`.
4) Deploy.

## Notes
- Admin routes are protected by middleware.
- Login rate-limit is enforced per email+IP.
- Images are validated (type + size) before upload.
"# Palpal-selection" 
