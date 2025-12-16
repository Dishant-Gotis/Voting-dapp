# Vercel Deployment Guide (Beginner Friendly)

This guide shows you how to deploy the voting app to Vercel safely, step-by-step, assuming zero prior knowledge.

## What You Will Do
- Create a Vercel account
- Connect your GitHub
- Import this project
- Add environment variables (keys and app config)
- Deploy, and learn how to redeploy when things change

---

## 1) Create a Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up".
3. Choose GitHub login (recommended) or email.

## 2) Connect GitHub
1. In Vercel, go to the dashboard.
2. Click "New Project".
3. If asked, click "Connect GitHub" and authorize Vercel.
4. Select the GitHub account/organization that holds your repo.

## 3) Import the Project
1. In "New Project", choose your repository: `Voting-dapp`.
2. Vercel will detect a Vite/React app automatically.
3. Keep defaults unless you know you need changes:
   - Framework: Vite
   - Root Directory: `/` (the repo root)
   - Build Command: `vite build`
   - Output Directory: `dist`

Click "Import".

---

## 4) Set Environment Variables
Environment variables are secrets/config your app needs. You paste them in Vercel so they are safe and available to the app.

Open your Vercel project → "Settings" → "Environment Variables".

### Required Variables
Supabase:
- `REACT_APP_SUPABASE_URL` → your Supabase Project URL
- `REACT_APP_SUPABASE_ANON_KEY` → your Supabase anon public key

Mode configuration:
- `VOTING_DEFAULT_MODE` → `DEMO` or `BLOCKCHAIN`

Admin credentials (only if you use demo admin login):
- `DEMO_ADMIN_EMAIL` → e.g. `admin@voting.demo`
- `DEMO_ADMIN_PASSWORD` → e.g. `demo12345`

Optional (Vite-style names also supported by Vite builds):
- `VITE_SUPABASE_URL` → same as above
- `VITE_SUPABASE_ANON_KEY` → same as above

Important: Do NOT add `SUPABASE_SERVICE_ROLE` to Vercel. That key is server-only; it should not be exposed to the browser. Use it only in Supabase SQL console.

### Where to Paste
1. Add each variable in Vercel → "Settings" → "Environment Variables".
2. Choose Environment: `Production`. (You can also add for `Preview` and `Development`.)
3. Click "Add" after each variable.

### Build-time vs Runtime
- **Build-time** variables are read during the build (when Vercel runs `vite build`).
  - Vite typically uses `VITE_...` variables at build-time to embed values into the bundle.
- **Runtime** variables are read in the browser/app while it runs.
  - Our app also reads `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` at runtime using `process.env`.

What this means:
- If you change env vars, you should redeploy so the latest values are baked into the build and available at runtime.
- Keep both `REACT_APP_...` and `VITE_...` variants if you want maximum compatibility. Our app will work with `REACT_APP_...` alone.

---

## 5) Deploy
1. After adding env vars, go back to the project dashboard.
2. Click "Deploy" (or it will deploy automatically on import).
3. Wait for the build to complete. You’ll get a URL like `https://voting-dapp-yourproject.vercel.app`.

### Redeploys (When Things Change)
- If you push new code to `main`, Vercel will auto-deploy a new version.
- If you change environment variables, trigger a redeploy to apply them:
  - Click "Deployments" → "Redeploy" on the latest deployment
  - Or make a tiny commit to the repo (e.g., update README) to trigger a new build

### Preview vs Production
- Pull Requests create **Preview** deployments with their own URL.
- Merging to `main` creates/updates the **Production** deployment.

---

## Post-Deploy Checklist
- App loads correctly at the Vercel URL
- Mode is set as expected (Demo or Blockchain)
- In Demo mode:
  - Admin panel can create an election
  - Parties can be added
  - A test voter can be registered by wallet address
  - Voting works and updates appear in realtime

If something fails, check:
- Vercel env vars exist for the right environment (Production/Preview)
- Supabase URL/key are correct
- Supabase tables exist and Row Level Security (RLS) policies are active
- The browser console/network tab for any errors

---

## Optional Tips
- Protect your Production environment: do not share the Vercel project or env vars.
- Use Supabase Auth for real admin accounts and add RLS policies that check the JWT role.
- If switching modes, set `VOTING_DEFAULT_MODE` to `DEMO` for cloud-backed demo, or to `BLOCKCHAIN` to use the smart contract.

You’re deployed! If you want, I can add seed scripts and verify the deployed app end-to-end with a sample election and vote.