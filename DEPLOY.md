# Ticket Panda Frontend — Vercel deploy

This repo (`tickets-panda-frontend`) deploys as-is on Vercel (Vite preset).

## Steps

1. **Import** this repo in Vercel. Framework preset: Vite. Build command
   `npm run build`, output directory `dist` (see `vercel.json`).
2. **Environment variable** (Production + Preview):
   - `VITE_API_URL` = `https://YOUR-API-DOMAIN/api/v1`
     (your VPS backend, HTTPS required — the API sets `Secure` cookies,
     which browsers reject over plain HTTP)
3. **Deploy.** SPA fallback is handled by the `rewrites` rule in
   `vercel.json`, so deep links like `/t/college/events/fest` work.
4. Optional: add your custom domain in Vercel project settings.

## Switching backend URL later

Change `VITE_API_URL` in Vercel project settings and redeploy
(no code change needed — the API client reads it at build time).
