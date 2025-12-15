import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Web3 provider for testing
Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: {
    isMetaMask: true,
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
  },
})

// Mock environment variables
process.env.NEXT_PUBLIC_CHAIN_ID = '1337'
process.env.NEXT_PUBLIC_RPC_URL = 'http://localhost:8545'
process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'
process.env.NEXT_PUBLIC_NETWORK_NAME = 'Localhost'
process.env.NEXT_PUBLIC_EXPLORER_URL = 'https://etherscan.io'