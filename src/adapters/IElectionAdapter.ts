/**
 * Election Adapter Interface
 * Defines contract for election management and retrieval
 */

export interface Election {
  id: string
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'ENDED' | 'ANNOUNCED'
  startTime: number
  endTime: number
  electionType: 'GENERAL' | 'LOCAL' | 'SPECIAL'
  votingMode: 'BLOCKCHAIN' | 'DEMO'
  createdBy: string
  createdAt: number
  contractAddress?: string
}

export interface CreateElectionInput {
  title: string
  description: string
  startTime: number
  endTime: number
  electionType: 'GENERAL' | 'LOCAL' | 'SPECIAL'
}

export interface IElectionAdapter {
  createElection(input: CreateElectionInput): Promise<Election>
  getElection(electionId: string): Promise<Election>
  listElections(): Promise<Election[]>
  startElection(electionId: string): Promise<{ success: boolean }>
  endElection(electionId: string): Promise<{ success: boolean }>
  getResults(electionId: string): Promise<ElectionResults>
}

export interface ElectionResults {
  electionId: string
  status: 'ONGOING' | 'ENDED' | 'ANNOUNCED'
  results: PartyResult[]
  totalVotes: number
  announcedAt?: number
}

export interface PartyResult {
  partyId: string
  partyName: string
  voteCount: number
  percentage: number
}
