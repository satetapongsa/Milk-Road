# Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run:
- For fresh schema: [`supabase/schema.sql`](supabase/schema.sql)
- If your tables already exist (`customers/addresses/orders/order_items/payments/admin_users`): [`supabase/existing_tables_patch.sql`](supabase/existing_tables_patch.sql)
3. In project settings, copy:
- `Project URL`
- `anon public key`
4. Create `.env` in project root:

```bash
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_ADMIN_PASSWORD=887624
```

5. Restart dev server (`npm run dev`).

Notes:
- Orders now save to Supabase (`orders`, `order_items`).
- Admin dashboard, receipt, and order history read from Supabase.
- If env vars are missing, app falls back to `localStorage` automatically.

## Deploy to Vercel

1. Push this project to GitHub.
2. In Vercel, click `Add New Project` and import the repo.
3. Framework preset: `Vite` (auto-detected).
4. Add environment variables in Vercel project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PASSWORD`
5. Deploy.

Vercel build settings (default):
- Build command: `npm run build`
- Output directory: `dist`
