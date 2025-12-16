/**
 * Admin Adapter Interface
 * Defines contract for election administration
 */

export interface Party {
  id: string
  electionId: string
  name: string
  symbolUrl?: string
  description?: string
  voteCount?: number
}

export interface AuditLogEntry {
  id: string
  electionId: string
  action: string
  actorId: string
  actorType: 'ADMIN' | 'SYSTEM'
  details: any
  timestamp: number
  ipAddress?: string
}

export interface AdminActionResult {
  success: boolean
  message: string
  data?: any
}

export interface IAdminAdapter {
  createElection(data: any): Promise<AdminActionResult>
  addParties(electionId: string, parties: Partial<Party>[]): Promise<AdminActionResult>
  addVoters(electionId: string, voters: any[]): Promise<AdminActionResult>
  removeVoters(electionId: string, voterIds: string[]): Promise<AdminActionResult>
  startElection(electionId: string): Promise<AdminActionResult>
  endElection(electionId: string): Promise<AdminActionResult>
  announceResults(electionId: string): Promise<AdminActionResult>
  getAuditLogs(electionId: string): Promise<AuditLogEntry[]>
  getBroadcastChannel(): BroadcastChannel | null
}
