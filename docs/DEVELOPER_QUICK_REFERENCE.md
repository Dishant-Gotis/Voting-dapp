# Blockchain Voting Platform - Developer Quick Reference

## 🚀 Quick Start (5 Minutes)

### 1. Install & Setup
```bash
cd voting-dapp
npm install
npm install web3
```

### 2. Create Environment File
```bash
# .env.local
VITE_VOTING_CONTRACT_ADDRESS=0x1234567890abcdef...
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### 3. Start Dev Server
```bash
npm run dev
# Opens http://localhost:3001
```

### 4. Deploy Contract (Testnet)
```bash
npx hardhat run scripts/deploy.js --network sepolia
# Copy address to .env.local
```

## 📋 Deployment Checklist

- [ ] Contract compiled successfully
- [ ] Testnet ETH obtained (Sepolia faucet)
- [ ] Contract deployed to testnet
- [ ] Contract address in .env.local
- [ ] MetaMask connected to Sepolia
- [ ] Frontend dev server running
- [ ] Create test election
- [ ] Add parties
- [ ] Start election
- [ ] Cast vote (should succeed)
- [ ] Cast vote again (should fail - "Already voted")
- [ ] End election
- [ ] Publish results
- [ ] Verify vote counts
- [ ] Check Etherscan verification

## 🔑 Key Code Snippets

### Initialize Blockchain Adapter
```typescript
import { BlockchainVotingAdapter } from '@/adapters';

const adapter = new BlockchainVotingAdapter();
await adapter.initialize(); // Triggers MetaMask
```

### Cast Vote
```typescript
try {
  const result = await adapter.castVote(electionId, partyId);
  console.log('Vote recorded:', result.transactionHash);
} catch (error) {
  if (error.message.includes('Already voted')) {
    alert('You have already voted');
  }
}
```

### Check Vote Status
```typescript
const status = await adapter.getVoteStatus(electionId);
if (status.hasVoted) {
  console.log('Already voted for party:', status.partyId);
} else {
  console.log('Can still vote');
}
```

### Admin: Create Election
```typescript
const electionId = await contract.methods
  .createElection(
    "Election Title",
    "Description",
    startTime,      // Unix timestamp
    endTime         // Unix timestamp
  )
  .send({ from: adminWallet });
```

### Admin: Add Party
```typescript
await contract.methods
  .addParty(electionId, "Party Name", "symbol-url")
  .send({ from: adminWallet });
```

### Admin: Start Election
```typescript
await contract.methods
  .startElection(electionId)
  .send({ from: adminWallet });
```

### Admin: End & Publish Results
```typescript
await contract.methods
  .endElection(electionId)
  .send({ from: adminWallet });

await contract.methods
  .publishResults(electionId)
  .send({ from: adminWallet });
```

## 📊 Smart Contract Functions

### Voting Operations
| Function | Role | Gas | Description |
|----------|------|-----|-------------|
| `castVote()` | Anyone | 120K | Record vote (blocks double voting) |
| `getVoteStatus()` | Anyone | 0 | Check if voted |
| `getVoteProof()` | Anyone | 0 | Get vote details |
| `hasVoterVoted()` | Anyone | 0 | Check eligibility |

### Admin Operations
| Function | Role | Gas | Description |
|----------|------|-----|-------------|
| `createElection()` | Admin | 80K | Create new election |
| `addParty()` | Admin | 60K | Register candidate |
| `startElection()` | Admin | 40K | Begin voting |
| `endElection()` | Admin | 40K | Stop voting |
| `publishResults()` | Admin | 50K | Lock results |
| `revokeVoter()` | Admin | 80K | Emergency: remove vote |

### Query Operations
| Function | Returns | Gas |
|----------|---------|-----|
| `getElection()` | Election details | 0 |
| `getParties()` | All parties | 0 |
| `getResults()` | Vote counts | 0 |
| `getAuditTrail()` | All votes | 0 |

## 🔒 Security Reminders

### Critical: One-Vote-Per-Wallet
```solidity
// This is enforced at CONTRACT level
require(!hasVoted[electionId][voter], "Already voted");
hasVoted[electionId][voter] = true;
```
**Cannot be bypassed from frontend**

### Time Validation
```solidity
// Only vote during election period
require(
  block.timestamp >= election.startTime &&
  block.timestamp <= election.endTime,
  "Voting period closed"
);
```

### Immutable Results
```solidity
// Once published, cannot change
require(!resultsPublished, "Already published");
resultsPublished = true;
// No way to call publishResults again
```

## 🧪 Testing Workflow

### Manual Test Case: Full Election
```typescript
// 1. Create election
const electionId = 0;
await contract.methods.createElection(
  "Test Election",
  "Testing",
  Math.floor(Date.now() / 1000) + 10,  // Start in 10 seconds
  Math.floor(Date.now() / 1000) + 300  // End in 5 minutes
).send({ from: admin });

// 2. Add parties
await contract.methods.addParty(electionId, "Party A", "url").send({ from: admin });
await contract.methods.addParty(electionId, "Party B", "url").send({ from: admin });

// 3. Start election
await contract.methods.startElection(electionId).send({ from: admin });

// 4. Wait for voting period
await new Promise(r => setTimeout(r, 11000));

// 5. Cast votes
await contract.methods.castVote(electionId, 0, "").send({ from: voter1 });
await contract.methods.castVote(electionId, 1, "").send({ from: voter2 });

// 6. Try voting twice (should fail)
try {
  await contract.methods.castVote(electionId, 0, "").send({ from: voter1 });
  console.error('ERROR: Double voting allowed!');
} catch (e) {
  console.log('✓ Double voting correctly prevented');
}

// 7. End election
await contract.methods.endElection(electionId).send({ from: admin });

// 8. Get results
const results = await contract.methods.getResults(electionId).call();
console.log('Results:', results);

// 9. Publish results
await contract.methods.publishResults(electionId).send({ from: admin });

// 10. Verify immutable
try {
  await contract.methods.publishResults(electionId).send({ from: admin });
  console.error('ERROR: Results can be republished!');
} catch (e) {
  console.log('✓ Results correctly immutable');
}
```

## 📁 File Structure

```
Smart Contract:        contracts/VotingElection.sol
Contract ABI:          contracts/VotingElection.abi.json
Web3.js Adapter:       src/adapters/BlockchainVotingAdapter.ts
Smart Contract Docs:   docs/BLOCKCHAIN_SMART_CONTRACTS.md
Deployment Guide:      docs/BLOCKCHAIN_DEPLOYMENT.md
```

## 🔗 Useful Links

**Testnet:**
- Sepolia Faucet: https://www.alchemy.com/faucets/sepolia
- Etherscan: https://sepolia.etherscan.io

**Documentation:**
- Solidity Docs: https://docs.soliditylang.org/
- Web3.js Docs: https://web3js.org/
- Hardhat Docs: https://hardhat.org/
- MetaMask Docs: https://docs.metamask.io/

**Tools:**
- Remix IDE: https://remix.ethereum.org/
- Solidity Compiler: https://www.solcompiler.io/
- Gas Estimator: https://www.gasnow.org/

## 🐛 Troubleshooting

### MetaMask Not Found
```typescript
if (!window.ethereum) {
  alert('Please install MetaMask');
}
```

### Wrong Network
```typescript
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x' + (11155111).toString(16) }],
});
```

### Transaction Fails
```
Error: "Already voted"
→ Check: hasVoterVoted() before calling castVote()

Error: "Voting period closed"
→ Check: Election time window is correct

Error: "Invalid party"
→ Check: partyId is valid (0 to partyCount-1)

Error: "Gas too high"
→ Check: Network congestion or gas price
```

### Contract Not Found
```
Error: "Cannot read property 'methods' of null"
→ Check: VITE_VOTING_CONTRACT_ADDRESS is set
→ Check: Contract deployed at address
→ Check: Correct network selected
```

## 📈 Performance Targets

- Contract deployment: < 2 minutes
- Vote submission: < 30 seconds
- Vote verification: < 1 second
- Results query: < 1 second

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run type-check      # TypeScript check

# Blockchain
npx hardhat compile                          # Compile Solidity
npx hardhat test                             # Run tests
npx hardhat run scripts/deploy.js --network sepolia  # Deploy
npx hardhat verify --network sepolia 0x...  # Verify on Etherscan

# Cleaning
rm -rf node_modules && npm install          # Fresh install
npm run build                                # Clean rebuild
```

## 📞 Support

**For contract questions:** See `docs/BLOCKCHAIN_SMART_CONTRACTS.md`

**For deployment issues:** See `docs/BLOCKCHAIN_DEPLOYMENT.md`

**For architecture:** See `docs/ARCHITECTURE.md`

**For adapter pattern:** See `docs/ADAPTER_PATTERN_GUIDE.md`

---

**Ready to deploy? Start with the 5-Minute Quick Start above! 🚀**
