import { Network } from '@/types';

// Network configurations
export const NETWORKS: Record<number, Network> = {
  1: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io',
  },
  11155111: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
  1337: {
    chainId: 1337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545',
    explorerUrl: 'http://localhost:8545',
  },
};

// Application configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Blockchain Voting DApp',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Secure, transparent, and immutable voting system',
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1337'),
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545',
  contractAddress: process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://etherscan.io',
};

// Contract ABI (simplified for now - will be updated with actual contract ABI)
export const VOTING_CONTRACT_ABI = [
  // Election management
  'function createElection(string memory title, string memory description, uint256 startTime, uint256 endTime) external',
  'function startElection() external',
  'function endElection() external',
  'function getElection() external view returns (string memory title, string memory description, uint256 startTime, uint256 endTime, uint8 status, uint256 totalVotes)',
  
  // Candidate management
  'function addCandidate(string memory name, string memory description) external',
  'function getCandidateCount() external view returns (uint256)',
  'function getCandidate(uint256 candidateId) external view returns (string memory name, string memory description, uint256 voteCount)',
  
  // Voter management
  'function addVoter(address voterAddress) external',
  'function isVoterWhitelisted(address voterAddress) external view returns (bool)',
  'function hasVoted(address voterAddress) external view returns (bool)',
  'function getVoterVote(address voterAddress) external view returns (uint256)',
  
  // Voting
  'function vote(uint256 candidateId) external',
  'function getTotalVotes() external view returns (uint256)',
  
  // Admin
  'function owner() external view returns (address)',
  
  // Events
  'event ElectionCreated(string title, uint256 startTime, uint256 endTime)',
  'event ElectionStarted()',
  'event ElectionEnded()',
  'event CandidateAdded(uint256 candidateId, string name)',
  'event VoterAdded(address voter)',
  'event VoteCast(address voter, uint256 candidateId)',
];

// UI Constants
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
};

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  WRONG_NETWORK: 'Please switch to the correct network',
  INSUFFICIENT_FUNDS: 'Insufficient funds for transaction',
  USER_REJECTED: 'Transaction was rejected by user',
  CONTRACT_ERROR: 'Smart contract error occurred',
  NETWORK_ERROR: 'Network connection error',
  VALIDATION_ERROR: 'Please check your input and try again',
  PERMISSION_DENIED: 'You do not have permission to perform this action',
  ELECTION_NOT_ACTIVE: 'Election is not currently active',
  ALREADY_VOTED: 'You have already voted in this election',
  NOT_WHITELISTED: 'You are not authorized to vote in this election',
};

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  VOTE_CAST: 'Your vote has been recorded on the blockchain',
  ELECTION_CREATED: 'Election created successfully',
  CANDIDATE_ADDED: 'Candidate added successfully',
  VOTER_ADDED: 'Voter added to whitelist successfully',
  ELECTION_STARTED: 'Election started successfully',
  ELECTION_ENDED: 'Election ended successfully',
};

// Gas limits for different operations
export const GAS_LIMITS = {
  VOTE: 100000,
  ADD_CANDIDATE: 150000,
  ADD_VOTER: 80000,
  CREATE_ELECTION: 200000,
  START_ELECTION: 50000,
  END_ELECTION: 50000,
};

// Polling intervals (in milliseconds)
export const POLLING_INTERVALS = {
  TRANSACTION_STATUS: 2000,
  ELECTION_DATA: 10000,
  WALLET_BALANCE: 30000,
};