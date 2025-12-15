import { describe, it, expect } from 'vitest';
import { APP_CONFIG, NETWORKS, VOTING_CONTRACT_ABI } from '@/lib/config';
import { isValidAddress } from '@/utils';

/**
 * **Feature: blockchain-voting-frontend, Property 22: Configuration Validation**
 * **Validates: Requirements 6.5**
 * 
 * Property: For any application startup, contract addresses and network configuration should be validated
 */
describe('Configuration Validation Properties', () => {
  it('should validate that all network configurations have required properties', () => {
    Object.values(NETWORKS).forEach(network => {
      expect(network.chainId).toBeTypeOf('number');
      expect(network.chainId).toBeGreaterThan(0);
      expect(network.name).toBeTypeOf('string');
      expect(network.name.length).toBeGreaterThan(0);
      expect(network.rpcUrl).toBeTypeOf('string');
      expect(network.rpcUrl.length).toBeGreaterThan(0);
      expect(network.explorerUrl).toBeTypeOf('string');
      expect(network.explorerUrl.length).toBeGreaterThan(0);
    });
  });

  it('should validate APP_CONFIG has consistent values', () => {
    expect(APP_CONFIG.name).toBeTypeOf('string');
    expect(APP_CONFIG.name.length).toBeGreaterThan(0);
    expect(APP_CONFIG.chainId).toBeTypeOf('number');
    expect(APP_CONFIG.chainId).toBeGreaterThan(0);
    expect(APP_CONFIG.contractAddress).toBeTypeOf('string');
    expect(APP_CONFIG.contractAddress.length).toBe(42);
    expect(isValidAddress(APP_CONFIG.contractAddress)).toBe(true);
  });

  it('should validate contract ABI contains required functions', () => {
    const requiredFunctions = ['createElection', 'vote', 'addCandidate', 'addVoter'];
    expect(Array.isArray(VOTING_CONTRACT_ABI)).toBe(true);
    expect(VOTING_CONTRACT_ABI.length).toBeGreaterThan(0);
    
    const abiString = VOTING_CONTRACT_ABI.join(' ');
    requiredFunctions.forEach(funcName => {
      expect(abiString).toContain(funcName);
    });
  });

  it('should validate address format consistency', () => {
    // Test with known valid addresses
    const validAddresses = [
      '0x0000000000000000000000000000000000000000',
      '0x1234567890123456789012345678901234567890',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
    ];
    
    validAddresses.forEach(address => {
      expect(isValidAddress(address)).toBe(true);
    });
    
    // Test with invalid addresses
    const invalidAddresses = [
      '0x123', // too short
      '1234567890123456789012345678901234567890', // missing 0x
      '0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', // invalid hex
    ];
    
    invalidAddresses.forEach(address => {
      expect(isValidAddress(address)).toBe(false);
    });
  });
});