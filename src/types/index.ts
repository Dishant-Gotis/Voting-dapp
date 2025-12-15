// Core blockchain types
export interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
}

export interface WalletConnection {
  address: string;
  balance: string;
  network: Network;
  isConnected: boolean;
}

// Election types
export interface Election {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  status: ElectionStatus;
  totalVotes: number;
  contractAddress: string;
  createdBy: string;
}

export type ElectionStatus = 'upcoming' | 'active' | 'ended';

export interface Candidate {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  voteCount: number;
  electionId: string;
}

export interface Voter {
  address: string;
  isWhitelisted: boolean;
  hasVoted: boolean;
  votedFor?: string;
  voteTimestamp?: number;
  transactionHash?: string;
}

// Transaction types
export interface Transaction {
  hash: string;
  status: TransactionStatus;
  type: TransactionType;
  gasUsed?: number;
  gasPrice?: string;
  blockNumber?: number;
  timestamp?: number;
  error?: string;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type TransactionType = 'vote' | 'addCandidate' | 'addVoter' | 'createElection' | 'startElection' | 'endElection';

// UI Component types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  elevation?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  className?: string;
}

export interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Context types
export interface Web3ContextType {
  account: string | null;
  network: Network | null;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

export interface ElectionContextType {
  currentElection: Election | null;
  candidates: Candidate[];
  voters: Voter[];
  userVote: Voter | null;
  isLoading: boolean;
  error: string | null;
  loadElection: (id: string) => Promise<void>;
  vote: (candidateId: string) => Promise<string>;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'voteCount'>) => Promise<void>;
  addVoter: (address: string) => Promise<void>;
  createElection: (election: Omit<Election, 'id' | 'totalVotes' | 'status'>) => Promise<void>;
  startElection: () => Promise<void>;
  endElection: () => Promise<void>;
}

// Error types
export enum ErrorType {
  NETWORK_ERROR = 'network',
  WALLET_ERROR = 'wallet',
  CONTRACT_ERROR = 'contract',
  VALIDATION_ERROR = 'validation',
  PERMISSION_ERROR = 'permission'
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  recoverable: boolean;
  actions?: ErrorAction[];
}

export interface ErrorAction {
  label: string;
  action: () => void;
}

// Statistics types
export interface ElectionStats {
  totalElections: number;
  totalVotes: number;
  activeVoters: number;
  transparencyScore: number;
}

export interface VoteDistribution {
  candidateId: string;
  candidateName: string;
  voteCount: number;
  percentage: number;
}