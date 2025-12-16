# Supabase Schema for Demo Voting Mode

## Overview
This document defines the database schema for the demo voting mode using Supabase PostgreSQL backend. All tables implement Row Level Security (RLS) policies to enforce authorization at the database level.

## Tables

### 1. elections
Stores election metadata and configuration.

**Columns:**
- `id` (uuid, PK) - Unique election identifier
- `title` (text, NOT NULL) - Election title
- `description` (text) - Detailed election description
- `status` (text, NOT NULL, DEFAULT 'DRAFT') - One of: DRAFT, ACTIVE, COMPLETED, ARCHIVED
- `election_type` (text, NOT NULL) - Type of election (GENERAL, PRESIDENTIAL, LOCAL, etc.)
- `start_time` (bigint, NOT NULL) - Unix timestamp when voting starts
- `end_time` (bigint, NOT NULL) - Unix timestamp when voting ends
- `created_by` (text, NOT NULL) - Admin user ID who created election
- `created_at` (bigint, NOT NULL) - Creation timestamp (milliseconds)
- `voting_mode` (text, DEFAULT 'DEMO') - DEMO or BLOCKCHAIN
- `updated_at` (bigint) - Last update timestamp

**Indexes:**
- PRIMARY KEY on `id`
- Index on `status`
- Index on `created_at`

**Constraints:**
- `start_time < end_time` - Start must be before end

### 2. parties
Stores political parties/candidates for elections.

**Columns:**
- `id` (uuid, PK) - Unique party identifier
- `election_id` (uuid, FK -> elections, NOT NULL) - Associated election
- `name` (text, NOT NULL) - Party or candidate name
- `symbol` (text) - Party symbol/abbreviation
- `votes` (bigint, DEFAULT 0) - Vote count (denormalized for performance)
- `order` (integer) - Display order in ballot
- `created_at` (bigint, NOT NULL) - Creation timestamp
- `updated_at` (bigint) - Last update timestamp

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `election_id`
- Index on `(election_id, order)` - For ordering parties in election

**Constraints:**
- Foreign key reference to `elections(id)` with CASCADE delete
- `name` must not be null or empty
- `order` must be unique within election

### 3. voters
Stores voter eligibility tracking for elections.

**Columns:**
- `id` (uuid, PK) - Unique voter identifier
- `election_id` (uuid, FK -> elections, NOT NULL) - Associated election
- `wallet_address` (text, NOT NULL) - MetaMask wallet address (identity)
- `is_eligible` (boolean, DEFAULT true) - Voter eligibility status
- `created_at` (bigint, NOT NULL) - Timestamp when added to voter list
- `updated_at` (bigint) - Last update timestamp

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `election_id`
- UNIQUE constraint on `(election_id, wallet_address)` - One entry per wallet per election
- Index on `wallet_address` - For fast lookup

**Constraints:**
- Foreign key reference to `elections(id)` with CASCADE delete
- Wallet address must be valid Ethereum format (0x...)
- Cannot register same wallet twice for same election

### 4. votes
Stores individual votes cast by voters.

**Columns:**
- `id` (uuid, PK) - Unique vote identifier
- `election_id` (uuid, FK -> elections, NOT NULL) - Associated election
- `voter_id` (uuid, FK -> voters, NOT NULL) - Reference to voter
- `party_id` (uuid, FK -> parties, NOT NULL) - Party/candidate voted for
- `created_at` (bigint, NOT NULL) - Vote timestamp (milliseconds)
- `created_at_block` (text) - For demo-to-blockchain migration (optional)

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE constraint on `(election_id, voter_id)` - **ONE VOTE PER VOTER PER ELECTION**
- FOREIGN KEY on `election_id`
- FOREIGN KEY on `voter_id`
- FOREIGN KEY on `party_id`
- Index on `election_id` - For fetching votes by election
- Index on `created_at` - For chronological queries

**Constraints:**
- Foreign key references with CASCADE delete
- One vote per (election_id, voter_id) enforced by unique constraint
- voter_id must exist in voters table
- party_id must exist in parties table for this election

### 5. audit_logs
Stores admin actions for compliance and debugging.

**Columns:**
- `id` (uuid, PK) - Unique log entry identifier
- `action` (text, NOT NULL) - Action type (AUTH_SUCCESS, ELECTION_CREATED, VOTE_CAST, etc.)
- `actor` (text, NOT NULL) - User/admin who performed action
- `resource_type` (text) - Type of resource affected (ELECTION, PARTY, VOTER, VOTE)
- `resource_id` (uuid) - ID of affected resource
- `details` (jsonb) - Additional context/metadata
- `created_at` (bigint, NOT NULL) - Timestamp of action

**Indexes:**
- PRIMARY KEY on `id`
- Index on `action`
- Index on `actor`
- Index on `resource_type`
- Index on `created_at`

## Row Level Security (RLS) Policies

### elections table
- **SELECT**: Public read - anyone can view elections
- **INSERT**: Admin only - only authenticated admins
- **UPDATE**: Admin only - creator or authorized admin
- **DELETE**: Admin only - creator or authorized admin

```sql
-- SELECT policy
CREATE POLICY "Elections are viewable by everyone" ON elections
  FOR SELECT USING (true);

-- INSERT policy (admin only)
CREATE POLICY "Admins can create elections" ON elections
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

-- UPDATE policy (admin only)
CREATE POLICY "Only election creator can update" ON elections
  FOR UPDATE USING (
    created_by = auth.uid()::text
    OR auth.jwt() ->> 'role' = 'admin'
  );
```

### parties table
- **SELECT**: Public read
- **INSERT/UPDATE**: Admin only - during DRAFT status
- **DELETE**: Admin only

### voters table
- **SELECT**: Admin only - for eligibility verification
- **INSERT**: Admin only - adding voters to eligibility list
- **DELETE**: Admin only - removing ineligible voters

### votes table
- **SELECT**: Admin only - vote tallying and audit
- **INSERT**: Any authenticated user - casting vote
- **DELETE**: Admin only - never allowed in normal operation
- **Prevent duplicate votes**: Unique constraint on (election_id, voter_id)

```sql
-- INSERT policy (authenticated users only)
CREATE POLICY "Users can only cast one vote per election" ON votes
  FOR INSERT WITH CHECK (
    election_id IS NOT NULL
    AND voter_id IS NOT NULL
    AND party_id IS NOT NULL
    -- Unique constraint prevents duplicates at DB level
  );

-- SELECT policy (admin only)
CREATE POLICY "Only admins can view votes" ON votes
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );
```

### audit_logs table
- **SELECT**: Admin only
- **INSERT**: System only (auto-logged by triggers)
- **DELETE**: Never

## Realtime Subscriptions

Supabase Realtime enables live updates for:

1. **Election Status Changes**
   - Listen to election updates (status: DRAFT → ACTIVE → COMPLETED)
   - Admin dashboard updates instantly
   
2. **Vote Cast Events**
   - Listen to new votes in election
   - Vote count updates in real-time
   - Display live tally on voting page

3. **Voter Eligibility Changes**
   - Listen to voters table changes
   - Display updated eligible voter list

## Security Features

### One-Vote Enforcement
```sql
-- UNIQUE constraint prevents duplicate votes
ALTER TABLE votes
ADD CONSTRAINT one_vote_per_election UNIQUE (election_id, voter_id);
```

This database-level constraint is checked on every INSERT, ensuring no user can vote twice in the same election, even if:
- Multiple browser tabs attempt simultaneous votes
- Race conditions occur in network
- Client-side validation is bypassed

### Admin Authentication
- All admin operations require JWT token with `role = 'admin'`
- Session tokens expire and require re-authentication
- Failed auth attempts logged in audit trail

### Voter Anonymity
- Votes store only voter_id, not wallet address
- Wallet address stored separately in voters table
- Vote privacy preserved while preventing duplicate voting

## Database Setup SQL

```sql
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

-- Votes table
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
```

## Migration Strategy

For users voting in BLOCKCHAIN mode then switching to DEMO:
- Create voter record with same wallet_address
- Votes remain in blockchain (immutable)
- New demo votes stored separately in votes table

For DEMO-to-BLOCKCHAIN migration:
- Export votes from votes table
- Trigger blockchain smart contract with vote data
- Update vote records with `created_at_block` field
