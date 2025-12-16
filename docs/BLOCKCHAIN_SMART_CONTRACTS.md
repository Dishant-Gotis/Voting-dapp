# Blockchain Smart Contract Implementation

Production-grade Solidity smart contracts for the voting system.

## Overview

### VotingElection.sol

Main contract handling all voting operations on-chain.

**Key Properties:**
- **Admin-managed elections**: Only contract admin can create and manage elections
- **Immutable vote records**: All votes recorded on-chain with full transaction history
- **One-vote-per-wallet enforcement**: Smart contract prevents double voting
- **Complete audit trail**: All operations emit events for full transparency
- **Tamper-proof results**: Results locked after publication

### Core Features

#### 1. Election Lifecycle

```
DRAFT (created) → ACTIVE (accepting votes) → COMPLETED (voting ended) → ARCHIVED (results published)
```

**DRAFT State:**
- Admin can add parties/candidates (1-10 parties per election)
- Cannot be changed after moving to ACTIVE
- Admin can review before starting

**ACTIVE State:**
- Only during voting period (startTime to endTime)
- Voters can cast votes
- No new parties can be added
- Admin cannot change election parameters

**COMPLETED State:**
- Voting period has ended
- No new votes accepted
- Results can be published

**ARCHIVED State:**
- Results permanently published on-chain
- Cannot be modified
- Immutable record for audit

#### 2. Vote Recording

**Critical Security: One-Vote-Per-Wallet**

```solidity
mapping(uint256 => mapping(address => bool)) public hasVoted;
```

The smart contract maintains a mapping of election ID → voter address → voted status. When a user casts a vote, the contract checks:

1. Has this wallet already voted in this election? → Reject if true
2. Is the election currently active? → Reject if false
3. Is the party valid? → Reject if invalid

Only after all checks pass does the contract:
1. Mark wallet as voted
2. Increment party vote count
3. Increment total votes
4. Record vote on-chain
5. Emit VoteCast event

**This prevents:**
- Double voting by same wallet
- Voting outside voting period
- Voting for invalid parties
- All validation happens on-chain (no trust in frontend)

#### 3. Audit Trail

All actions emit events:

```solidity
event VoteCast(
    uint256 indexed electionId,
    address indexed voter,
    uint256 indexed partyId,
    uint256 timestamp
);

event ElectionCreated(
    uint256 indexed electionId,
    address indexed admin,
    string title,
    uint256 startTime,
    uint256 endTime
);

event ResultsPublished(
    uint256 indexed electionId,
    uint256 timestamp
);
```

Full audit trail queryable:
- Filter events by election ID
- Track all votes with voter address, party, and timestamp
- Verify administrator actions
- Complete transparency

## Contract Functions

### Admin Operations

#### createElection
```solidity
function createElection(
    string memory _title,
    string memory _description,
    uint256 _startTime,
    uint256 _endTime
) external returns (uint256)
```

Creates new election. Returns election ID.

**Requirements:**
- Title not empty
- Start time > current time
- End time > start time
- Max title length 255 chars

**Returns:** Election ID for referencing election

**Events:** ElectionCreated

#### addParty
```solidity
function addParty(
    uint256 _electionId,
    string memory _name,
    string memory _symbolUrl
) external
```

Register party/candidate in election.

**Requirements:**
- Election in DRAFT status
- Caller is election admin
- Party name not empty
- Max 10 parties per election

**Events:** PartyAdded

#### startElection
```solidity
function startElection(uint256 _electionId) external
```

Transition election from DRAFT to ACTIVE. Voting can now begin.

**Requirements:**
- Election in DRAFT status
- Caller is election admin
- At least 1 party registered
- Current time < start time

**Events:** ElectionStarted

#### endElection
```solidity
function endElection(uint256 _electionId) external
```

Transition from ACTIVE to COMPLETED. No new votes accepted.

**Requirements:**
- Election in ACTIVE status
- Caller is election admin

**Events:** ElectionEnded

#### publishResults
```solidity
function publishResults(uint256 _electionId) external
```

Publish results permanently. Cannot be changed after.

**Requirements:**
- Election in COMPLETED status
- Caller is election admin
- Results not already published

**Events:** ResultsPublished

#### revokeVoter
```solidity
function revokeVoter(
    uint256 _electionId,
    address _voter
) external
```

Emergency function: revoke a voter's ballot (rare use).

**Requirements:**
- Caller is election admin
- Voter has already voted
- Election exists

**Effects:**
- Reduces party vote count
- Reduces total votes
- Marks voter as not voted
- Allows voter to vote again

### Voting Functions

#### castVote
```solidity
function castVote(
    uint256 _electionId,
    uint256 _partyId,
    string memory _ipfsHash
) external returns (bool)
```

Record vote on-chain. **This is the critical function.**

**Requirements:**
- Election in ACTIVE status
- Current time within voting period (startTime ≤ now ≤ endTime)
- Valid party ID
- Party is active
- **Caller has NOT voted yet** ← Critical check

**Returns:** True if vote recorded successfully

**Events:** VoteCast

**Vote Record:**
- Voter address (msg.sender)
- Party ID
- Timestamp
- Optional IPFS hash (for encrypted proof storage)

### View Functions

#### getElection
```solidity
function getElection(uint256 _electionId) external view returns (
    address admin,
    string memory title,
    string memory description,
    uint256 startTime,
    uint256 endTime,
    ElectionStatus status,
    uint256 totalVotes,
    uint256 partyCount,
    bool resultsPublished
)
```

Get complete election metadata.

#### getParties
```solidity
function getParties(uint256 _electionId) external view returns (Party[] memory)
```

Get all parties/candidates in election with vote counts.

Returns array of Party structs:
```solidity
struct Party {
    uint256 id;
    string name;
    string symbolUrl;
    uint256 voteCount;
    bool active;
}
```

#### getResults
```solidity
function getResults(uint256 _electionId) external view returns (Party[] memory)
```

Get published results. Only available after results published.

**Throws error** if results not yet published.

#### hasVoterVoted
```solidity
function hasVoterVoted(
    uint256 _electionId,
    address _voter
) external view returns (bool)
```

Check if specific wallet has voted. Used by frontend to prevent re-voting.

#### getVoteRecord
```solidity
function getVoteRecord(
    uint256 _electionId,
    address _voter
) external view returns (
    address voter,
    uint256 partyId,
    uint256 timestamp,
    string memory ipfsHash
)
```

Get vote proof for a wallet. Only works if wallet has voted.

#### getAuditTrail
```solidity
function getAuditTrail() external view returns (Vote[] memory)
```

Complete audit trail of all votes. Returns all Vote structs:

```solidity
struct Vote {
    address voter;
    uint256 electionId;
    uint256 partyId;
    uint256 timestamp;
    string ipfsHash;
}
```

Can be filtered off-chain by election ID.

## Security Considerations

### 1. Double Voting Prevention

**Primary: Smart Contract Check**
```solidity
require(!hasVoted[_electionId][voter], "Already voted");
```

Cannot be bypassed by frontend manipulation. Must be enforced on-chain.

**Frontend Verification:**
Call `hasVoterVoted()` before showing vote button to improve UX.

### 2. Time-Based Access Control

Elections only accept votes during specific window:
```solidity
require(
    block.timestamp >= election.startTime &&
    block.timestamp <= election.endTime,
    "Voting period closed"
);
```

Cannot be changed by users. Uses blockchain timestamp.

### 3. Admin Authorization

All management functions verify:
```solidity
require(elections[_electionId].admin == msg.sender, "Only election admin");
```

Admin wallet is the only address that can manage election lifecycle.

### 4. Input Validation

- Election titles validated for length
- Party names required
- Party count limited to 10
- Time ranges validated (start < end, start > now)
- Party IDs bounds checked
- Voter addresses validated

### 5. State Machine Enforcement

Elections follow strict state transitions:
- DRAFT → ACTIVE → COMPLETED → ARCHIVED
- Cannot skip states
- Cannot go backwards
- Each function checks specific state requirement

### 6. Immutable Results

Once `publishResults()` called:
- Status locked to ARCHIVED
- Results cannot be changed
- Cannot unpublish results

## Deployment

### Prerequisites

```bash
npm install -g hardhat
npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

### Deployment Script

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const VotingElection = await hre.ethers.getContractFactory("VotingElection");
  const votingElection = await VotingElection.deploy();
  
  await votingElection.deployed();
  
  console.log("VotingElection deployed to:", votingElection.address);
  
  // Save address for frontend
  console.log(
    'Add to .env.local:',
    `VITE_VOTING_CONTRACT_ADDRESS=${votingElection.address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Deploy to Testnet

```bash
# Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Goerli
npx hardhat run scripts/deploy.js --network goerli
```

### Environment Variables

```bash
# .env.local
VITE_VOTING_CONTRACT_ADDRESS=0x...
VITE_VOTING_ELECTION_ABI=[...]
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VITE_CHAIN_ID=11155111  # Sepolia
```

## Frontend Integration

### Initialize Adapter

```typescript
import { BlockchainVotingAdapter } from '@/adapters';

const adapter = new BlockchainVotingAdapter();
await adapter.initialize(); // Triggers MetaMask connection
```

### Check Eligibility

```typescript
const eligible = await adapter.verifyVoterEligibility(electionId);
if (!eligible) {
  alert('You have already voted');
  return;
}
```

### Cast Vote

```typescript
try {
  const result = await adapter.castVote(electionId, partyId);
  console.log('Vote recorded:', result.transactionHash);
} catch (error) {
  console.error('Vote failed:', error.message);
}
```

### Get Status

```typescript
const status = await adapter.getVoteStatus(electionId);
if (status.hasVoted) {
  console.log('Already voted for party:', status.partyId);
  console.log('Vote time:', new Date(status.voteTime));
}
```

### Get Proof

```typescript
const proof = await adapter.getVoteProof(electionId);
if (proof) {
  console.log('Vote recorded at:', proof.timestamp);
  console.log('Party voted:', proof.partyId);
}
```

## Testing

### Unit Tests

```javascript
// test/VotingElection.test.js
const { expect } = require("chai");

describe("VotingElection", () => {
  let votingElection;
  let admin, voter1, voter2;

  beforeEach(async () => {
    [admin, voter1, voter2] = await ethers.getSigners();
    const VotingElection = await ethers.getContractFactory("VotingElection");
    votingElection = await VotingElection.deploy();
    await votingElection.deployed();
  });

  describe("createElection", () => {
    it("should create election", async () => {
      const title = "2024 General Election";
      const startTime = Math.floor(Date.now() / 1000) + 86400;
      const endTime = startTime + 86400;

      const tx = await votingElection.createElection(
        title,
        "Test election",
        startTime,
        endTime
      );

      const receipt = await tx.wait();
      expect(receipt.events[0].event).to.equal("ElectionCreated");
    });

    it("should prevent voting before start time", async () => {
      const title = "Future Election";
      const startTime = Math.floor(Date.now() / 1000) + 86400;
      const endTime = startTime + 86400;

      const electionId = 0;
      await votingElection.createElection(title, "Test", startTime, endTime);
      await votingElection.addParty(electionId, "Party A", "");
      
      // Should fail - not in voting period yet
      await expect(
        votingElection.connect(voter1).castVote(electionId, 0, "")
      ).to.be.revertedWith("Voting period closed");
    });

    it("should prevent double voting", async () => {
      const title = "Election";
      const startTime = Math.floor(Date.now() / 1000) + 10;
      const endTime = startTime + 86400;

      const electionId = 0;
      await votingElection.createElection(title, "Test", startTime, endTime);
      await votingElection.addParty(electionId, "Party A", "");
      await votingElection.startElection(electionId);

      // Wait for voting to start
      await new Promise(resolve => setTimeout(resolve, 11000));

      // First vote - should succeed
      await votingElection.connect(voter1).castVote(electionId, 0, "");

      // Second vote - should fail
      await expect(
        votingElection.connect(voter1).castVote(electionId, 0, "")
      ).to.be.revertedWith("Already voted");
    });
  });
});
```

Run tests:
```bash
npx hardhat test
```

## Gas Optimization

Contract uses efficient patterns:
- Uint256 for IDs and counts (standard word size)
- Storage arrays for parties (gas efficient for small numbers)
- Mapping for vote lookup (O(1) access)
- Events for audit trail (off-chain logs, minimal storage)

**Estimated Gas:**
- createElection: ~80,000 gas
- addParty: ~60,000 gas
- castVote: ~120,000 gas
- getVoteStatus (view): ~5,000 gas

## Compliance

**Features for Government/Election Compliance:**
- ✅ Complete immutable audit trail
- ✅ One-vote-per-wallet enforcement
- ✅ Admin access control
- ✅ Results cannot be modified after publication
- ✅ All actions timestamped on-chain
- ✅ Full transparency (blockchain public)
- ✅ Tamper-proof vote recording
- ✅ No single point of failure (decentralized)

## Upgrades

Contract follows non-upgradeable pattern for immutability. For future upgrades:

1. **Deploy new contract** with improvements
2. **Run data migration** to copy election data
3. **Update frontend** to use new contract address
4. **Archive old contract** for audit history

This maintains immutability while allowing improvements.

## Contact & Support

Contract implements VotingElection interface exactly as specified in adapter pattern. All frontend code uses only the IVotingAdapter interface, so contract changes don't affect frontend.
