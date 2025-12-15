"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { BrowserProvider, Contract, JsonRpcSigner } from "ethers";
import { toast } from "sonner";

const ELECTION_ABI = [
  "function owner() view returns (address)",
  "function electionState() view returns (uint8)",
  "function candidatesCount() view returns (uint256)",
  "function votersCount() view returns (uint256)",
  "function startElection()",
  "function endElection()",
  "function addCandidate(string memory _name)",
  "function addVoter(address _voter)",
  "function getRole(address _current) view returns (uint256)",
  "function vote(uint256 _candidateId)",
  "function getCandidateDetails(uint256 _candidateId) view returns (string memory, uint256)",
  "event Voted(uint256 indexed _candidateId)",
];

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  role: number;
  electionState: number;
  candidates: Candidate[];
  candidatesCount: number;
  votersCount: number;
  hasVoted: boolean;
  contractAddress: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  vote: (candidateId: number) => Promise<boolean>;
  addCandidate: (name: string) => Promise<boolean>;
  addVoter: (address: string) => Promise<boolean>;
  startElection: () => Promise<boolean>;
  endElection: () => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [role, setRole] = useState(3);
  const [electionState, setElectionState] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [votersCount, setVotersCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

  const refreshData = useCallback(async () => {
    if (!contract || !account) return;
    
    try {
      const [roleResult, stateResult, countResult, voterCountResult] = await Promise.all([
        contract.getRole(account),
        contract.electionState(),
        contract.candidatesCount(),
        contract.votersCount(),
      ]);
      
      setRole(Number(roleResult));
      setElectionState(Number(stateResult));
      setCandidatesCount(Number(countResult));
      setVotersCount(Number(voterCountResult));
      
      const candidatesList: Candidate[] = [];
      for (let i = 0; i < Number(countResult); i++) {
        const [name, voteCount] = await contract.getCandidateDetails(i);
        candidatesList.push({ id: i, name, voteCount: Number(voteCount) });
      }
      setCandidates(candidatesList);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  }, [contract, account]);

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast.error("Please install MetaMask to use this application");
      return;
    }

    setIsConnecting(true);
    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const network = await browserProvider.getNetwork();
      const signerInstance = await browserProvider.getSigner();
      
      setProvider(browserProvider);
      setSigner(signerInstance);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      
      if (contractAddress !== "0x0000000000000000000000000000000000000000") {
        const contractInstance = new Contract(contractAddress, ELECTION_ABI, signerInstance);
        setContract(contractInstance);
      }
      
      toast.success("Wallet connected successfully!");
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (err.code === 4001) {
        toast.error("Connection rejected by user");
      } else {
        toast.error("Failed to connect wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setRole(3);
    toast.info("Wallet disconnected");
  };

  const vote = async (candidateId: number): Promise<boolean> => {
    if (!contract) return false;
    try {
      const tx = await contract.vote(candidateId);
      toast.loading("Transaction pending...");
      await tx.wait();
      toast.success("Vote cast successfully!");
      setHasVoted(true);
      await refreshData();
      return true;
    } catch (error: unknown) {
      const err = error as { reason?: string };
      toast.error(err.reason || "Failed to cast vote");
      return false;
    }
  };

  const addCandidate = async (name: string): Promise<boolean> => {
    if (!contract) return false;
    try {
      const tx = await contract.addCandidate(name);
      toast.loading("Adding candidate...");
      await tx.wait();
      toast.success("Candidate added successfully!");
      await refreshData();
      return true;
    } catch (error: unknown) {
      const err = error as { reason?: string };
      toast.error(err.reason || "Failed to add candidate");
      return false;
    }
  };

  const addVoter = async (address: string): Promise<boolean> => {
    if (!contract) return false;
    try {
      const tx = await contract.addVoter(address);
      toast.loading("Adding voter...");
      await tx.wait();
      toast.success("Voter added successfully!");
      await refreshData();
      return true;
    } catch (error: unknown) {
      const err = error as { reason?: string };
      toast.error(err.reason || "Failed to add voter");
      return false;
    }
  };

  const startElection = async (): Promise<boolean> => {
    if (!contract) return false;
    try {
      const tx = await contract.startElection();
      toast.loading("Starting election...");
      await tx.wait();
      toast.success("Election started!");
      await refreshData();
      return true;
    } catch (error: unknown) {
      const err = error as { reason?: string };
      toast.error(err.reason || "Failed to start election");
      return false;
    }
  };

  const endElection = async (): Promise<boolean> => {
    if (!contract) return false;
    try {
      const tx = await contract.endElection();
      toast.loading("Ending election...");
      await tx.wait();
      toast.success("Election ended!");
      await refreshData();
      return true;
    } catch (error: unknown) {
      const err = error as { reason?: string };
      toast.error(err.reason || "Failed to end election");
      return false;
    }
  };

  useEffect(() => {
    if (contract && account) {
      refreshData();
    }
  }, [contract, account, refreshData]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        isConnected: !!account,
        isConnecting,
        role,
        electionState,
        candidates,
        candidatesCount,
        votersCount,
        hasVoted,
        contractAddress,
        connect,
        disconnect,
        vote,
        addCandidate,
        addVoter,
        startElection,
        endElection,
        refreshData,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
