import { IVotingAdapter } from './IVotingAdapter'
import { IElectionAdapter } from './IElectionAdapter'
import { IAdminAdapter } from './IAdminAdapter'
import { BlockchainVotingAdapter } from './BlockchainVotingAdapter'
import { DemoVotingAdapter } from './DemoVotingAdapter'
import { BlockchainElectionAdapter } from './BlockchainElectionAdapter'
import { DemoElectionAdapter } from './DemoElectionAdapter'
import { BlockchainAdminAdapter } from './BlockchainAdminAdapter'
import { DemoAdminAdapter } from './DemoAdminAdapter'

export type VotingMode = 'BLOCKCHAIN' | 'DEMO'

/**
 * Adapter Factory
 * Routes calls to appropriate adapter based on voting mode
 */
class AdapterFactory {
  private votingMode: VotingMode = 'BLOCKCHAIN'
  private blockchainVotingAdapter: BlockchainVotingAdapter
  private demoVotingAdapter: DemoVotingAdapter
  private blockchainElectionAdapter: BlockchainElectionAdapter
  private demoElectionAdapter: DemoElectionAdapter
  private blockchainAdminAdapter: BlockchainAdminAdapter
  private demoAdminAdapter: DemoAdminAdapter

  constructor() {
    this.blockchainVotingAdapter = new BlockchainVotingAdapter()
    this.demoVotingAdapter = new DemoVotingAdapter()
    this.blockchainElectionAdapter = new BlockchainElectionAdapter()
    this.demoElectionAdapter = new DemoElectionAdapter()
    this.blockchainAdminAdapter = new BlockchainAdminAdapter()
    this.demoAdminAdapter = new DemoAdminAdapter()
  }

  /**
   * Set the current voting mode
   */
  setVotingMode(mode: VotingMode): void {
    this.votingMode = mode
    console.log(`[AdapterFactory] Voting mode switched to: ${mode}`)
  }

  /**
   * Get the current voting mode
   */
  getVotingMode(): VotingMode {
    return this.votingMode
  }

  /**
   * Get the appropriate voting adapter
   */
  getVotingAdapter(): IVotingAdapter {
    if (this.votingMode === 'BLOCKCHAIN') {
      return this.blockchainVotingAdapter
    } else {
      return this.demoVotingAdapter
    }
  }

  /**
   * Get the appropriate election adapter
   */
  getElectionAdapter(): IElectionAdapter {
    if (this.votingMode === 'BLOCKCHAIN') {
      return this.blockchainElectionAdapter
    } else {
      return this.demoElectionAdapter
    }
  }

  /**
   * Get the appropriate admin adapter
   */
  getAdminAdapter(): IAdminAdapter {
    if (this.votingMode === 'BLOCKCHAIN') {
      return this.blockchainAdminAdapter
    } else {
      return this.demoAdminAdapter
    }
  }

  /**
   * Get blockchain-specific voting adapter
   */
  getBlockchainVotingAdapter(): BlockchainVotingAdapter {
    return this.blockchainVotingAdapter
  }

  /**
   * Get demo-specific voting adapter
   */
  getDemoVotingAdapter(): DemoVotingAdapter {
    return this.demoVotingAdapter
  }

  /**
   * Get blockchain-specific admin adapter
   */
  getBlockchainAdminAdapter(): BlockchainAdminAdapter {
    return this.blockchainAdminAdapter
  }

  /**
   * Get demo-specific admin adapter
   */
  getDemoAdminAdapter(): DemoAdminAdapter {
    return this.demoAdminAdapter
  }
}

// Singleton instance
export const adapterFactory = new AdapterFactory()
