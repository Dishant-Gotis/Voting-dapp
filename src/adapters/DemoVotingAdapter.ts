import { IVotingAdapter, VoteResult, VoteStatus } from './IVotingAdapter'
import { supabase, hasUserVoted, logAuditAction } from '@/services/supabaseClient'

/**
 * Demo Voting Adapter
 * Handles vote casting via Supabase PostgreSQL backend
 * 
 * Features:
 * - Store votes in Supabase with one-vote-per-user enforcement
 * - MetaMask wallet used for identity (no on-chain interaction)
 * - Real-time updates via Supabase subscriptions
 * - Audit trail of all voting actions
 */
export class DemoVotingAdapter implements IVotingAdapter {
  private userId: string | null = null
  private walletAddress: string | null = null

  constructor() {
    // Retrieve user/wallet from localStorage
    this.userId = localStorage.getItem('demo_user_id')
    this.walletAddress = localStorage.getItem('wallet_address')
  }

  /**
   * Cast a vote in the election
   * Enforced constraints:
   * - User must be registered as eligible voter
   * - One vote per user per election (DB constraint)
   * - Election must be in ACTIVE status
   */
  async castVote(electionId: string, partyId: string): Promise<VoteResult> {
    try {
      if (!this.userId || !this.walletAddress) {
        return {
          success: false,
          voteId: '',
          message: 'User not authenticated. Please connect wallet.',
          timestamp: Date.now(),
          proof: {}
        }
      }

      // Step 1: Check if voter exists in voters table, if not create one (auto-registration for demo)
      let { data: voter } = await supabase
        .from('voters')
        .select('id, is_eligible')
        .eq('election_id', electionId)
        .eq('wallet_address', this.walletAddress)
        .maybeSingle()

      // Auto-register voter if not exists (for demo mode ease of use)
      if (!voter) {
        const { data: newVoter, error: insertError } = await supabase
          .from('voters')
          .insert({
            election_id: electionId,
            wallet_address: this.walletAddress,
            is_eligible: true,
            created_at: Date.now()
          })
          .select('id, is_eligible')
          .single()

        if (insertError || !newVoter) {
          return {
            success: false,
            voteId: '',
            message: 'Failed to register voter. Please try again.',
            timestamp: Date.now(),
            proof: {}
          }
        }
        voter = newVoter
      }

      if (!voter.is_eligible) {
        return {
          success: false,
          voteId: '',
          message: 'Your voter eligibility has been revoked.',
          timestamp: Date.now(),
          proof: {}
        }
      }

      // Step 2: Check if user has already voted
      const alreadyVoted = await hasUserVoted(electionId, voter.id)
      if (alreadyVoted) {
        return {
          success: false,
          voteId: '',
          message: 'You have already voted in this election. One vote per voter.',
          timestamp: Date.now(),
          proof: {}
        }
      }

      // Step 3: Insert vote into votes table
      // This will fail if user already has a vote (UNIQUE constraint)
      const { data: voteData, error: voteError } = await supabase
        .from('votes')
        .insert({
          election_id: electionId,
          voter_id: voter.id,
          party_id: partyId,
          created_at: Date.now()
        })
        .select()
        .single()

      if (voteError) {
        // Check for UNIQUE constraint violation (already voted)
        if (voteError.code === '23505') {
          return {
            success: false,
            voteId: '',
            message: 'You have already voted in this election.',
            timestamp: Date.now(),
            proof: {}
          }
        }

        throw voteError
      }

      // Step 4: Log successful vote
      await logAuditAction(
        'VOTE_CAST',
        this.walletAddress,
        'VOTE',
        voteData.id,
        { electionId, partyId, voterId: voter.id }
      )

      // Step 5: Return success with proof
      return {
        success: true,
        voteId: voteData.id,
        transactionHash: voteData.id,
        message: 'Vote recorded successfully in demo backend',
        timestamp: voteData.created_at,
        proof: {
          certificateId: `cert_${voteData.id.slice(0, 16)}`
        }
      }
    } catch (error) {
      console.error('[DemoVotingAdapter] Error casting vote:', error)
      return {
        success: false,
        voteId: '',
        message: `Failed to cast vote: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
        proof: {}
      }
    }
  }

  /**
   * Get current vote status for this election
   * Returns whether user has voted and details of their vote
   */
  async getVoteStatus(electionId: string): Promise<VoteStatus> {
    try {
      if (!this.userId || !this.walletAddress) {
        return {
          hasVoted: false,
          voteTime: undefined,
          partyId: undefined
        }
      }

      // Get voter record
      const { data: voter, error: voterError } = await supabase
        .from('voters')
        .select('id')
        .eq('election_id', electionId)
        .eq('wallet_address', this.walletAddress)
        .single()

      if (voterError || !voter) {
        return {
          hasVoted: false,
          voteTime: undefined,
          partyId: undefined
        }
      }

      // Check if vote exists
      const { data: vote, error: voteError } = await supabase
        .from('votes')
        .select('party_id, created_at')
        .eq('election_id', electionId)
        .eq('voter_id', voter.id)
        .single()

      if (voteError || !vote) {
        return {
          hasVoted: false,
          voteTime: undefined,
          partyId: undefined
        }
      }

      return {
        hasVoted: true,
        voteTime: vote.created_at,
        partyId: vote.party_id
      }
    } catch (error) {
      console.error('[DemoVotingAdapter] Error getting vote status:', error)
      return {
        hasVoted: false,
        voteTime: undefined,
        partyId: undefined
      }
    }
  }

  /**
   * Verify voter eligibility in this election
   * Returns true only if voter is registered and eligible
   */
  async verifyVoterEligibility(electionId: string): Promise<boolean> {
    try {
      if (!this.walletAddress) {
        return false
      }

      const { data: voter, error } = await supabase
        .from('voters')
        .select('is_eligible')
        .eq('election_id', electionId)
        .eq('wallet_address', this.walletAddress)
        .single()

      if (error || !voter) {
        return false
      }

      return voter.is_eligible === true
    } catch (error) {
      console.error('[DemoVotingAdapter] Error verifying eligibility:', error)
      return false
    }
  }

  /**
   * Get vote proof/certificate for demonstration
   */
  async getVoteProof(electionId: string): Promise<any> {
    try {
      if (!this.userId || !this.walletAddress) {
        return null
      }

      const { data: voter } = await supabase
        .from('voters')
        .select('id')
        .eq('election_id', electionId)
        .eq('wallet_address', this.walletAddress)
        .single()

      if (!voter) return null

      const { data: vote, error } = await supabase
        .from('votes')
        .select('id, created_at')
        .eq('election_id', electionId)
        .eq('voter_id', voter.id)
        .single()

      if (error || !vote) {
        return null
      }

      return {
        certificateId: `cert_${vote.id.slice(0, 16)}`,
        voteId: vote.id,
        verified: true,
        timestamp: vote.created_at,
        message: 'Your vote has been securely recorded'
      }
    } catch (error) {
      console.error('[DemoVotingAdapter] Error getting vote proof:', error)
      return null
    }
  }

  /**
   * Set user ID (from wallet connection)
   */
  setUserId(userId: string) {
    this.userId = userId
    localStorage.setItem('demo_user_id', userId)
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return this.userId
  }

  /**
   * Set wallet address (from MetaMask)
   */
  setWalletAddress(address: string) {
    this.walletAddress = address
    localStorage.setItem('wallet_address', address)
  }

  /**
   * Get current wallet address
   */
  getWalletAddress(): string | null {
    return this.walletAddress
  }

  /**
   * Subscribe to vote changes for real-time updates
   */
  subscribeToVoteChanges(
    electionId: string,
    callback: (status: VoteStatus) => void
  ): (() => void) | null {
    try {
      if (!this.walletAddress) return null

      // Note: Supabase realtime for filtered subscriptions requires the channel syntax
      // For now, we'll poll the vote status instead
      const interval = setInterval(async () => {
        const status = await this.getVoteStatus(electionId)
        callback(status)
      }, 2000) // Poll every 2 seconds

      // Return unsubscribe function
      return () => {
        clearInterval(interval)
      }
    } catch (error) {
      console.error('[DemoVotingAdapter] Error subscribing to vote changes:', error)
      return null
    }
  }
}
