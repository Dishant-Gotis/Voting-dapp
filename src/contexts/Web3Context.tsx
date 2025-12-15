'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Web3ContextType, Network } from '@/types';
import { web3Service } from '@/services/web3.service';
import { APP_CONFIG, NETWORKS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/config';

// Web3 State
interface Web3State {
  account: string | null;
  network: Network | null;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

// Web3 Actions
type Web3Action =
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_ACCOUNT'; payload: string | null }
  | { type: 'SET_NETWORK'; payload: Network | null }
  | { type: 'SET_BALANCE'; payload: string }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

// Initial state
const initialState: Web3State = {
  account: null,
  network: null,
  balance: '0',
  isConnected: false,
  isConnecting: false,
  error: null,
};

// Reducer
function web3Reducer(state: Web3State, action: Web3Action): Web3State {
  switch (action.type) {
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload, error: null };
    case 'SET_ACCOUNT':
      return { ...state, account: action.payload };
    case 'SET_NETWORK':
      return { ...state, network: action.payload };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isConnecting: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Context
const Web3Context = createContext<Web3ContextType | null>(null);

// Provider Props
interface Web3ProviderProps {
  children: ReactNode;
}

// Provider Component
export function Web3Provider({ children }: Web3ProviderProps) {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  // Update network information
  const updateNetworkInfo = async (): Promise<void> => {
    try {
      const network = await web3Service.getNetwork();
      dispatch({ type: 'SET_NETWORK', payload: network });

      // Check if on correct network
      if (network.chainId !== APP_CONFIG.chainId) {
        dispatch({ type: 'SET_ERROR', payload: ERROR_MESSAGES.WRONG_NETWORK });
      } else {
        dispatch({ type: 'SET_ERROR', payload: null });
      }
    } catch (error: any) {
      console.error('Network info error:', error);
      dispatch({ type: 'SET_ERROR', payload: ERROR_MESSAGES.NETWORK_ERROR });
    }
  };

  // Update balance
  const updateBalance = async (): Promise<void> => {
    try {
      if (state.account) {
        const balance = await web3Service.getBalance(state.account);
        dispatch({ type: 'SET_BALANCE', payload: balance });
      }
    } catch (error: any) {
      console.error('Balance update error:', error);
    }
  };

  // Connect wallet
  const connect = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_CONNECTING', payload: true });

      // Check if MetaMask is installed
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      }

      // Connect to wallet
      const account = await web3Service.connect();
      dispatch({ type: 'SET_ACCOUNT', payload: account });
      dispatch({ type: 'SET_CONNECTED', payload: true });

      // Get network and balance
      await updateNetworkInfo();
      await updateBalance();

      dispatch({ type: 'SET_CONNECTING', payload: false });
    } catch (error: any) {
      console.error('Connection error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || ERROR_MESSAGES.WALLET_NOT_CONNECTED });
    }
  };

  // Disconnect wallet
  const disconnect = (): void => {
    web3Service.disconnect();
    web3Service.removeListeners();
    dispatch({ type: 'RESET' });
  };

  // Switch network
  const switchNetwork = async (chainId: number): Promise<void> => {
    try {
      await web3Service.switchNetwork(chainId);
      await updateNetworkInfo();
    } catch (error: any) {
      console.error('Network switch error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || ERROR_MESSAGES.WRONG_NETWORK });
    }
  };

  // Check existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await web3Service.isConnected();
        if (isConnected) {
          const account = await web3Service.getAccount();
          if (account) {
            dispatch({ type: 'SET_ACCOUNT', payload: account });
            dispatch({ type: 'SET_CONNECTED', payload: true });
            await updateNetworkInfo();
            await updateBalance();
          }
        }
      } catch (error) {
        console.error('Connection check error:', error);
      }
    };

    checkConnection();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (state.isConnected) {
      // Listen for account changes
      web3Service.onAccountsChanged(async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          const newAccount = accounts[0];
          dispatch({ type: 'SET_ACCOUNT', payload: newAccount });
          await updateBalance();
        }
      });

      // Listen for network changes
      web3Service.onChainChanged(async (chainId: string) => {
        await updateNetworkInfo();
      });
    }

    return () => {
      web3Service.removeListeners();
    };
  }, [state.isConnected]);

  // Periodic balance updates
  useEffect(() => {
    if (state.isConnected && state.account) {
      const interval = setInterval(updateBalance, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [state.isConnected, state.account]);

  // Context value
  const contextValue: Web3ContextType = {
    account: state.account,
    network: state.network,
    balance: state.balance,
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    connect,
    disconnect,
    switchNetwork,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

// Hook to use Web3 context
export function useWeb3(): Web3ContextType {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}