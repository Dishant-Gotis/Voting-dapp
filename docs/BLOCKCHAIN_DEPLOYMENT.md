# Blockchain Deployment Guide

Complete guide to deploying and integrating VotingElection smart contract.

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install --save web3 @web3-react/core @web3-react/injected-connector
```

### 2. Set Environment Variables

```bash
# .env.local
VITE_VOTING_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

### 3. Connect MetaMask

Frontend automatically connects to MetaMask on initialization:

```typescript
import { BlockchainVotingAdapter } from '@/adapters/BlockchainVotingAdapter';

const adapter = new BlockchainVotingAdapter();
await adapter.initialize(); // Prompts MetaMask
```

## Full Deployment Guide

### Prerequisites

- Node.js 16+
- MetaMask browser extension
- Testnet ETH (Sepolia)
- Hardhat knowledge (optional)

### Step 1: Compile Contract

```bash
# Create hardhat project (if not exists)
npm install --save-dev hardhat

# Initialize hardhat
npx hardhat

# Copy VotingElection.sol to contracts/
cp contracts/VotingElection.sol <hardhat-project>/contracts/

# Compile
npx hardhat compile
```

### Step 2: Deploy to Testnet

**Create deployment script:**

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("Deploying VotingElection...");

  const VotingElection = await hre.ethers.getContractFactory("VotingElection");
  const voting = await VotingElection.deploy();

  await voting.deployed();

  console.log("\n✅ VotingElection deployed to:", voting.address);
  console.log("\nAdd to .env.local:");
  console.log(`VITE_VOTING_CONTRACT_ADDRESS=${voting.address}`);

  // Verify on Etherscan
  console.log("\nTo verify on Etherscan:");
  console.log(
    `npx hardhat verify --network sepolia ${voting.address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Configure Hardhat for Sepolia:**

```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
```

**Deploy:**

```bash
# Set environment variables
export SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
export PRIVATE_KEY=your_private_key_here
export ETHERSCAN_API_KEY=your_etherscan_key

# Deploy
npx hardhat run scripts/deploy.js --network sepolia

# Example output:
# ✅ VotingElection deployed to: 0x1234567890abcdef...
# Add to .env.local:
# VITE_VOTING_CONTRACT_ADDRESS=0x1234567890abcdef...
```

### Step 3: Update Frontend Configuration

**Create `.env.local`:**

```bash
# .env.local
VITE_VOTING_CONTRACT_ADDRESS=0x1234567890abcdef...
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

**Update Vite config:**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Step 4: Initialize Blockchain Adapter

**Update VotingContext:**

```typescript
// src/context/VotingContext.tsx
import { BlockchainVotingAdapter } from '@/adapters/BlockchainVotingAdapter';

export const VotingContext = createContext<VotingContextType | undefined>(
  undefined
);

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [votingMode, setVotingMode] = useState<'blockchain' | 'demo'>('demo');
  const [adapter, setAdapter] = useState<BlockchainVotingAdapter | null>(null);

  useEffect(() => {
    if (votingMode === 'blockchain') {
      initializeBlockchain();
    }
  }, [votingMode]);

  const initializeBlockchain = async () => {
    try {
      const blockchainAdapter = new BlockchainVotingAdapter();
      await blockchainAdapter.initialize();
      setAdapter(blockchainAdapter);
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
      // Fallback to demo mode
      setVotingMode('demo');
    }
  };

  return (
    <VotingContext.Provider value={{
      votingMode,
      setVotingMode,
      adapter,
    }}>
      {children}
    </VotingContext.Provider>
  );
}
```

### Step 5: Test Voting Flow

**Manual Testing Checklist:**

- [ ] MetaMask connects successfully
- [ ] Account address shown in UI
- [ ] Can create election (admin wallet)
- [ ] Can add parties to draft election
- [ ] Can start election
- [ ] Non-admin cannot perform admin actions
- [ ] Can cast vote (first time)
- [ ] Cannot cast vote twice (blocked by contract)
- [ ] Vote status shows correctly
- [ ] Can view vote proof
- [ ] Results show correct vote counts
- [ ] Can publish results (immutable)

**Test Script:**

```bash
# 1. Start dev server
npm run dev

# 2. Open http://localhost:3001

# 3. Connect MetaMask to Sepolia testnet

# 4. Get testnet ETH from faucet:
# https://www.alchemy.com/faucets/sepolia

# 5. Create test election:
# - Admin panel → Create Election
# - Title: "Test Election 2024"
# - Start time: now + 1 minute
# - End time: now + 2 minutes

# 6. Add parties:
# - Party A
# - Party B
# - Party C

# 7. Start election

# 8. Vote for Party B

# 9. Try voting again (should fail)

# 10. View vote status

# 11. End election

# 12. Publish results

# 13. Check vote counts
```

## Testnet Faucets

**Sepolia:**
- https://www.alchemy.com/faucets/sepolia
- https://sepolia-faucet.pk910.de/

**Goerli:**
- https://www.alchemy.com/faucets/goerli
- https://goerlifaucet.com/

**Holesky:**
- https://faucet.holesky.ethpandaops.io/

## Monitoring & Verification

### Check Contract on Etherscan

```bash
# Verify contract source code
npx hardhat verify --network sepolia 0x1234567890abcdef... 

# View on Etherscan
# https://sepolia.etherscan.io/address/0x1234567890abcdef...
```

### Monitor Transactions

```typescript
// Watch vote events
const votingContract = new web3.eth.Contract(ABI, contractAddress);

votingContract.events.VoteCast({
  filter: { electionId: 0 },
  fromBlock: 'latest'
})
.on('data', (event) => {
  console.log('Vote cast:', event.returnValues);
})
.on('error', console.error);
```

### Query Contract State

```typescript
// Get election details
const election = await contract.methods
  .getElection(0)
  .call();

console.log('Election:', {
  title: election.title,
  status: election.status, // 0=DRAFT, 1=ACTIVE, 2=COMPLETED, 3=ARCHIVED
  totalVotes: election.totalVotes,
  resultsPublished: election.resultsPublished,
});

// Get parties
const parties = await contract.methods
  .getParties(0)
  .call();

parties.forEach((party, i) => {
  console.log(`Party ${i}: ${party.name} - ${party.voteCount} votes`);
});
```

## Production Deployment

### Mainnet Checklist

- [ ] Contract audited by security firm
- [ ] Test coverage >95%
- [ ] All gas optimizations applied
- [ ] Etherscan verification complete
- [ ] Frontend tested on mainnet
- [ ] Emergency pause mechanism in place
- [ ] Admin key management plan
- [ ] Rollback plan documented

### Deployment to Mainnet

```bash
# 1. Update network config
# hardhat.config.js → add mainnet network

# 2. Ensure sufficient ETH for gas

# 3. Deploy
export MAINNET_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY
export PRIVATE_KEY=your_mainnet_key
npx hardhat run scripts/deploy.js --network mainnet

# 4. Verify
npx hardhat verify --network mainnet 0x...

# 5. Update .env.production
VITE_VOTING_CONTRACT_ADDRESS=0x...
```

## Troubleshooting

### MetaMask Connection Failed

**Problem:** "MetaMask not installed" error

**Solution:**
```typescript
if (!window.ethereum) {
  alert('Please install MetaMask');
}
```

### Wrong Network

**Problem:** Connected to wrong blockchain

**Solution:**
```typescript
// Request network switch
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x' + (11155111).toString(16) }],
});
```

### Transaction Reverted

**Problem:** "Transaction failed on-chain"

**Possible causes:**
- Already voted
- Election not active
- Invalid party ID
- Insufficient gas

**Solution:**
```typescript
try {
  await adapter.castVote(electionId, partyId);
} catch (error) {
  if (error.message.includes('Already voted')) {
    alert('You have already voted');
  } else if (error.message.includes('not active')) {
    alert('Election voting period is closed');
  }
}
```

### Gas Too High

**Problem:** Gas estimates very high

**Solutions:**
1. Check network congestion
2. Reduce gas price (slower, but cheaper)
3. Optimize contract code
4. Bundle operations

### Contract Not Found

**Problem:** "Cannot read property 'methods' of null"

**Solution:**
```typescript
if (!contract) {
  console.error('Contract not initialized at:', VOTING_CONTRACT_ADDRESS);
  throw new Error('Contract address not configured');
}
```

## Support

**Useful Links:**
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Web3.js Documentation](https://web3js.org/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)

## Version Compatibility

- **Solidity:** ^0.8.20
- **Web3.js:** ^1.10.0
- **Ethers.js:** ^6.0.0 (alternative)
- **Hardhat:** ^2.14.0
- **Node.js:** 16+
- **React:** 18+

## License

SPDX-License-Identifier: MIT
