# Blockchain Voting Platform – System Architecture

## 1. System Overview

### Core Vision
A production-grade voting platform that operates in two parallel modes with **zero UX difference**, using an adapter pattern to switch between:
- **BLOCKCHAIN Mode**: Real smart contracts + MetaMask
- **DEMO Mode**: Supabase backend + government-grade simulation

### Key Principle
The UI/Frontend is **always blockchain-themed and production-ready**, but the logic adapter routes to the appropriate backend based on mode selection.

---

## 2. Mode Selection & Initialization

### Selection Flow
```
Application Start
  ↓
[Mode Detection]
  ├─ URL Param: ?mode=blockchain | ?mode=demo
  ├─ LocalStorage Flag: votingMode (persisted per browser)
  ├─ Admin Override: Config file or environment variable
  ↓
[Initialize Backend Connection]
  ├─ BLOCKCHAIN: Connect MetaMask, load contracts
  └─ DEMO: Connect Supabase, load schema
  ↓
[Load Adapter] → UI receives unified interface
```

### Mode Persistence
- **First-time users**: Mode selection screen (no localStorage for votes, but mode selection is safe)
- **Returning users**: Persist mode choice in sessionStorage (not for sensitive data)
- **Admin panel**: Can override global mode or per-election

---

## 3. Component Architecture

### Layered Structure
```
┌─────────────────────────────────────────┐
│         UI Layer (React/Vue)             │
│  - Voting Interface                      │
│  - Admin Dashboard                       │
│  - Results Display                       │
│  - Election Management                   │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Logic Adapter (Unified API)        │
│  - VotingAdapter Interface               │
│  - ElectionAdapter Interface             │
│  - UserAdapter Interface                 │
│  - AdminAdapter Interface                │
└────┬─────────────────────────────────┬──┘
     │                                 │
┌────▼──────────────────┐    ┌────────▼────────────────┐
│  Blockchain Handler   │    │   Demo Handler          │
│  - Web3.js            │    │   - Supabase Client     │
│  - MetaMask Bridge    │    │   - Business Logic      │
│  - Contract ABI Calls │    │   - Mock Blockchain     │
└────┬──────────────────┘    └────────┬────────────────┘
     │                                 │
┌────▼──────────────────┐    ┌────────▼────────────────┐
│  Smart Contracts      │    │   Supabase Backend      │
│  (Deployed on Chain)  │    │   - PostgreSQL DB       │
│                       │    │   - RLS Policies        │
└───────────────────────┘    └─────────────────────────┘
```

---

## 4. Adapter Pattern Details

### Unified Interface Contracts

#### VotingAdapter
```
Interface: IVotingAdapter
├─ castVote(electionId, partyId, voterAuth) → Promise<VoteResult>
├─ getVoteStatus(electionId, voterAuth) → Promise<VoteStatus>
├─ verifyVoterEligibility(electionId, voterAuth) → Promise<boolean>
├─ submitVoteTransaction() → Promise<TransactionHash>
└─ getVoteProof() → Promise<CryptographicProof>
```

#### ElectionAdapter
```
Interface: IElectionAdapter
├─ createElection(electionData, adminAuth) → Promise<ElectionId>
├─ updateElection(electionId, updates, adminAuth) → Promise<Status>
├─ getElection(electionId) → Promise<ElectionDetails>
├─ startElection(electionId, adminAuth) → Promise<Status>
├─ endElection(electionId, adminAuth) → Promise<Status>
├─ listElections() → Promise<Election[]>
└─ getResults(electionId) → Promise<Results>
```

#### UserAdapter
```
Interface: IUserAdapter
├─ authenticate(credentials) → Promise<UserSession>
├─ getProfile(userId) → Promise<UserProfile>
├─ verifyIdentity(voterData) → Promise<VerificationStatus>
└─ checkVoterRole(electionId) → Promise<UserRole>
```

#### AdminAdapter
```
Interface: IAdminAdapter
├─ createElection(electionData) → Promise<ElectionId>
├─ addParties(electionId, parties) → Promise<Status>
├─ addVoters(electionId, voters) → Promise<Status>
├─ removeVoters(electionId, voters) → Promise<Status>
├─ announceResults(electionId) → Promise<Status>
├─ getBroadcastChannel() → BroadcastChannel (for real-time updates)
└─ auditLogs(electionId) → Promise<AuditLog[]>
```

### Implementation Strategy
- **BlockchainAdapter**: Calls Web3 smart contract functions
- **DemoAdapter**: Calls Supabase RPC functions or direct API calls
- **Adapter Factory**: Returns correct adapter based on mode

```
AdapterFactory.getVotingAdapter(mode) → IVotingAdapter
  ├─ If mode === 'BLOCKCHAIN' → return BlockchainVotingAdapter
  └─ If mode === 'DEMO' → return DemoVotingAdapter
```

---

## 5. Entity Models

### Core Entities

#### User (Voter)
```
User {
  id: UUID
  name: string
  email: string
  phone: string
  aadhar_number: string (or equivalent national ID)
  wallet_address: string (blockchain mode only)
  created_at: timestamp
  updated_at: timestamp
  is_active: boolean
}
```

#### Admin (Election Commission)
```
Admin {
  id: UUID
  name: string
  email: string
  role: 'SUPER_ADMIN' | 'ELECTION_ADMIN' | 'AUDIT_ADMIN'
  wallet_address: string (blockchain mode only)
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

#### Election
```
Election {
  id: UUID
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'ENDED' | 'ANNOUNCED'
  start_time: timestamp
  end_time: timestamp
  election_type: 'GENERAL' | 'LOCAL' | 'SPECIAL'
  voting_mode: 'BLOCKCHAIN' | 'DEMO'
  created_by: UUID (Admin reference)
  created_at: timestamp
  updated_at: timestamp
  contract_address: string (blockchain mode only)
  is_anonymous: boolean
}
```

#### Party (Candidate)
```
Party {
  id: UUID
  election_id: UUID
  name: string
  symbol_url: string
  description: string
  candidate_details: JSON (flexible candidate info)
  vote_count: integer (read-only, computed)
  created_at: timestamp
  updated_at: timestamp
}
```

#### Vote
```
Vote {
  id: UUID
  election_id: UUID
  party_id: UUID
  voter_id: UUID (encrypted in blockchain mode, plaintext in demo with RLS)
  vote_hash: string (for verification)
  timestamp: timestamp
  transaction_hash: string (blockchain mode only)
  is_verified: boolean
  metadata: JSON (optional audit data)
}
```

#### VoteProof (for blockchain mode)
```
VoteProof {
  vote_id: UUID
  merkle_root: string
  proof_path: string[]
  block_number: integer
  transaction_hash: string
}
```

#### AuditLog
```
AuditLog {
  id: UUID
  election_id: UUID
  action: string
  actor_id: UUID
  actor_type: 'ADMIN' | 'SYSTEM'
  details: JSON
  timestamp: timestamp
  ip_address: string
}
```

---

## 6. Data Flow for Key Operations

### Flow 1: User Registration & Verification

```
User Submits Registration Form
  ↓
[UI Layer] → Validation (UI-level only for UX)
  ↓
[Logic Adapter] → getUserAdapter()
  ├─ BLOCKCHAIN: Store on chain (optional), verify via identity service
  └─ DEMO: Call Supabase Function → RPC_verify_identity
  ↓
[Backend Validation] ← CRITICAL
  ├─ Verify Aadhar/ID against government database (both modes)
  ├─ Check if voter already registered for election
  ├─ Validate voter eligibility
  └─ Return success/failure to UI
  ↓
Store User Record
  ├─ BLOCKCHAIN: Optional on-chain record (voter commitment)
  └─ DEMO: Supabase User table + RLS
  ↓
Return Session Token to UI
```

### Flow 2: Casting a Vote

```
User Clicks "Cast Vote" Button
  ↓
[UI Layer]
  ├─ Show selected party
  ├─ Confirmation dialog
  └─ Client-side UI validation only
  ↓
[Logic Adapter] → getVotingAdapter()
  ↓
[BLOCKCHAIN PATH]
  ├─ Generate vote commitment (hash)
  ├─ Request MetaMask signature
  ├─ Call smart contract: vote(commitment, encryptedVote)
  ├─ Wait for transaction confirmation
  ├─ Generate cryptographic proof
  └─ Return VoteResult to UI
  ↓
[DEMO PATH]
  ├─ Prepare vote object with voter_id (user context)
  ├─ Call Supabase RPC: rpc_cast_vote(election_id, party_id, voter_session)
  ├─ Backend validates:
  │  ├─ Voter eligibility
  │  ├─ No duplicate vote for election
  │  ├─ Election is ongoing
  │  └─ Voter session is valid
  ├─ Insert vote record (with audit log)
  ├─ Return vote confirmation
  └─ Return VoteResult to UI
  ↓
[After Vote Submission]
  ├─ Show "Vote Cast Successfully" confirmation
  ├─ Trigger real-time update via BroadcastChannel
  ├─ Update vote count display
  └─ Disable re-voting
```

### Flow 3: Admin Creates Election

```
Admin Fills Election Form
  ↓
[UI Layer] → Form validation
  ↓
[Logic Adapter] → getAdminAdapter()
  ↓
[BLOCKCHAIN PATH]
  ├─ Call smart contract: createElection(electionData)
  ├─ Wait for contract deployment
  ├─ Store contract address in metadata
  └─ Return Election with contract_address
  ↓
[DEMO PATH]
  ├─ Call Supabase RPC: rpc_create_election(electionData, admin_session)
  ├─ Backend validates:
  │  ├─ Admin has ELECTION_ADMIN role
  │  ├─ Election title is unique
  │  └─ Dates are valid
  ├─ Insert election record
  └─ Return Election with ID
  ↓
[Broadcast to All Admins]
  ├─ Send via BroadcastChannel: { action: 'ELECTION_CREATED', election: {...} }
  ├─ All admin dashboards receive update
  └─ Real-time UI refresh
```

### Flow 4: Admin Announces Results

```
Admin Clicks "Announce Results"
  ↓
[UI Layer] → Confirmation dialog
  ↓
[Logic Adapter] → getAdminAdapter()
  ↓
[BLOCKCHAIN PATH]
  ├─ Call smart contract: announceResults(electionId)
  ├─ Contract computes results (on-chain if possible, or fallback)
  ├─ Set election status to ANNOUNCED
  ├─ Emit event: ResultsAnnounced
  └─ Return results object
  ↓
[DEMO PATH]
  ├─ Call Supabase RPC: rpc_announce_results(election_id, admin_session)
  ├─ Backend validates:
  │  ├─ Election.status === 'ENDED'
  │  ├─ Admin has permission
  │  └─ All votes are finalized
  ├─ Compute results from votes table
  ├─ Update election.status = 'ANNOUNCED'
  ├─ Insert audit log
  └─ Return results
  ↓
[Broadcast Results]
  ├─ Send via BroadcastChannel: { action: 'RESULTS_ANNOUNCED', election_id: ..., results: {...} }
  ├─ All users (voters) see results update
  ├─ All admins see audit confirmation
  └─ Real-time dashboard refresh (all devices)
```

---

## 7. Enforcement Points & Security

### Backend Validation (Non-Negotiable)

Every critical operation must be validated on the backend:

#### For Voting
- ✅ Voter eligibility check
- ✅ No duplicate votes per election per voter
- ✅ Election status is 'ONGOING'
- ✅ Vote timestamp within election window
- ✅ Voter session/auth validity
- ✅ Audit logging of vote attempt (success/failure)

#### For Admin Actions
- ✅ Role-based access control (RBAC)
- ✅ Only eligible admins can create/modify elections
- ✅ Audit log for every state change
- ✅ Timestamp and actor tracking

#### For User Registration
- ✅ Identity verification via external service
- ✅ Uniqueness check across system
- ✅ No fake/duplicate identities

### Real-Time Propagation

```
Admin Action on Device A
  ↓
Backend processes & validates
  ↓
Database updated
  ↓
Event emitted: { action, data, timestamp }
  ↓
BroadcastChannel: listeners on devices B, C, D
  ↓
UI updates in real-time across all open sessions
```

---

## 8. Blockchain Backend Specification

### Smart Contract Architecture

#### Main Election Contract
```solidity
Contract: VotingElection
├─ State Variables
│  ├─ electionStatus: DRAFT → PUBLISHED → ONGOING → ENDED → ANNOUNCED
│  ├─ electionCommissioner: address (admin)
│  ├─ parties: Party[]
│  ├─ voters: mapping(address → bool)
│  ├─ votes: Vote[]
│  ├─ commitments: mapping(bytes32 → bool)
│  └─ results: mapping(uint → uint) [partyId → voteCount]
│
├─ Core Functions
│  ├─ createElection(title, description, startTime, endTime)
│  ├─ addParties(partyData[])
│  ├─ registerVoter(voterAddress)
│  ├─ vote(partyId, voteCommitment) ← Main voting function
│  ├─ revealVote(partyId, salt, proof) ← Optional reveal phase
│  ├─ announceResults()
│  ├─ getResults() → Results
│  └─ auditTrail(eventFilter) → AuditEvent[]
│
├─ Events
│  ├─ VoteCommitted(voterAddress, commitment, timestamp)
│  ├─ VoteRevealed(voterAddress, partyId, timestamp)
│  ├─ ElectionStatusChanged(newStatus, timestamp)
│  └─ ResultsAnnounced(partyWins[], timestamp)
│
└─ Modifiers
   ├─ onlyAdmin
   ├─ electionOngoing
   ├─ voterRegistered
   └─ notVotedBefore
```

### Blockchain Mode Considerations
- **Transaction Fees**: Covered by admin/election fund
- **Vote Privacy**: Use commitment scheme (hash of vote + salt)
- **Finality**: Wait for N block confirmations (e.g., 3 blocks)
- **Contract Upgradability**: Use proxy pattern if needed
- **Fallback to Demo**: If gas prices spike, allow manual failover to demo mode

---

## 9. Demo Backend Specification (Supabase)

### Database Schema

#### Tables
```sql
-- Core tables
users                  [id, name, email, phone, aadhar_number, created_at]
admins                 [id, name, email, role, created_at]
elections              [id, title, description, status, start_time, end_time, created_by, created_at]
parties                [id, election_id, name, symbol_url, created_at]
votes                  [id, election_id, party_id, voter_id (encrypted), timestamp, transaction_hash, is_verified]
audit_logs             [id, election_id, action, actor_id, details, timestamp]
```

### Row-Level Security (RLS) Policies

#### Votes Table
```
Policy: voters_can_see_own_votes
  ├─ SELECT: WHERE voter_id = auth.uid()
  └─ INSERT: Only authenticated users, cannot insert others' votes

Policy: admins_can_see_all_votes
  ├─ SELECT: WHERE admin_role >= 'ELECTION_ADMIN'
  └─ Cannot modify votes directly

Policy: votes_immutable_after_insert
  ├─ No UPDATE or DELETE allowed
```

#### Elections Table
```
Policy: public_can_view_elections
  ├─ SELECT: All public fields visible

Policy: admins_can_modify
  ├─ UPDATE/DELETE: Only election creator or SUPER_ADMIN
  └─ Audit logging required
```

### RPC Functions (Stored Procedures)

```sql
rpc_cast_vote(
  election_id: UUID,
  party_id: UUID,
  voter_session: JWT
) → VoteResult
  ├─ Validate voter session
  ├─ Check voter eligibility
  ├─ Verify no duplicate vote
  ├─ Insert vote record
  ├─ Log action
  └─ Return vote confirmation

rpc_create_election(
  election_data: JSON,
  admin_session: JWT
) → Election
  ├─ Validate admin role
  ├─ Insert election
  ├─ Log action
  └─ Return created election

rpc_announce_results(
  election_id: UUID,
  admin_session: JWT
) → Results
  ├─ Validate election status = ENDED
  ├─ Calculate results
  ├─ Update election status
  ├─ Log action
  └─ Return results

rpc_verify_voter_eligibility(
  election_id: UUID,
  voter_id: UUID
) → boolean
  ├─ Check voter registration
  ├─ Verify no prior vote
  ├─ Check election is ongoing
  └─ Return eligibility
```

### Real-Time Updates (Supabase Realtime)

```
Listeners:
├─ Elections channel → Subscribe to election status changes
├─ Votes channel → Subscribe to vote count updates
├─ Results channel → Subscribe to result announcements
└─ Audit channel → Subscribe to admin action logs
```

---

## 10. Frontend Architecture (No Implementation Yet)

### View Structure
```
App Root
├─ ModeSelectionView (if first-time user)
├─ AuthView (Login/Registration)
├─ VoterDashboard
│  ├─ ElectionListView
│  ├─ VotingInterface
│  ├─ ConfirmationDialog
│  └─ VoteProofView (blockchain mode)
└─ AdminDashboard
   ├─ ElectionManagementView
   ├─ PartyManagementView
   ├─ VoterManagementView
   ├─ ResultsView
   ├─ AuditLogView
   └─ BroadcastChannel Listener
```

### State Management
- **Global**: Mode, User Session, Current Election
- **Local**: Form inputs, UI state, temporary data
- **Adapter Layer**: Abstracts backend calls

### Real-Time Updates
- **BroadcastChannel API**: Sync across browser tabs/windows in same origin
- **Supabase Realtime**: For Demo mode (WebSocket subscriptions)
- **Web3 Event Listeners**: For Blockchain mode (contract events)

---

## 11. Constraints & Compliance

### Data Constraints
- ❌ **No localStorage for votes**: Votes only in backend database
- ❌ **No frontend-only validation**: All critical rules checked backend
- ✅ **UI validation allowed**: Only for UX improvement (error messages)
- ✅ **Mode selection can use sessionStorage**: Not sensitive data

### Security Constraints
- ✅ **HTTPS only** in production
- ✅ **JWT or session-based auth** for both modes
- ✅ **Vote encryption** in transit and at rest
- ✅ **Audit logging** for every action
- ✅ **No vote data exposed** to frontend before announcement
- ✅ **Admin actions require 2FA** (optional but recommended)

### Compliance
- **Election Laws**: Follow national election commission guidelines
- **Privacy**: GDPR/local data protection compliance
- **Accessibility**: WCAG 2.1 AA for inclusive voting
- **Audit Trail**: Complete immutable record of all actions

---

## 12. Deployment Architecture

### Blockchain Mode
```
Frontend (React/Vue)
  ↓ (Web3.js)
MetaMask Extension
  ↓
Smart Contract (on Ethereum/Polygon/Custom Chain)
  ↓
Backend (optional verification service)
```

### Demo Mode
```
Frontend (React/Vue)
  ↓ (Supabase Client)
Supabase Edge Functions / REST API
  ↓
PostgreSQL Database (Supabase)
  ↓
External Services (identity verification, broadcast)
```

### Shared Services
```
- Identity Verification Service (both modes)
- Email/SMS Notifications
- Admin Panel Backend
- Audit Log Aggregation
```

---

## 13. Switching Between Modes

### Configuration Points
```
environment.ts
├─ VOTING_MODE: 'BLOCKCHAIN' | 'DEMO'
├─ BLOCKCHAIN_CONFIG:
│  ├─ CHAIN_ID: number
│  ├─ RPC_URL: string
│  ├─ CONTRACT_ADDRESS: string
│  ├─ GAS_LIMIT: number
│  └─ NETWORK_NAME: string
└─ DEMO_CONFIG:
   ├─ SUPABASE_URL: string
   ├─ SUPABASE_ANON_KEY: string
   └─ IDENTITY_SERVICE_URL: string
```

### Runtime Mode Override
```
- Query Parameter: ?mode=demo
- Admin Dashboard: Global mode toggle (persists to config)
- Fallback Logic: If blockchain RPC fails, fallback to demo (with user notification)
```

---

## 14. Critical Implementation Checklist

### Before Frontend Development
- [ ] Define exact API contracts (request/response schemas)
- [ ] Finalize entity database schema for both modes
- [ ] Deploy and test smart contracts (or mock)
- [ ] Set up Supabase RLS policies
- [ ] Define all RPC function signatures
- [ ] Set up audit logging infrastructure
- [ ] Design encryption strategy for voter data
- [ ] Plan real-time update mechanism (BroadcastChannel + Supabase Realtime)

### Before Deployment
- [ ] Security audit of smart contracts
- [ ] Database security audit (RLS policies)
- [ ] Authentication/authorization review
- [ ] Load testing both backends
- [ ] Disaster recovery plan
- [ ] Admin training materials
- [ ] Legal/compliance review

---

## Summary

This architecture ensures:
1. **Dual-mode capability** with zero UX difference
2. **Adapter pattern** for seamless backend switching
3. **Backend-enforced rules** for security and compliance
4. **Real-time propagation** of admin actions
5. **Government-grade trust** with audit trails
6. **Production-readiness** from day one

All frontend code will be blockchain-themed, but the logic adapter handles the actual execution path transparently.
