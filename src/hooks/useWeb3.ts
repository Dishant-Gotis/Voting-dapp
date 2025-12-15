import { useContext } from 'react';
import { Web3ContextType } from '@/types';
import { useWeb3 as useWeb3Context } from '@/contexts/Web3Context';

/**
 * Hook to access Web3 functionality
 */
export function useWeb3(): Web3ContextType {
  return useWeb3Context();
}

/**
 * Hook for wallet connection utilities
 */
export function useWalletConnection() {
  const { isConnected, account, connect, isConnecting } = useWeb3();
  
  const requireConnection = async (): Promise<void> => {
    if (!isConnected || !account) {
      await connect();
    }
  };

  return {
    isConnected,
    account,
    isConnecting,
    connect,
    requireConnection,
  };
}

/**
 * Hook for network validation utilities
 */
export function useNetworkValidation() {
  const { network, switchNetwork } = useWeb3();
  const { APP_CONFIG, NETWORKS } = require('@/lib/config');
  
  const isCorrectNetwork = network?.chainId === APP_CONFIG.chainId;
  const targetNetwork = NETWORKS[APP_CONFIG.chainId];
  
  const requireCorrectNetwork = async (): Promise<void> => {
    if (!isCorrectNetwork) {
      await switchNetwork(APP_CONFIG.chainId);
    }
  };

  return {
    isCorrectNetwork,
    currentNetwork: network,
    targetNetwork,
    requireCorrectNetwork,
  };
}

/**
 * Hook for transaction utilities
 */
export function useTransactions() {
  const { account, network } = useWeb3();
  
  const canTransact = (): boolean => {
    return !!(account && network);
  };

  const getExplorerUrl = (hash: string): string => {
    if (!network) return '';
    return `${network.explorerUrl}/tx/${hash}`;
  };

  return {
    canTransact,
    getExplorerUrl,
    account,
    network,
  };
}