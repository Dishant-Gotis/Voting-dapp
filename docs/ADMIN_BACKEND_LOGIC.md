# Admin Backend Logic Implementation

## Overview

The Admin Panel backend has been implemented with dual-mode support (Blockchain and Demo). Both modes provide identical functionality through the Adapter Pattern, ensuring:
- **Same admin UI** for both blockchain and demo voting
- **Secure authentication** with mode-specific validation
- **Audit trail** of all admin actions
- **Real-time synchronization** across tabs/windows
- **Backend enforcement** of all rules (wallet, credentials, election state)

---

## Architecture

### Adapter Implementation

```
IAdminAdapter (Interface)
    ↓
    ├─ BlockchainAdminAdapter (Smart Contract Backend)
    │  └─ Uses: Web3.js, MetaMask, Smart Contracts
    │
    └─ DemoAdminAdapter (Supabase Backend)
       └─ Uses: Supabase RPC, PostgreSQL, RLS Policies
```

### AdapterFactory Routing

```typescript
// UI never branches on mode
const adminAdapter = adapterFactory.getAdminAdapter()
// Returns BlockchainAdminAdapter or DemoAdminAdapter based on mode
```

---

## Authentication Flow

### 1. Blockchain Mode: MetaMask Wallet Authentication

```typescript
// Admin authenticates with wallet
const result = await blockchainAdminAdapter.authenticateWallet(walletAddress)
// Returns: { success, message, data: { wallet, transactionHash } }

// Validation:
// ✓ Valid Ethereum address format (0x...)
// ✓ Wallet registered as ADMIN in smart contract
// ✓ Wallet ownership verified via MetaMask
```

**Backend Validation (Smart Contract):**
- Admin role check: `contract.isAdmin(walletAddress)`
- One-time auth per session
- Session stored in browser (not on-chain)

**Timeline:**
- Format validation: Instant
- Contract call: 5-15s (blockchain confirmation)
- Total: ~10-20s

### 2. Demo Mode: Email/Password Credentials

```typescript
// Admin authenticates with credentials
const result = await demoAdminAdapter.authenticateCredentials(email, password)
// Returns: { success, message, data: { adminId, email, role } }

// Test credentials (for demo):
// Email: testnet@example.com
// Password: bitcoin2009

// Validation:
// ✓ Email format validation (RFC 5322)
// ✓ Password minimum length (6 chars)
// ✓ Credentials verified against Supabase Auth
```

**Backend Validation (Supabase Auth):**
- Supabase Auth API: `signInWithPassword(email, password)`
- RLS policies verify ADMIN role on database access
- Session JWT stored in browser
- Server-side validation on every admin action

**Timeline:**
- Format validation: Instant
- API call: 500-800ms
- Total: ~1s

---

## Admin Operations

### 1. Create Election

```typescript
const result = await adminAdapter.createElection({
  title: string,           // Required: "Presidential Election 2024"
  description?: string,    // Optional: "Fifth National Election"
  startTime: number,       // Required: Unix timestamp (future)
  endTime: number,         // Required: Unix timestamp (after startTime)
})

// Returns:
{
  success: boolean,
  message: string,
  data: {
    electionId: string,
    // Blockchain specific:
    contractAddress?: string,  // Smart contract address
    transactionHash?: string,  // Tx hash for verification
    blockNumber?: number,      // Block where stored
    // Demo specific:
    createdAt?: string,        // ISO timestamp
    status?: string,           // "DRAFT", "ACTIVE", "COMPLETED"
  }
}
```

**Validation Rules:**
- Title: Non-empty, max 255 chars
- Times: startTime < endTime
- Start: Cannot be in past
- End: Must be in future

**Backend Actions:**

*Blockchain:*
- Deploy Election contract via Web3.js
- Store election metadata on-chain
- Emit `ElectionCreated` event
- Record in audit logs

*Demo:*
- Insert into `elections` table
- Supabase RLS: Only ADMIN can create
- Trigger audit log entry
- Record creator (admin ID)

---

### 2. Add Parties

```typescript
const result = await adminAdapter.addParties(electionId, [
  {
    name: "Party A",
    symbolUrl: "https://...",
    description?: "Left-wing party"
  },
  // ... max 10 parties
])

// Returns:
{
  success: boolean,
  data: {
    parties: [
      {
        id: string,
        electionId: string,
        name: string,
        symbolUrl?: string,
        description?: string,
        voteCount: 0
      }
    ]
  }
}
```

**Validation Rules:**
- At least 1 party required
- Maximum 10 parties per election
- Each party must have name (non-empty)
- Symbol URL must be valid image (optional)

**Backend Actions:**

*Blockchain:*
- Call `contract.addParty(electionId, name, symbolUrl)` for each
- Store party data in contract state
- Emit `PartyAdded` event per party

*Demo:*
- Insert batch into `parties` table
- Set voteCount = 0 initially
- Generate unique party IDs
- RLS enforces: creator can modify own parties

---

### 3. Register Voters

```typescript
const result = await adminAdapter.addVoters(electionId, [
  {
    id: "voter_001",
    email: "voter1@example.com",
    // ... other voter data
  },
  // ... max 10,000 per batch
])

// Returns:
{
  success: boolean,
  data: {
    registeredCount: number,
    merkleRoot?: string  // For blockchain Merkle tree verification
  }
}
```

**Validation Rules:**
- At least 1 voter required
- Maximum 10,000 per batch (split large uploads)
- Each voter needs: id, email
- Duplicate prevention: Check before insert

**Backend Actions:**

*Blockchain:*
- Build Merkle tree from voter list
- Store Merkle root on-chain
- Voters can prove eligibility with Merkle proof
- Prevents any unregistered voter from voting

*Demo:*
- Insert into `voters` table
- Add `eligible = true`, `voted = false`
- Create indexes on (electionId, email)
- RLS: Voters can only see their own record

**Duplicate Prevention:**
```sql
-- Blockchain: Merkle tree prevents re-registration
-- Demo: Unique constraint on (election_id, voter_id)
ALTER TABLE voters ADD CONSTRAINT 
  unique_voter_per_election (election_id, voter_id)
```

---

### 4. Start Election

```typescript
const result = await adminAdapter.startElection(electionId)

// Returns:
{
  success: boolean,
  data: {
    electionId: string,
    status: "ACTIVE",
    startedAt: ISO8601,
    transactionHash?: string  // For blockchain
  }
}
```

**Backend Actions:**

*Blockchain:*
- Call `contract.startElection(electionId)`
- Transition state: DRAFT → ACTIVE
- Emit `ElectionStarted` event (all voters see instantly)
- Any registered voter can now cast vote

*Demo:*
- Update `status = 'ACTIVE'` in elections table
- Supabase Realtime broadcasts to all clients
- Voters instantly see election is live
- Vote table ready for incoming votes

**Key: Instant Broadcast**
- BroadcastChannel message sent to all tabs
- Event listeners trigger UI updates
- Voters see "Voting Open" immediately

---

### 5. End Election

```typescript
const result = await adminAdapter.endElection(electionId)

// Returns:
{
  success: boolean,
  data: {
    electionId: string,
    status: "COMPLETED",
    endedAt: ISO8601,
    transactionHash?: string
  }
}
```

**Backend Actions:**

*Blockchain:*
- Call `contract.endElection(electionId)`
- Transition state: ACTIVE → COMPLETED
- Emit `ElectionEnded` event
- Smart contract rejects new votes immediately

*Demo:*
- Update `status = 'COMPLETED'`
- Supabase trigger: Reject INSERT into votes
- Realtime broadcasts to all voters
- Voting interface disabled for voters

---

### 6. Announce Results

```typescript
const result = await adminAdapter.announceResults(electionId)

// Returns:
{
  success: boolean,
  data: {
    electionId: string,
    status: "RESULTS_PUBLISHED",
    announcedAt: ISO8601,
    results: {
      party_id: voteCount,
      // e.g.:
      // "party_0": 1234,
      // "party_1": 1567,
      // "party_2": 891
    }
  }
}
```

**Backend Actions:**

*Blockchain:*
- Call `contract.announceResults(electionId, results)`
- Store results immutably on-chain
- Cannot be changed after announcement
- Anyone can verify: `contract.getResults(electionId)`

*Demo:*
- Aggregate votes: `SUM(votes WHERE election_id = ?)` per party
- Insert into `results` table
- Mark as `announced = true`
- RLS: Everyone can read results (public)

**Immutability:**
```solidity
// Smart Contract
require(election.status == COMPLETED, "Election not ended");
require(!election.resultsAnnounced, "Results already announced");

// Store results
electionResults[electionId] = results;
election.resultsAnnounced = true;
// ✓ Permanent on blockchain
```

---

### 7. Audit Logs

```typescript
const logs = await adminAdapter.getAuditLogs(electionId)

// Returns: Array of
{
  id: string,
  electionId: string,
  action: "ELECTION_CREATED" | "PARTIES_ADDED" | "ELECTION_STARTED" | ...
  actorId: string,           // Admin wallet or ID
  actorType: "ADMIN" | "SYSTEM",
  details: any,              // Action-specific data
  timestamp: number,         // Unix timestamp
  ipAddress?: string         // For demo mode
}
```

**Actions Logged:**
- `WALLET_AUTH` - Admin login
- `ELECTION_CREATED` - New election
- `PARTIES_ADDED` - Parties registered
- `VOTERS_ADDED` - Voter batch uploaded
- `ELECTION_STARTED` - Election opened
- `ELECTION_ENDED` - Election closed
- `RESULTS_ANNOUNCED` - Results published
- `VOTERS_REMOVED` - Voters revoked

**Backend Actions:**

*Blockchain:*
- SmartContract events: `AdminAction(electionId, action, actor, details)`
- Blockchain logs immutable and permanent
- Can query historical events

*Demo:*
- Insert into `audit_logs` table
- Every insert triggers RLS verification
- PostgreSQL provides immutable log (with WAL)
- Can query with filters/sorting

---

## Real-Time Synchronization

### BroadcastChannel for Cross-Tab Sync

```typescript
// Admin is logged in multiple tabs
// Tab 1: Click "Start Election"
adminAdapter.startElection(electionId)
// Internally broadcasts:
broadcastChannel.postMessage({
  action: 'ELECTION_STARTED',
  data: { electionId, timestamp },
  timestamp: Date.now()
})

// Tab 2: Automatically receives message
broadcastChannel.onmessage = (event) => {
  if (event.data.action === 'ELECTION_STARTED') {
    // Refresh election status
    // Update UI without page reload
  }
}
```

### Voter Real-Time Updates

**Blockchain Mode:**
```typescript
// Smart contract events are listened to via Web3.js
const filter = contract.filters.ElectionStarted(electionId)
contract.on(filter, (event) => {
  // All connected voters see ElectionStarted
  // Update UI: "Voting is now open!"
})
```

**Demo Mode:**
```typescript
// Supabase Realtime subscription
supabase
  .from('elections')
  .on('UPDATE', payload => {
    if (payload.new.status === 'ACTIVE') {
      // All voters subscribed see status change
      // Update UI: "Voting is now open!"
    }
  })
  .subscribe()
```

---

## Security Considerations

### 1. Admin Authentication

**Blockchain:**
- ✓ MetaMask signs challenge → wallet ownership verified
- ✓ Smart contract checks ADMIN role (on-chain)
- ✓ Session created after verification
- ✓ Private key never leaves browser (MetaMask handles)

**Demo:**
- ✓ HTTPS only (enforced in production)
- ✓ Password hashed with bcrypt (Supabase Auth)
- ✓ JWT issued and validated server-side
- ✓ RLS policies block unauthorized access

### 2. Action Authorization

**Every admin operation:**
1. Verify admin is authenticated
2. Verify admin has ADMIN role
3. Validate input parameters
4. **Execute backend-side** (not frontend)
5. Log to audit trail
6. Broadcast to other clients

```typescript
// Template for all admin operations
async createElection(data) {
  // 1. Check authenticated
  if (!this.adminWallet) return { success: false, message: '...' }
  
  // 2. Validate inputs
  if (!data.title) return { success: false, message: '...' }
  
  // 3. Call backend (not just update frontend)
  const result = await contract.createElection(...)
  
  // 4. Log action
  this.logAction('ELECTION_CREATED', adminId, { ... })
  
  // 5. Broadcast
  this.broadcastAdminAction(...)
  
  return result
}
```

### 3. Data Integrity

**Blockchain:**
- All data immutable after recording
- Audit trail cannot be modified
- Smart contract enforces state transitions
- Example: Cannot start already-started election

**Demo:**
- Database constraints prevent invalid state
- RLS policies prevent privilege escalation
- Audit logs stored immutably in WAL
- Example: UPDATE elections SET status='ACTIVE' WHERE status != 'DRAFT'

### 4. Duplicate Vote Prevention

**Blockchain:**
```solidity
mapping(address => bool) public hasVoted;
function castVote(uint partyId) public {
  require(!hasVoted[msg.sender], "Already voted");
  hasVoted[msg.sender] = true;
  // ... record vote
}
```

**Demo:**
```sql
-- Constraint prevents duplicate voting
ALTER TABLE votes ADD CONSTRAINT
  unique_voter_per_election (election_id, voter_id) UNIQUE;

-- Trigger enforces election status
CREATE TRIGGER prevent_voting_after_end
BEFORE INSERT ON votes
FOR EACH ROW
EXECUTE check_election_status();
```

---

## Error Handling

### Common Errors & Responses

```typescript
// Not authenticated
{
  success: false,
  message: "Admin not authenticated"
}

// Invalid input
{
  success: false,
  message: "Election title is required"
}

// Business logic violation
{
  success: false,
  message: "End time must be after start time"
}

// Network/contract failure (Blockchain)
{
  success: false,
  message: "Transaction reverted: Insufficient gas"
}

// Database error (Demo)
{
  success: false,
  message: "Failed to insert party: Duplicate entry"
}
```

### Retry Logic

**For transient failures:**
```typescript
// Blockchain: Retry on gas failures
// Demo: Retry on connection timeouts

// Max 3 attempts, exponential backoff
const retry = (fn, maxAttempts = 3) => {
  let lastError
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      await sleep(1000 * Math.pow(2, i))
    }
  }
  throw lastError
}
```

---

## Mode-Specific Details

### Blockchain Implementation

**Libraries:**
- Web3.js v1.x or ethers.js
- MetaMask provider
- Smart contracts (Solidity)

**Contract Interactions:**
```typescript
// Example: Create election
const tx = await contract.functions.createElection({
  title: "Presidential Election 2024",
  startTime: Math.floor(Date.now() / 1000) + 3600,
  endTime: Math.floor(Date.now() / 1000) + 86400,
  {
    gasLimit: 200000,
    gasPrice: ethers.utils.parseUnits('50', 'gwei')
  }
})

const receipt = await tx.wait()
// receipt.transactionHash, receipt.blockNumber, etc.
```

**Event Listening:**
```typescript
contract.on('ElectionStarted', (electionId, event) => {
  console.log(`Election ${electionId} started at block ${event.blockNumber}`)
  // Broadcast to UI
})
```

### Demo Implementation

**Supabase Schema:**
```sql
CREATE TABLE elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time BIGINT NOT NULL,
  end_time BIGINT NOT NULL,
  status VARCHAR(20) DEFAULT 'DRAFT',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES elections(id),
  name VARCHAR(255) NOT NULL,
  symbol_url TEXT,
  vote_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE voters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES elections(id),
  voter_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  eligible BOOLEAN DEFAULT TRUE,
  voted BOOLEAN DEFAULT FALSE,
  voted_at TIMESTAMP,
  UNIQUE(election_id, voter_id)
);

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES elections(id),
  voter_id UUID NOT NULL REFERENCES voters(id),
  party_id UUID NOT NULL REFERENCES parties(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(election_id, voter_id)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES elections(id),
  action VARCHAR(50) NOT NULL,
  actor_id VARCHAR(255) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**RLS Policies:**
```sql
-- Admins can create elections
CREATE POLICY admin_can_create_elections ON elections
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    auth.jwt() ->> 'role' = 'ADMIN'
  );

-- Only voters for this election can see parties
CREATE POLICY voters_can_see_parties ON parties
  FOR SELECT
  USING (
    election_id IN (
      SELECT id FROM elections
      WHERE id IN (
        SELECT election_id FROM voters
        WHERE voter_id = auth.uid()
      )
    )
  );

-- Voters can only vote once
CREATE POLICY one_vote_per_voter ON votes
  FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM votes
      WHERE election_id = new.election_id
      AND voter_id = new.voter_id
    )
  );
```

---

## Testing Checklist

- ✓ Admin can authenticate (both modes)
- ✓ Create election with valid/invalid times
- ✓ Add max 10 parties
- ✓ Register voters in batches
- ✓ Cannot start election before creation
- ✓ Cannot vote after election ended
- ✓ Audit logs record all actions
- ✓ Cross-tab sync works (BroadcastChannel)
- ✓ Real-time voter updates (events/Realtime)
- ✓ Prevent duplicate voting
- ✓ Results immutable after announcement

---

## Summary

The Admin Panel backend provides:
1. **Dual-mode authentication** (MetaMask + Email/Password)
2. **Complete election lifecycle** (Create → Add Parties → Register Voters → Start → End → Announce)
3. **Backend enforcement** of all rules (no frontend-only validation)
4. **Immutable audit trail** (both modes)
5. **Real-time synchronization** (voters see changes instantly)
6. **Identical UI** across both modes (adapter pattern)

All admin operations are validated server-side and logged for compliance.
