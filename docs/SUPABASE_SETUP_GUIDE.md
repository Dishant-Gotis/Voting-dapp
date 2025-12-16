# Supabase Setup Guide (Beginner Friendly)

This guide helps you set up Supabase for the voting dApp demo mode. It uses very simple language and assumes zero prior knowledge.

## What You Will Do
- Create a Supabase account and project
- Get your keys
- Create the database tables
- Turn on Row Level Security (RLS)
- Enable realtime updates
- Connect the frontend
- Protect admin-only actions

---

## 1) Create a Supabase Account
1. Go to https://supabase.com
2. Click "Start your project" and sign up (Google or email).
3. Verify your email if asked.

## 2) Create a Project
1. In the Supabase dashboard, click "New project".
2. Fill these:
   - Project Name: Voting DApp Demo
   - Database Password: choose a strong password (keep it safe)
   - Region: pick the closest to you
3. Click "Create project". Wait until it finishes provisioning.

## 3) Get Your Keys
1. In your project, go to "Project Settings" → "API".
2. You will see:
   - SUPABASE_URL: shown as "Project URL" at the top
   - SUPABASE_ANON_KEY: shown under "API keys" as "anon (public)"
   - SUPABASE_SERVICE_ROLE: shown under "API keys" as "service_role"

What each key is for:
- SUPABASE_URL: the address of your Supabase project. The frontend needs it.
- SUPABASE_ANON_KEY: safe for the browser; limited permissions. The frontend uses it.
- SUPABASE_SERVICE_ROLE: full power key; NOT for the browser. Use only in the Supabase SQL console or server-side scripts.

Where to paste keys (frontend):
1. Open your project folder: D:/GIT-REPOS/voting-dapp
2. Create a file named ".env" (if not exists).
3. Paste these lines and replace with your values:

```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Do NOT put SUPABASE_SERVICE_ROLE in ".env" for the frontend.

Optional (Vite-style variables also work):
```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

---

## 4) Setup Tables
We already provided a full schema with all tables in docs/SUPABASE_SCHEMA.md.

Steps:
1. In Supabase dashboard, go to "SQL" → "New query".
2. Copy the SQL from docs/SUPABASE_SCHEMA.md (the big block under "Database Setup SQL").
3. Click "Run". This creates:
   - elections
   - parties
   - voters
   - votes
   - audit_logs
   - indexes and enables RLS

---

## 5) Enable Row Level Security (RLS)
RLS protects your data directly in the database.

Simple rules:
- elections: everyone can read; only admins can write
- parties: everyone can read; only admins can write
- voters: only admins can read or write
- votes: authenticated users can insert exactly one vote per election; only admins can read

How to apply:
1. Use the example policies in docs/SUPABASE_SCHEMA.md (see the RLS section).
2. Paste them into the Supabase SQL editor and click "Run".

Result:
- Duplicate votes are blocked by a unique constraint on (election_id, voter_id).
- Admin-only writes enforced by JWT `role = 'admin'`.

---

## 6) Enable Realtime
Realtime sends live updates to the app.

1. In Supabase dashboard, go to "Database" → "Replication" → "Realtime".
2. Enable realtime for tables: elections and votes.
3. Save changes.

Now users see election status and vote counts update instantly.

---

## 7) Connect the Frontend
We already added the Supabase client in `src/services/supabaseClient.ts`.

Steps:
1. Make sure the package is installed:
   - If needed, run `npm install @supabase/supabase-js`
2. Ensure your ".env" has `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`.
3. Start the app:
   - Run `npm run dev`
4. In the app, choose Demo mode.
5. Connect MetaMask (we only read your wallet address; no blockchain transactions in demo mode).

---

## 8) Secure Admin Access
Admin actions (create election, add parties, add voters) must be restricted.

Beginner-friendly approach:
- Use Supabase Auth to sign in admins.
- Add a custom claim in the JWT (e.g., `role = 'admin'`).
- Write RLS policies that allow writes only if `auth.jwt() ->> 'role' = 'admin'`.

For first tests:
- Use the demo admin in the UI.
- Later, switch to real Supabase Auth users with the `admin` role.

---

## Quick Test Checklist
- Create an election (Admin page)
- Add parties
- Add a test voter (wallet address)
- Start the election
- Vote from the Vote page (MetaMask connected)
- See instant updates
- End the election and publish results

---

## Common Issues
- Dev server fails to start:
  - Check your ".env" values are correct
  - Restart `npm run dev` after changing ".env"
- Permission errors:
  - Confirm RLS policies match your needs
  - Check your user has the right role (admin vs regular)
- Double voting:
  - The database unique constraint blocks duplicates automatically

---

## Where Things Are in This Repo
- Supabase client: `src/services/supabaseClient.ts`
- Demo adapters using Supabase:
  - Voting: `src/adapters/DemoVotingAdapter.ts`
  - Election: `src/adapters/DemoElectionAdapter.ts`
  - Admin: `src/adapters/DemoAdminAdapter.ts`
- Schema & policies: `docs/SUPABASE_SCHEMA.md`
- This setup guide: `docs/SUPABASE_SETUP_GUIDE.md`

You’re done! If you want, I can seed sample data and run the app to verify everything end-to-end.