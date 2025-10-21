# Supabase Migration Guide (JD Marc Construction)

This file contains the minimal steps to migrate the backend to Supabase and update the frontend.

1) Create a new Supabase project
   - Name: `JD Marc Construction`
   - Enable Auth, Database, Storage, Edge Functions

2) Apply database schema
   - In Supabase Dashboard → SQL Editor, run `supabase/schema.sql` from this repo or use psql with a service role key.

3) Configure Auth
   - Enable Email + Password provider.
   - Under 'Authentication' → 'Settings' enable email confirmations if desired.
   - (Optional) Add custom claims via server-side function for roles.

4) Create Storage bucket
   - Create bucket `project_files` and set public or RLS-based policies as needed.

5) Add RLS policies
   - Review `supabase/schema.sql` for example policies. Adjust to your needs.

6) Edge Functions
   - Deploy `supabase_functions/register.ts` and `supabase_functions/login.ts` to Supabase Edge Functions if you want server-side endpoints.
   - Set environment variables: `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in the Edge Functions settings.

7) Update frontend envs
   - Copy `.env.local.example` to `.env.local` and set values:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

8) Replace API usage
   - Replace axios-based calls in `src/services/api.ts` with `src/services/supabaseService.ts` helper functions.
   - Update UI flows to use `supabase.auth` for session management and `supabase.from('...')` for data.

9) Remove old backend

   - When frontend works fully against Supabase, archive the `backend/` folder using the provided scripts:
     - PowerShell: `.\scripts\archive-backend.ps1`
     - Node: `node scripts/archive-backend.js`
     - This will move `backend/` to `backend-archive-<timestamp>` so you can restore if needed.

Additional features added by migration

- Database trigger: `auth.users` -> `public.users` sync trigger is included in `supabase/schema.sql`.
- Analytics and notifications tables and example policies are included.
- Helper functions and client wrappers are added in `src/services/supabaseService.ts`.

Deploy frontend to Hostinger

- Build: `npm run build`
- Upload `dist` (or your build output) to Hostinger per your existing deploy scripts.

If you want, I can apply the axios -> Supabase refactor in the repo next. I can also create PR-ready commits for removing the `backend/` directory after tests pass.
