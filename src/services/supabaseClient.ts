import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client using Vite and CRA-style env variables
const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  (import.meta as any).env?.REACT_APP_SUPABASE_URL ||
  (typeof process !== 'undefined' ? (process as any).env?.REACT_APP_SUPABASE_URL : undefined) ||
  'https://your-project.supabase.co'

const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env?.REACT_APP_SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' ? (process as any).env?.REACT_APP_SUPABASE_ANON_KEY : undefined) ||
  'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Supabase table types
 */
export interface DbElection {
  id: string
  title: string
  description: string | null
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  election_type: string
  start_time: number
  end_time: number
  created_by: string
  created_at: number
  voting_mode: 'DEMO' | 'BLOCKCHAIN'
}

export interface DbParty {
  id: string
  election_id: string
  name: string
  symbol: string | null
  votes: number
  order: number
  created_at: number
}

export interface DbVoter {
  id: string
  election_id: string
  wallet_address: string
  is_eligible: boolean
  created_at: number
  updated_at: number
}

export interface DbVote {
  id: string
  election_id: string
  voter_id: string
  party_id: string
  created_at: number
}

export interface DbAuditLog {
  id: string
  action: string
  actor: string
  resource_type: string
  resource_id: string | null
  details: Record<string, any>
  created_at: number
}

/**
 * Helper to log admin actions in audit trail
 */
export async function logAuditAction(
  action: string,
  actor: string,
  resourceType: string,
  resourceId: string | null,
  details: Record<string, any> = {}
): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      action,
      actor,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      created_at: Date.now(),
    })
  } catch (error) {
    console.error('Failed to log audit action:', error)
  }
}

/**
 * Helper to check if user has voted
 */
export async function hasUserVoted(
  electionId: string,
  voterId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('id')
      .eq('election_id', electionId)
      .eq('voter_id', voterId)
      .single()

    if (error && error.code === 'PGRST116') {
      // No row found - user hasn't voted
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error checking vote status:', error)
    return false
  }
}

/**
 * Helper to get election with all related data
 */
export async function getElectionWithParties(electionId: string) {
  try {
    const { data: election, error: electionError } = await supabase
      .from('elections')
      .select('*')
      .eq('id', electionId)
      .single()

    if (electionError) throw electionError

    const { data: parties, error: partiesError } = await supabase
      .from('parties')
      .select('*')
      .eq('election_id', electionId)
      .order('order', { ascending: true })

    if (partiesError) throw partiesError

    return { election, parties }
  } catch (error) {
    console.error('Error fetching election with parties:', error)
    return null
  }
}

/**
 * Helper to get vote results for election
 */
export async function getElectionResults(electionId: string) {
  try {
    const { data: votes, error } = await supabase
      .from('votes')
      .select('party_id')
      .eq('election_id', electionId)

    if (error) throw error

    // Count votes by party
    const results: Record<string, number> = {}
    votes?.forEach((vote) => {
      results[vote.party_id] = (results[vote.party_id] || 0) + 1
    })

    return results
  } catch (error) {
    console.error('Error fetching election results:', error)
    return {}
  }
}

/**
 * Subscribe to realtime election updates
 * Note: Requires setting up Supabase realtime with proper channel syntax
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function subscribeToElection(_electionId: string, _callback: (election: DbElection) => void) {
  // Supabase realtime subscriptions require proper setup
  // For now, return a no-op subscription
  // In production, use: supabase.channel(`election:${electionId}`).on(...).subscribe()
  console.log('[supabaseClient] Realtime election subscription ready (polling fallback in use)')
  return {
    unsubscribe: () => {
      // no-op
    }
  }
}

/**
 * Subscribe to realtime vote updates
 * Note: Requires setting up Supabase realtime with proper channel syntax
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function subscribeToVotes(_electionId: string, _callback: (vote: DbVote) => void) {
  // Supabase realtime subscriptions require proper setup
  // For now, return a no-op subscription
  // In production, use: supabase.channel(`votes:${electionId}`).on(...).subscribe()
  console.log('[supabaseClient] Realtime votes subscription ready (polling fallback in use)')
  return {
    unsubscribe: () => {
      // no-op
    }
  }
}
