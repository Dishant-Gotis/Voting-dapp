# Adapter Pattern Implementation Guide

## Overview

The voting DAPP uses the **Adapter Pattern** to route all backend calls between two execution pipelines:
1. **Blockchain Mode**: Direct smart contract calls via Web3.js + MetaMask
2. **Demo Mode**: Supabase backend calls via REST API + RPC functions

The UI remains **completely identical** across both modes. Only the logic layer branches.

---

## Architecture

### Adapter Interfaces

Four main adapter interfaces define the contract:

#### 1. `IVotingAdapter`
Handles individual vote casting and retrieval.

```typescript
interface IVotingAdapter {
  castVote(electionId: string, partyId: string): Promise<VoteResult>
  getVoteStatus(electionId: string): Promise<VoteStatus>
  verifyVoterEligibility(electionId: string): Promise<boolean>
  getVoteProof(electionId: string): Promise<any>
}
```

**Usage:**
```typescript
const votingAdapter = adapterFactory.getVotingAdapter()
const result = await votingAdapter.castVote('election_1', 'party_1')
```

#### 2. `IElectionAdapter`
Handles election management (create, list, start, end, results).

```typescript
interface IElectionAdapter {
  createElection(input: CreateElectionInput): Promise<Election>
  getElection(electionId: string): Promise<Election>
  listElections(): Promise<Election[]>
  startElection(electionId: string): Promise<{ success: boolean }>
  endElection(electionId: string): Promise<{ success: boolean }>
  getResults(electionId: string): Promise<ElectionResults>
}
```

**Usage:**
```typescript
const electionAdapter = adapterFactory.getElectionAdapter()
const elections = await electionAdapter.listElections()
```

#### 3. `IUserAdapter`
Handles user authentication and profile management.

```typescript
interface IUserAdapter {
  authenticate(email: string, password: string): Promise<UserSession>
  registerVoter(userData: Partial<UserProfile>): Promise<UserProfile>
  getProfile(userId: string): Promise<UserProfile>
  verifyIdentity(voterData: any): Promise<VerificationStatus>
  checkVoterRole(electionId: string): Promise<'VOTER' | 'ADMIN' | 'NONE'>
  logout(): Promise<void>
}
```

#### 4. `IAdminAdapter`
Handles election administration (add voters, parties, announce results).

```typescript
interface IAdminAdapter {
  createElection(data: any): Promise<AdminActionResult>
  addParties(electionId: string, parties: Partial<Party>[]): Promise<AdminActionResult>
  addVoters(electionId: string, voters: any[]): Promise<AdminActionResult>
  removeVoters(electionId: string, voterIds: string[]): Promise<AdminActionResult>
  startElection(electionId: string): Promise<AdminActionResult>
  endElection(electionId: string): Promise<AdminActionResult>
  announceResults(electionId: string): Promise<AdminActionResult>
  getAuditLogs(electionId: string): Promise<AuditLogEntry[]>
  getBroadcastChannel(): BroadcastChannel | null
}
```

---

## Adapter Factory

The **AdapterFactory** singleton manages adapter instantiation and mode switching.

### Location
```
src/adapters/AdapterFactory.ts
```

### Key Methods

#### `setVotingMode(mode: VotingMode): void`
Switch the voting mode globally. All subsequent adapter calls use this mode.

```typescript
import { adapterFactory } from '../adapters'

adapterFactory.setVotingMode('BLOCKCHAIN')
adapterFactory.setVotingMode('DEMO')
```

#### `getVotingAdapter(): IVotingAdapter`
Returns the appropriate voting adapter based on current mode.

```typescript
const votingAdapter = adapterFactory.getVotingAdapter()
// Returns BlockchainVotingAdapter if mode === 'BLOCKCHAIN'
// Returns DemoVotingAdapter if mode === 'DEMO'
```

#### `getElectionAdapter(): IElectionAdapter`
Returns the appropriate election adapter based on current mode.

```typescript
const electionAdapter = adapterFactory.getElectionAdapter()
// Returns BlockchainElectionAdapter or DemoElectionAdapter
```

#### `getVotingMode(): VotingMode`
Get the current voting mode.

```typescript
const currentMode = adapterFactory.getVotingMode()
console.log(currentMode) // 'BLOCKCHAIN' or 'DEMO'
```

#### Mode-Specific Adapters (Advanced)
Get blockchain-only or demo-only adapters for mode-specific logic (if needed).

```typescript
const blockchainAdapter = adapterFactory.getBlockchainVotingAdapter()
const demoAdapter = adapterFactory.getDemoVotingAdapter()
```

---

## Concrete Implementations

### Blockchain Adapters

#### `BlockchainVotingAdapter`
```typescript
class BlockchainVotingAdapter implements IVotingAdapter {
  async castVote(electionId: string, partyId: string): Promise<VoteResult>
  async getVoteStatus(electionId: string): Promise<VoteStatus>
  async verifyVoterEligibility(electionId: string): Promise<boolean>
  async getVoteProof(electionId: string): Promise<any>
}
```

**Implementation Details:**
- Calls Web3.js to interact with smart contracts
- Uses MetaMask for wallet connection and signing
- Returns blockchain-specific proof (transaction hash, block number)
- Simulates 5-15 second latency (blockchain confirmation time)

#### `BlockchainElectionAdapter`
```typescript
class BlockchainElectionAdapter implements IElectionAdapter
```

**Implementation Details:**
- Deploys smart contracts for new elections
- Queries contract state for election data
- Calls contract functions for state changes
- Emits blockchain events for real-time updates

### Demo Adapters

#### `DemoVotingAdapter`
```typescript
class DemoVotingAdapter implements IVotingAdapter {
  async castVote(electionId: string, partyId: string): Promise<VoteResult>
  async getVoteStatus(electionId: string): Promise<VoteStatus>
  async verifyVoterEligibility(electionId: string): Promise<boolean>
  async getVoteProof(electionId: string): Promise<any>
}
```

**Implementation Details:**
- Calls Supabase RPC functions
- Returns instant results (<1 second)
- Returns demo-specific proof (certificate ID)
- No blockchain latency

#### `DemoElectionAdapter`
```typescript
class DemoElectionAdapter implements IElectionAdapter
```

**Implementation Details:**
- Calls Supabase REST API for CRUD operations
- Uses RPC functions for complex operations
- Leverages Supabase Realtime for live updates

---

## Usage Examples

### Example 1: Casting a Vote (UI Remains Identical)

**Component Code (No Mode Branching):**
```typescript
import { adapterFactory } from '../adapters'

export const VotePage: React.FC = () => {
  const handleVote = async (electionId: string, partyId: string) => {
    const votingAdapter = adapterFactory.getVotingAdapter()
    
    try {
      const result = await votingAdapter.castVote(electionId, partyId)
      
      if (result.success) {
        // Show confirmation (same for both modes)
        setVoteResult(result)
        setVoted(true)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Vote failed:', error)
    }
  }

  return (
    <div>
      {/* UI Code - No branching on mode */}
      <button onClick={() => handleVote('election_1', 'party_1')}>
        Cast Vote
      </button>
    </div>
  )
}
```

**What Happens:**
- If `mode === 'BLOCKCHAIN'`: Calls `BlockchainVotingAdapter.castVote()`
  - Connects to MetaMask
  - Signs transaction
  - Calls smart contract
  - Returns transaction hash + block number
  
- If `mode === 'DEMO'`: Calls `DemoVotingAdapter.castVote()`
  - Calls Supabase RPC `rpc_cast_vote()`
  - Returns instant result + certificate ID

**Result Object (Identical Structure for Both Modes):**
```typescript
{
  success: true,
  voteId: 'vote_1702...',
  transactionHash: '0x1234...' (BLOCKCHAIN only),
  message: 'Vote cast successfully',
  timestamp: 1702...,
  proof: {
    merkleRoot: '0x5678...' (BLOCKCHAIN),
    certificateId: 'cert_...' (DEMO)
  }
}
```

---

### Example 2: Getting Election Results

**Component Code (Mode-Agnostic):**
```typescript
import { adapterFactory } from '../adapters'

const getResults = async (electionId: string) => {
  const electionAdapter = adapterFactory.getElectionAdapter()
  const results = await electionAdapter.getResults(electionId)
  
  // Display results (same UI for both modes)
  return results // { electionId, status, results[], totalVotes }
}
```

**What Happens:**
- BLOCKCHAIN: Queries smart contract for vote counts
- DEMO: Queries Supabase `votes` table, groups by party

---

### Example 3: Mode Switching (Via Context)

**Context Hook Usage:**
```typescript
import { useVotingMode } from '../context/VotingContext'

export const Header: React.FC = () => {
  const { mode, setMode } = useVotingMode()

  const switchMode = (newMode: 'BLOCKCHAIN' | 'DEMO') => {
    setMode(newMode) // Automatically updates adapter factory
  }

  return (
    <div>
      Current Mode: {mode}
      <button onClick={() => switchMode('BLOCKCHAIN')}>
        Switch to Blockchain
      </button>
      <button onClick={() => switchMode('DEMO')}>
        Switch to Demo
      </button>
    </div>
  )
}
```

**What Happens:**
1. `setMode()` updates React context state
2. Internally calls `adapterFactory.setVotingMode(newMode)`
3. All subsequent adapter calls use new mode
4. **No page reload, no UI changes**

---

## Mode Selection Flow

### First-Time Visitor Flow

```
App Loads
  ↓
VotingContext initialized
  ↓
Check: Has visited before?
  ├─ Yes → Skip mode selection, load homepage
  └─ No → Show ModeSelectionModal
  ↓
User Selects Mode
  ├─ Blockchain 🔗
  └─ Demo 🔄
  ↓
Modal Closes
  ↓
AdapterFactory.setVotingMode(selectedMode)
  ↓
Mark "visitedBefore" in localStorage
  ↓
Proceed with mode-specific adapter
```

### Returning Visitor Flow

```
App Loads
  ↓
VotingContext reads sessionStorage
  ↓
Last used mode loaded automatically
  ↓
AdapterFactory.setVotingMode(savedMode)
  ↓
Show homepage (no modal)
```

### URL Parameter Override

```
Visit: ?mode=demo
  ↓
VotingContext detects URL param
  ↓
Force demo mode (ignores saved preference)
  ↓
Skip mode selection modal
  ↓
Proceed with demo adapters
```

---

## Key Design Principles

### 1. **No UI Branching**
```typescript
// ❌ DON'T: Branch UI based on mode
if (mode === 'BLOCKCHAIN') {
  return <BlockchainUI />
} else {
  return <DemoUI />
}

// ✅ DO: Branch only in logic layer
const adapter = adapterFactory.getVotingAdapter()
const result = await adapter.castVote(...)
// Use same UI component for result
```

### 2. **Adapter Contracts are Identical**
Both adapters implement the same interface. Result objects have the same shape.

```typescript
// Same interface, different implementations
interface IVotingAdapter {
  castVote(...): Promise<VoteResult>
}

// BlockchainVotingAdapter.castVote() → blockchain logic
// DemoVotingAdapter.castVote() → supabase logic
// But both return: VoteResult
```

### 3. **Mode Selection is Optional**
Users can switch modes anytime without page reload. Mode toggle is in header.

```typescript
// In ModeToggle component
<button onClick={() => setMode('BLOCKCHAIN')}>
  Switch to Blockchain
</button>
```

### 4. **Backend Enforces Rules**
All critical validation happens on backend, not frontend.

```typescript
// ✅ Frontend calls adapter
const result = await votingAdapter.castVote(electionId, partyId)

// ✅ Backend (blockchain or Supabase) validates:
//   - Voter eligibility
//   - No duplicate votes
//   - Election status is ONGOING
//   - Returns success or error message
```

---

## File Structure

```
src/
├── adapters/
│   ├── IVotingAdapter.ts              # Voting interface
│   ├── IElectionAdapter.ts            # Election interface
│   ├── IUserAdapter.ts                # User interface
│   ├── IAdminAdapter.ts               # Admin interface
│   ├── BlockchainVotingAdapter.ts     # Blockchain voting impl
│   ├── DemoVotingAdapter.ts           # Demo voting impl
│   ├── BlockchainElectionAdapter.ts   # Blockchain election impl
│   ├── DemoElectionAdapter.ts         # Demo election impl
│   ├── AdapterFactory.ts              # Factory & routing
│   └── index.ts                       # Exports
│
├── context/
│   └── VotingContext.tsx              # Mode state + adapter sync
│
├── components/
│   ├── ModeSelectionModal.tsx         # First-visit mode picker
│   ├── ModeToggle.tsx                 # Header mode switcher
│   └── ...other components
│
├── pages/
│   ├── Vote.tsx                       # Uses votingAdapter
│   ├── Admin.tsx                      # Uses adminAdapter
│   └── ...other pages
│
└── App.tsx                            # Renders ModeSelectionModal
```

---

## Testing Adapters

### Mock Adapter Pattern
When writing tests, mock the adapters:

```typescript
// __mocks__/MockVotingAdapter.ts
export class MockVotingAdapter implements IVotingAdapter {
  async castVote(electionId: string, partyId: string): Promise<VoteResult> {
    return {
      success: true,
      voteId: 'test_vote_1',
      message: 'Mock vote cast',
      timestamp: Date.now(),
      proof: { certificateId: 'test_cert' }
    }
  }

  // ... other methods
}
```

### Usage in Tests
```typescript
import { adapterFactory } from '../adapters'
import { MockVotingAdapter } from './__mocks__/MockVotingAdapter'

jest.spyOn(adapterFactory, 'getVotingAdapter').mockReturnValue(
  new MockVotingAdapter()
)

// Now all voting adapter calls use the mock
```

---

## Next Steps for Backend Implementation

### For Blockchain Mode
1. Deploy smart contracts to testnet/mainnet
2. Update `BlockchainVotingAdapter` to call Web3.js
3. Update `BlockchainElectionAdapter` to deploy contracts
4. Implement contract event listeners for real-time updates

### For Demo Mode
1. Create Supabase RPC functions:
   - `rpc_cast_vote()`
   - `rpc_create_election()`
   - `rpc_get_results()`
2. Set up RLS policies on `votes`, `elections`, `parties` tables
3. Implement Supabase Realtime listeners in adapters
4. Update `DemoVotingAdapter` and `DemoElectionAdapter` with actual Supabase calls

---

## Summary

The adapter pattern provides:
✅ **Unified interface** for all backend operations  
✅ **Identical UI** across blockchain and demo modes  
✅ **Easy mode switching** without page reload  
✅ **Testability** via mock adapters  
✅ **Future-proof** structure for new adapters  

All logic branching happens in adapters, **never in UI components**.
