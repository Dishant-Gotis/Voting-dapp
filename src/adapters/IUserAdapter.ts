/**
 * User Adapter Interface
 * Defines contract for user authentication and profile management
 */

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  aadharNumber?: string
  walletAddress?: string
  createdAt: number
}

export interface VerificationStatus {
  verified: boolean
  message: string
  details?: any
}

export interface UserSession {
  userId: string
  token: string
  expiresAt: number
  profile: UserProfile
}

export interface IUserAdapter {
  authenticate(email: string, password: string): Promise<UserSession>
  registerVoter(userData: Partial<UserProfile>): Promise<UserProfile>
  getProfile(userId: string): Promise<UserProfile>
  verifyIdentity(voterData: any): Promise<VerificationStatus>
  checkVoterRole(electionId: string): Promise<'VOTER' | 'ADMIN' | 'NONE'>
  logout(): Promise<void>
}
