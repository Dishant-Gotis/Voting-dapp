import { IElectionAdapter, Election, CreateElectionInput, ElectionResults } from './IElectionAdapter'
import { supabase, subscribeToElection } from '@/services/supabaseClient'

/**
 * Demo Election Adapter
 * Handles election management via Supabase PostgreSQL backend
 * 
 * Features:
 * - Fetch elections from Supabase database
 * - Real-time election status updates
 * - Live vote tallying
 * - Election lifecycle management (DRAFT → ACTIVE → COMPLETED → ARCHIVED)
 */
export class DemoElectionAdapter implements IElectionAdapter {
  /**
   * Create a new election (admin only)
   */
  async createElection(input: CreateElectionInput): Promise<Election> {
    try {
      const { title, description, startTime, endTime, electionType } = input

      const { data: election, error } = await supabase
        .from('elections')
        .insert({
          title,
          description: description || null,
          status: 'DRAFT',
          election_type: electionType,
          start_time: startTime,
          end_time: endTime,
          created_by: 'admin',
          created_at: Date.now(),
          voting_mode: 'DEMO'
        })
        .select()
        .single()

      if (error) throw error

      return this.mapDbElectionToElection(election)
    } catch (error) {
      console.error('[DemoElectionAdapter] Error creating election:', error)
      throw error
    }
  }

  /**
   * Fetch a single election by ID
   */
  async getElection(electionId: string): Promise<Election> {
    try {
      const { data: election, error } = await supabase
        .from('elections')
        .select('*')
        .eq('id', electionId)
        .single()

      if (error) throw error

      return this.mapDbElectionToElection(election)
    } catch (error) {
      console.error('[DemoElectionAdapter] Error getting election:', error)
      throw error
    }
  }

  /**
   * List all elections
   */
  async listElections(): Promise<Election[]> {
    try {
      const { data: elections, error } = await supabase
        .from('elections')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return elections ? elections.map((e) => this.mapDbElectionToElection(e)) : []
    } catch (error) {
      console.error('[DemoElectionAdapter] Error listing elections:', error)
      return []
    }
  }

  /**
   * Start an election (DRAFT → ACTIVE)
   */
  async startElection(electionId: string): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase
        .from('elections')
        .update({
          status: 'ACTIVE',
          updated_at: Date.now()
        })
        .eq('id', electionId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('[DemoElectionAdapter] Error starting election:', error)
      return { success: false }
    }
  }

  /**
   * End an election (ACTIVE → COMPLETED)
   */
  async endElection(electionId: string): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase
        .from('elections')
        .update({
          status: 'COMPLETED',
          updated_at: Date.now()
        })
        .eq('id', electionId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('[DemoElectionAdapter] Error ending election:', error)
      return { success: false }
    }
  }

  /**
   * Get election results with vote tallies
   */
  async getResults(electionId: string): Promise<ElectionResults> {
    try {
      const { data: election } = await supabase
        .from('elections')
        .select('*')
        .eq('id', electionId)
        .single()

      if (!election) {
        return {
          electionId,
          status: 'ONGOING',
          results: [],
          totalVotes: 0
        }
      }

      // Get all parties with vote counts
      const { data: parties } = await supabase
        .from('parties')
        .select('id, name, votes')
        .eq('election_id', electionId)
        .order('votes', { ascending: false })

      // Get total vote count
      const { count: totalVotes } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('election_id', electionId)

      const results = (parties || []).map((party) => ({
        partyId: party.id,
        partyName: party.name,
        voteCount: party.votes || 0,
        percentage: totalVotes ? Math.round((party.votes / totalVotes) * 100) : 0
      }))

      return {
        electionId,
        status: election.status,
        results,
        totalVotes: totalVotes || 0
      }
    } catch (error) {
      console.error('[DemoElectionAdapter] Error getting results:', error)
      return {
        electionId,
        status: 'ONGOING',
        results: [],
        totalVotes: 0
      }
    }
  }

  /**
   * Subscribe to election updates in real-time
   */
  subscribeToElection(
    electionId: string,
    callback: (election: Election) => void
  ): (() => void) | null {
    try {
      const subscription = subscribeToElection(electionId, (dbElection) => {
        callback(this.mapDbElectionToElection(dbElection))
      })

      return subscription?.unsubscribe ?? null
    } catch (error) {
      console.error('[DemoElectionAdapter] Error subscribing to election:', error)
      return null
    }
  }

  /**
   * Map database election object to UI model
   */
  private mapDbElectionToElection(dbElection: any): Election {
    return {
      id: dbElection.id,
      title: dbElection.title,
      description: dbElection.description,
      status: dbElection.status,
      startTime: dbElection.start_time,
      endTime: dbElection.end_time,
      electionType: dbElection.election_type,
      votingMode: dbElection.voting_mode || 'DEMO',
      createdBy: dbElection.created_by,
      createdAt: dbElection.created_at
    }
  }
}
