import { ethers } from 'ethers';
import { APP_CONFIG, NETWORKS, VOTING_CONTRACT_ABI, GAS_LIMITS } from '@/lib/config';
import { Network, Transaction, TransactionType } from '@/types';
import { parseContractError } from '@/utils';

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  async initialize(): Promise<void> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not detected');
    }
    this.provider = new ethers.BrowserProvider(window.ethereum);
  }

  async connect(): Promise<string> {
    if (!this.provider) await this.initialize();
    if (!this.provider) throw new Error('Provider not initialized');

    await this.provider.send('eth_requestAccounts', []);
    this.signer = await this.provider.getSigner();
    const address = await this.signer.getAddress();

    this.contract = new ethers.Contract(
      APP_CONFIG.contractAddress,
      VOTING_CONTRACT_ABI,
      this.signer
    );

    return address;
  }

  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }

  async getAccount(): Promise<string | null> {
    if (!this.signer) return null;
    try {
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Error getting account:', error);
      return null;
    }
  }

  async getBalance(address?: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    const targetAddress = address || await this.getAccount();
    if (!targetAddress) throw new Error('No account available');
    const balance = await this.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  async getNetwork(): Promise<Network> {
    if (!this.provider) throw new Error('Provider not initialized');
    const network = await this.provider.getNetwork();
    const chainId = Number(network.chainId);
    return NETWORKS[chainId] || {
      chainId,
      name: `Unknown Network (${chainId})`,
      rpcUrl: '',
      explorerUrl: '',
    };
  }
  async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) throw new Error('MetaMask not detected');
    const hexChainId = `0x${chainId.toString(16)}`;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        const network = NETWORKS[chainId];
        if (network) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: hexChainId,
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.explorerUrl],
            }],
          });
        }
      } else {
        throw error;
      }
    }
  }

  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: any) => callback(accounts));
    }
  }

  onChainChanged(callback: (chainId: string) => void): void {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: any) => callback(chainId));
    }
  }

  removeListeners(): void {
    // Note: We'll store callbacks to remove them properly in a real implementation
    // For now, this is a placeholder
  }

  async isConnected(): Promise<boolean> {
    if (!this.provider) return false;
    try {
      const accounts = await this.provider.listAccounts();
      return accounts.length > 0;
    } catch (error) {
      return false;
    }
  }

  async validateNetwork(): Promise<boolean> {
    try {
      const network = await this.getNetwork();
      return network.chainId === APP_CONFIG.chainId;
    } catch (error) {
      return false;
    }
  }
}

export const web3Service = new Web3Service();