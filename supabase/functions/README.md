Create_upload_url function

This Edge Function returns a signed upload (or download fallback) URL for a given object path in a bucket using the SUPABASE_SERVICE_KEY.

Deployment (Supabase Edge Functions):

- Place `create_upload_url.ts` in your functions directory and deploy with `supabase` CLI, or configure via the Supabase UI.
- Set environment variable `SUPABASE_SERVICE_KEY` and `SUPABASE_URL` for the function.

Example client usage (frontend):

- Call your deployed function endpoint (e.g., `https://<your-edge-url>/create_upload_url`) with POST body `{ bucket, path, expires }`.
- The function returns `{ uploadUrl }` (if supported) or `{ downloadUrl }` as a fallback.

Security:

- Keep the service role key only in the function environment; never expose it to the browser.
- Prefer returning short-lived signed upload URLs and validate file paths/names server-side if necessary.
