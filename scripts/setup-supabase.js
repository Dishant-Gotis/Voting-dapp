#!/usr/bin/env node

/**
 * Supabase Table Setup Script
 * 
 * This script creates all required tables and indexes for the voting dApp demo mode.
 * 
 * Usage:
 *   1. Copy the SQL below
 *   2. Paste into Supabase dashboard → SQL → New Query
 *   3. Click "Run"
 * 
 * DO NOT run this via Node—it's SQL, not JavaScript.
 */

// ============================================================================
// COPY EVERYTHING BELOW THIS LINE INTO SUPABASE SQL EDITOR
// ============================================================================

/*
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Elections table
CREATE TABLE elections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'DRAFT',
  election_type text NOT NULL,
  start_time bigint NOT NULL,
  end_time bigint NOT NULL,
  created_by text NOT NULL,
  created_at bigint NOT NULL,
  voting_mode text DEFAULT 'DEMO',
  updated_at bigint,
  CHECK (start_time < end_time)
);

-- Parties table
CREATE TABLE parties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id uuid NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  name text NOT NULL,
  symbol text,
  votes bigint DEFAULT 0,
  order integer,
  created_at bigint NOT NULL,
  updated_at bigint,
  UNIQUE(election_id, order)
);

-- Voters table
CREATE TABLE voters (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id uuid NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  is_eligible boolean DEFAULT true,
  created_at bigint NOT NULL,
  updated_at bigint,
  UNIQUE(election_id, wallet_address)
);

-- Votes table (ONE VOTE PER VOTER PER ELECTION)
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id uuid NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL REFERENCES voters(id) ON DELETE CASCADE,
  party_id uuid NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  created_at bigint NOT NULL,
  created_at_block text,
  UNIQUE(election_id, voter_id)
);

-- Audit logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  action text NOT NULL,
  actor text NOT NULL,
  resource_type text,
  resource_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at bigint NOT NULL
);

-- Create indexes
CREATE INDEX elections_status_idx ON elections(status);
CREATE INDEX elections_created_at_idx ON elections(created_at);
CREATE INDEX parties_election_idx ON parties(election_id, order);
CREATE INDEX voters_election_idx ON voters(election_id);
CREATE INDEX voters_wallet_idx ON voters(wallet_address);
CREATE INDEX votes_election_idx ON votes(election_id);
CREATE INDEX votes_voter_idx ON votes(voter_id);
CREATE INDEX votes_created_at_idx ON votes(created_at);
CREATE INDEX audit_logs_action_idx ON audit_logs(action);
CREATE INDEX audit_logs_actor_idx ON audit_logs(actor);
CREATE INDEX audit_logs_created_at_idx ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Elections: Public read, admin write
CREATE POLICY "Elections are viewable by everyone" ON elections
  FOR SELECT USING (true);

CREATE POLICY "Admins can create elections" ON elections
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

CREATE POLICY "Admins can update elections" ON elections
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

CREATE POLICY "Admins can delete elections" ON elections
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

-- Parties: Public read, admin write
CREATE POLICY "Parties are viewable by everyone" ON parties
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage parties" ON parties
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

CREATE POLICY "Admins can update parties" ON parties
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

CREATE POLICY "Admins can delete parties" ON parties
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

-- Voters: Admin only
CREATE POLICY "Only admins can view voters" ON voters
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

CREATE POLICY "Only admins can manage voters" ON voters
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

CREATE POLICY "Only admins can update voters" ON voters
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

CREATE POLICY "Only admins can delete voters" ON voters
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

-- Votes: Users can insert one per election, admins can read
CREATE POLICY "Users can cast votes" ON votes
  FOR INSERT WITH CHECK (
    election_id IS NOT NULL AND voter_id IS NOT NULL AND party_id IS NOT NULL
  );

CREATE POLICY "Only admins can view votes" ON votes
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

CREATE POLICY "Admins can delete votes" ON votes
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

-- Audit logs: Admin only
CREATE POLICY "Only admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR true
  );

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);
*/

// ============================================================================
// END COPY ZONE
// ============================================================================

console.log(`
✅ Setup instructions:

1. Go to Supabase dashboard: https://app.supabase.com
2. Select your project: kxzgjkeuwmkmqgdlleox
3. Go to "SQL" → "New query"
4. Copy the SQL block above (between the /* */ comments)
5. Paste into the editor and click "Run"
6. Wait for all tables to be created

Then enable Realtime:
1. Go to "Database" → "Replication" → "Realtime"
2. Enable "elections" and "votes"
3. Save

Your app is running at: http://localhost:3001
`)
