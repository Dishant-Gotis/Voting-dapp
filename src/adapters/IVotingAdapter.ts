/**
 * Voting Adapter Interface
 * Defines contract for casting votes and retrieving vote status
 */

export interface VoteResult {
  success: boolean
  voteId: string
  transactionHash?: string
  message: string
  timestamp: number
  proof?: {
    merkleRoot?: string
    blockNumber?: number
    certificateId?: string
    gasUsed?: string
    contractAddress?: string | null
  }
}

export interface VoteStatus {
  hasVoted: boolean
  voteTime?: number
  partyId?: string
  voteHash?: string
}

export interface IVotingAdapter {
  castVote(electionId: string, partyId: string): Promise<VoteResult>
  getVoteStatus(electionId: string): Promise<VoteStatus>
  verifyVoterEligibility(electionId: string): Promise<boolean>
  getVoteProof(electionId: string): Promise<any>
}
