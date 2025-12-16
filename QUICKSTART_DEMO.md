# Quick Start: Get Demo Mode Running

Your Supabase project is ready! Here's what to do next.

## ✅ Done
- `.env` file created with your Supabase URL and anon key
- Dev server running at **http://localhost:3001**
- Supabase adapters configured and ready

## 📋 Next: Setup Database Tables

### Step 1: Copy the SQL
Open `scripts/setup-supabase.js` and copy the SQL block (between `/* */`).

### Step 2: Run in Supabase
1. Go to: https://app.supabase.com
2. Select your project
3. Click "SQL" → "New query"
4. Paste the SQL
5. Click "Run"

Wait for all tables to be created. You should see:
- elections
- parties
- voters
- votes
- audit_logs

### Step 3: Enable Realtime
1. Go to "Database" → "Replication" → "Realtime"
2. Toggle ON for `elections` and `votes`
3. Save

## 🎯 Test the App

### Demo Admin Credentials
- Email: `admin@voting.demo`
- Password: `demo12345`

### Flow
1. **Admin Page**: Create an election
2. **Add Parties**: Register 3–5 candidates
3. **Add Voters**: Register test wallet addresses (e.g., `0x742d35Cc6634C0532925a3b844Bc9e7595f42bE2`)
4. **Start Election**: Click "Start Voting"
5. **Vote Page**: Connect MetaMask, select a party, vote
6. **Results**: Watch vote count update in realtime
7. **Admin Page**: End election and publish results

## 🔧 Troubleshooting

**App not loading?**
- Check browser console (F12) for errors
- Ensure `.env` has correct URL and key

**Permission errors?**
- RLS policies are permissive for demo (allow true)
- In production, restrict to authenticated admins

**Votes not saving?**
- Verify `voters` table has a test wallet
- Check that `(election_id, voter_id)` is unique (prevents double voting)

## 📚 Files
- Frontend: http://localhost:3001
- Supabase: https://app.supabase.com/project/kxzgjkeuwmkmqgdlleox
- Setup guide: `docs/SUPABASE_SETUP_GUIDE.md`
- Schema: `docs/SUPABASE_SCHEMA.md`

---

**Questions?** Check the docs or the browser console for detailed error messages.
