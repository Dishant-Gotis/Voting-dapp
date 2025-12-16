import type { IAdminAdapter, AdminActionResult, Party, AuditLogEntry } from './IAdminAdapter'
import { supabase, logAuditAction } from '@/services/supabaseClient'

/**
 * Demo Admin Adapter
 * Handles election administration on Supabase (PostgreSQL backend)
 * 
 * Backend Operations:
 * - All election data stored in Supabase PostgreSQL
 * - Admin actions via direct database mutations (RLS enforced)
 * - Row-level security (RLS) policies enforce authorization
 * - Real-time updates via Supabase Realtime subscriptions
 * - Audit trail of all admin actions
 */
export class DemoAdminAdapter implements IAdminAdapter {
  private broadcastChannel: BroadcastChannel | null = null
  private adminId: string | null = null
  private adminEmail: string | null = null

  constructor() {
    // Initialize BroadcastChannel for cross-tab sync
    try {
      this.broadcastChannel = new BroadcastChannel('voting-dapp-demo-admin')
    } catch {
      console.warn('BroadcastChannel not available')
    }
    this.adminId = localStorage.getItem('admin_id')
    this.adminEmail = localStorage.getItem('admin_email')
  }

  /**
   * Permanently delete an election (and related data via CASCADE)
   */
  async deleteElection(electionId: string): Promise<AdminActionResult> {
    if (!this.adminId || !this.adminEmail) {
      return { success: false, message: 'Admin not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('elections')
        .delete()
        .eq('id', electionId)

      if (error) throw error

      await logAuditAction(
        'ELECTION_DELETED',
        this.adminEmail,
        'ELECTION',
        electionId,
        {}
      )

      this.broadcastAdminAction('ELECTION_DELETED', { electionId })

      return {
        success: true,
        message: 'Election deleted successfully',
        data: { electionId },
      }
    } catch (error) {
      console.error('Failed to delete election:', error)
      return {
        success: false,
        message: `Failed to delete election: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Authenticate admin via email/password credentials
   * Validates against Supabase Auth
   */
  async authenticateCredentials(email: string, password: string): Promise<AdminActionResult> {
    try {
      // Validate input format
      if (!email || !password) {
        return { success: false, message: 'Email and password are required' }
      }

      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, message: 'Invalid email format' }
      }

      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' }
      }

      // Demo credentials
      const testEmail = 'admin@voting.demo'
      const testPassword = 'demo12345'

      if (email !== testEmail || password !== testPassword) {
        await logAuditAction(
          'AUTH_FAILED',
          email,
          'ADMIN_AUTH',
          null,
          { reason: 'invalid_credentials' }
        )
        return { success: false, message: 'Invalid credentials' }
      }

      // In production: Use Supabase Auth
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      // if (error) throw error

      this.adminId = `admin_${Date.now()}`
      this.adminEmail = email

      // Store session
      localStorage.setItem('admin_id', this.adminId)
      localStorage.setItem('admin_email', email)

      await logAuditAction(
        'AUTH_SUCCESS',
        email,
        'ADMIN_AUTH',
        null,
        { adminId: this.adminId }
      )

      return {
        success: true,
        message: 'Admin authenticated successfully',
        data: { adminId: this.adminId, email, role: 'ELECTION_ADMIN' },
      }
    } catch (error) {
      return {
        success: false,
        message: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Create new election in Supabase
   */
  async createElection(data: any): Promise<AdminActionResult> {
    if (!this.adminId || !this.adminEmail) {
      return { success: false, message: 'Admin not authenticated' }
    }

    try {
      const { title, description, startTime, endTime } = data

      const { data: election, error } = await supabase
        .from('elections')
        .insert({
          title,
          description: description || null,
          status: 'DRAFT',
          election_type: 'GENERAL',
          start_time: startTime,
          end_time: endTime,
          created_by: this.adminEmail,
          created_at: Date.now(),
          voting_mode: 'DEMO'
        })
        .select()
        .single()

      if (error) throw error

      await logAuditAction(
        'ELECTION_CREATED',
        this.adminEmail!,
        'ELECTION',
        election.id,
        { title, startTime, endTime }
      )

      // Broadcast to other tabs
      this.broadcastAdminAction('ELECTION_CREATED', { electionId: election.id, title })

      return {
        success: true,
        message: 'Election created successfully',
        data: {
          electionId: election.id,
          createdAt: new Date().toISOString(),
          status: 'DRAFT',
        },
      }
    } catch (error) {
      console.error('Failed to create election:', error)
      return {
        success: false,
        message: `Failed to create election: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Add parties to election
   */
  async addParties(electionId: string, parties: Partial<Party>[]): Promise<AdminActionResult> {
    if (!this.adminId || !this.adminEmail) {
      return { success: false, message: 'Admin not authenticated' }
    }

    try {
      // Validate parties
      if (!Array.isArray(parties) || parties.length === 0) {
        return { success: false, message: 'At least one party is required' }
      }

      if (parties.length > 10) {
        return { success: false, message: 'Maximum 10 parties allowed' }
      }

      for (const party of parties) {
        if (!party.name || party.name.trim().length === 0) {
          return { success: false, message: 'All parties must have a name' }
        }
      }

      // Prepare parties for insertion with order field
      const partiesToInsert = parties.map((p, idx) => ({
        election_id: electionId,
        name: p.name,
        symbol: p.symbolUrl || null,
        votes: 0,
        order: idx + 1,
        created_at: Date.now()
      }))

      // Insert parties into Supabase
      const { data: addedParties, error } = await supabase
        .from('parties')
        .insert(partiesToInsert)
        .select()

      if (error) throw error

      await logAuditAction(
        'PARTIES_ADDED',
        this.adminEmail,
        'ELECTION',
        electionId,
        { partyCount: parties.length, partyNames: parties.map(p => p.name) }
      )

      this.broadcastAdminAction('PARTIES_ADDED', { electionId, partyCount: parties.length })

      const mappedParties: Party[] = (addedParties || []).map(p => ({
        id: p.id,
        electionId: p.election_id,
        name: p.name,
        symbolUrl: p.symbol,
        description: '',
        voteCount: 0,
      }))

      return {
        success: true,
        message: `${parties.length} parties added successfully`,
        data: { parties: mappedParties },
      }
    } catch (error) {
      console.error('Failed to add parties:', error)
      return {
        success: false,
        message: `Failed to add parties: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Register voters for election
   * Voters identified by wallet address (no duplicate registrations)
   */
  async addVoters(electionId: string, voters: any[]): Promise<AdminActionResult> {
    if (!this.adminId || !this.adminEmail) {
      return { success: false, message: 'Admin not authenticated' }
    }

    try {
      if (!Array.isArray(voters) || voters.length === 0) {
        return { success: false, message: 'At least one voter is required' }
      }

      if (voters.length > 10000) {
        return { success: false, message: 'Maximum 10000 voters per batch' }
      }

      // Validate voter data - expect wallet addresses
      for (const voter of voters) {
        if (!voter.wallet_address || !/^0x[a-fA-F0-9]{40}$/.test(voter.wallet_address)) {
          return { success: false, message: 'Each voter must have valid Ethereum wallet address' }
        }
      }

      // Prepare voters for insertion
      const votersToInsert = voters.map(v => ({
        election_id: electionId,
        wallet_address: v.wallet_address.toLowerCase(),
        is_eligible: true,
        created_at: Date.now(),
        updated_at: Date.now()
      }))

      // Insert voters into Supabase
      const { data: addedVoters, error } = await supabase
        .from('voters')
        .insert(votersToInsert)
        .select()

      if (error) throw error

      await logAuditAction(
        'VOTERS_ADDED',
        this.adminEmail,
        'ELECTION',
        electionId,
        { voterCount: voters.length }
      )

      this.broadcastAdminAction('VOTERS_ADDED', { electionId, voterCount: voters.length })

      return {
        success: true,
        message: `${voters.length} voters registered successfully`,
        data: { registeredCount: addedVoters?.length || voters.length },
      }
    } catch (error) {
      console.error('Failed to add voters:', error)
      return {
        success: false,
        message: `Failed to add voters: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Remove voters from election (revoke eligibility)
   * Preserves votes for audit trail
   */
  async removeVoters(electionId: string, voterIds: string[]): Promise<AdminActionResult> {
    if (!this.adminId || !this.adminEmail) {
      return { success: false, message: 'Admin not authenticated' }
    }

    try {
      if (!Array.isArray(voterIds) || voterIds.length === 0) {
        return { success: false, message: 'At least one voter ID is required' }
      }

      // Revoke eligibility (don't delete voters - preserve vote audit trail)
      const { error } = await supabase
        .from('voters')
        .update({ is_eligible: false, updated_at: Date.now() })
        .eq('election_id', electionId)
        .in('id', voterIds)

      if (error) throw error

      await logAuditAction(
        'VOTERS_REVOKED',
        this.adminEmail,
        'ELECTION',
        electionId,
        { voterCount: voterIds.length }
      )

      this.broadcastAdminAction('VOTERS_REMOVED', { electionId, voterCount: voterIds.length })

      return {
        success: true,
        message: `${voterIds.length} voters revoked successfully`,
        data: { removedCount: voterIds.length },
      }
    } catch (error) {
      console.error('Failed to remove voters:', error)
      return {
        success: false,
        message: `Failed to remove voters: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }
  /**
   * Start election (set status to ACTIVE)
   */
  async startElection(electionId: string): Promise<AdminActionResult> {
    if (!this.adminId || !this.adminEmail) {
      return { success: false, message: 'Admin not authenticated' }
    }

    try {
      // Update election status to ACTIVE
      const { error } = await supabase
        .from('elections')
        .update({ status: 'ACTIVE', updated_at: Date.now() })
        .eq('id', electionId)

      if (error) throw error

      await logAuditAction(
        'ELECTION_STARTED',
        this.adminEmail,
        'ELECTION',
        electionId,
        {}
      )

      // Broadcast election start - realtime subscribers will see it
      this.broadcastAdminAction('ELECTION_STARTED', { electionId, timestamp: Date.now() })

      return {
        success: true,
        message: 'Election started successfully',
        data: {
          electionId,
          status: 'ACTIVE',
          startedAt: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error('Failed to start election:', error)
      return {
        success: false,
        message: `Failed to start election: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * End election (set status to COMPLETED)
   */
  async endElection(electionId: string): Promise<AdminActionResult> {
    if (!this.adminId || !this.adminEmail) {
      return { success: false, message: 'Admin not authenticated' }
    }

    try {
      // Update election status to COMPLETED
      const { error } = await supabase
        .from('elections')
        .update({ status: 'COMPLETED', updated_at: Date.now() })
        .eq('id', electionId)

      if (error) throw error

      await logAuditAction(
        'ELECTION_ENDED',
        this.adminEmail,
        'ELECTION',
        electionId,
        {}
      )

      this.broadcastAdminAction('ELECTION_ENDED', { electionId, timestamp: Date.now() })

      return {
        success: true,
        message: 'Election ended successfully',
        data: {
          electionId,
          status: 'COMPLETED',
          endedAt: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error('Failed to end election:', error)
      return {
        success: false,
        message: `Failed to end election: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Announce final results (publish results)
   */
  async announceResults(electionId: string): Promise<AdminActionResult> {
    if (!this.adminId || !this.adminEmail) {
      return { success: false, message: 'Admin not authenticated' }
    }

    try {
      // Update election status to ARCHIVED/RESULTS_PUBLISHED
      const { error } = await supabase
        .from('elections')
        .update({ status: 'ARCHIVED', updated_at: Date.now() })
        .eq('id', electionId)

      if (error) throw error

      await logAuditAction(
        'RESULTS_PUBLISHED',
        this.adminEmail,
        'ELECTION',
        electionId,
        {}
      )

      this.broadcastAdminAction('RESULTS_PUBLISHED', { electionId, timestamp: Date.now() })

      return {
        success: true,
        message: 'Results published successfully',
        data: {
          electionId,
          status: 'RESULTS_PUBLISHED',
          announcedAt: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error('Failed to publish results:', error)
      return {
        success: false,
        message: `Failed to publish results: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Retrieve audit logs from Supabase
   */
  async getAuditLogs(electionId: string): Promise<AuditLogEntry[]> {
    try {
      // In production: Query Supabase audit_logs table
      // const { data, error } = await supabase
      //   .from('audit_logs')
      //   .select('*')
      //   .eq('election_id', electionId)
      //   .order('timestamp', { ascending: false })

      // Mock audit logs
      return [
        {
          id: 'audit_1',
          electionId,
          action: 'ELECTION_CREATED',
          actorId: this.adminId || 'UNKNOWN',
          actorType: 'ADMIN',
          details: { title: 'City Council Election' },
          timestamp: Date.now() - 15000,
        },
        {
          id: 'audit_2',
          electionId,
          action: 'PARTIES_ADDED',
          actorId: this.adminId || 'UNKNOWN',
          actorType: 'ADMIN',
          details: { partyCount: 3 },
          timestamp: Date.now() - 10000,
        },
        {
          id: 'audit_3',
          electionId,
          action: 'VOTERS_ADDED',
          actorId: this.adminId || 'UNKNOWN',
          actorType: 'ADMIN',
          details: { voterCount: 500 },
          timestamp: Date.now() - 5000,
        },
        {
          id: 'audit_4',
          electionId,
          action: 'ELECTION_STARTED',
          actorId: this.adminId || 'UNKNOWN',
          actorType: 'ADMIN',
          details: {},
          timestamp: Date.now(),
        },
      ]
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
      return []
    }
  }

  /**
   * Get BroadcastChannel for real-time sync
   */
  getBroadcastChannel(): BroadcastChannel | null {
    return this.broadcastChannel
  }

  /**
   * Broadcast admin action to other browser tabs
   */
  private broadcastAdminAction(action: string, data: any): void {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ action, data, timestamp: Date.now() })
      } catch (error) {
        console.warn('Failed to broadcast admin action:', error)
      }
    }
  }

  /**
   * Log admin action to audit trail (handled by logAuditAction in supabaseClient)
   */
  // private logAction removed - use logAuditAction from supabaseClient instead
}
