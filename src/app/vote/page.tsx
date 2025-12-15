"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Vote, 
  Wallet, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  ExternalLink,
  Copy,
  X,
  Loader2
} from "lucide-react";
import { Web3Provider, useWeb3 } from "@/lib/web3-context";
import { Navbar } from "@/components/navbar";
import { truncateAddress } from "@/lib/utils";
import { toast } from "sonner";

function ElectionStatusBadge({ state }: { state: number }) {
  const statusConfig = {
    0: { label: "Not Started", color: "bg-slate-500", icon: Clock },
    1: { label: "Active", color: "bg-accent-green", icon: CheckCircle2 },
    2: { label: "Ended", color: "bg-red-500", icon: AlertCircle },
  };

  const config = statusConfig[state as keyof typeof statusConfig] || statusConfig[0];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.color}/20 border border-current`}>
      <Icon className={`w-4 h-4 ${config.color.replace("bg-", "text-")}`} />
      <span className={`text-sm font-medium ${config.color.replace("bg-", "text-")}`}>
        {config.label}
      </span>
    </div>
  );
}

function CandidateCard({ 
  candidate, 
  onVote, 
  disabled, 
  showVotes,
  isVoted 
}: { 
  candidate: { id: number; name: string; voteCount: number };
  onVote: () => void;
  disabled: boolean;
  showVotes: boolean;
  isVoted: boolean;
}) {
  return (
    <motion.div
      className={`card-blockchain p-6 relative overflow-hidden ${isVoted ? "ring-2 ring-accent-green" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
    >
      {isVoted && (
        <div className="absolute top-4 right-4">
          <CheckCircle2 className="w-6 h-6 text-accent-green" />
        </div>
      )}
      
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mx-auto mb-4">
        <User className="w-10 h-10 text-primary-light" />
      </div>
      
      <h3 className="text-xl font-semibold text-center mb-2">{candidate.name}</h3>
      <p className="text-slate-400 text-sm text-center mb-4">Candidate #{candidate.id + 1}</p>
      
      {showVotes && (
        <div className="mb-4 p-3 rounded-lg bg-slate-800/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Votes</span>
            <span className="font-bold gradient-text">{candidate.voteCount}</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(candidate.voteCount * 10, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      )}
      
      <button
        onClick={onVote}
        disabled={disabled}
        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2
          ${disabled 
            ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
            : "btn-primary hover:shadow-lg hover:shadow-primary/30"
          }`}
      >
        <Vote className="w-4 h-4" />
        {isVoted ? "Voted" : "Vote"}
      </button>
    </motion.div>
  );
}

function VoteConfirmModal({ 
  candidate, 
  onConfirm, 
  onCancel, 
  isLoading 
}: { 
  candidate: { id: number; name: string };
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      
      <motion.div
        className="relative w-full max-w-md card-blockchain p-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Vote className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Confirm Your Vote</h3>
          <p className="text-slate-400">You are about to vote for:</p>
        </div>
        
        <div className="p-4 rounded-lg bg-slate-800/50 mb-6">
          <p className="text-lg font-semibold text-center">{candidate.name}</p>
          <p className="text-sm text-slate-400 text-center">Candidate #{candidate.id + 1}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6">
          <p className="text-sm text-amber-400 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>This action is irreversible. Once confirmed, your vote cannot be changed.</span>
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-lg font-medium btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-lg font-medium btn-primary flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm Vote
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VoteContent() {
  const { 
    isConnected, 
    connect, 
    account, 
    role, 
    electionState, 
    candidates, 
    hasVoted, 
    vote,
    contractAddress
  } = useWeb3();
  
  const [selectedCandidate, setSelectedCandidate] = useState<{ id: number; name: string } | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [votedFor, setVotedFor] = useState<number | null>(null);

  const handleVote = async () => {
    if (!selectedCandidate) return;
    
    setIsVoting(true);
    const success = await vote(selectedCandidate.id);
    if (success) {
      setVotedFor(selectedCandidate.id);
    }
    setIsVoting(false);
    setSelectedCandidate(null);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const canVote = isConnected && role === 2 && electionState === 1 && !hasVoted;
  const showVotes = electionState === 2;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Cast Your <span className="gradient-text">Vote</span>
            </h1>
            <p className="text-slate-400">Select a candidate and submit your vote to the blockchain</p>
          </div>
          <ElectionStatusBadge state={electionState} />
        </div>

        {!isConnected ? (
          <div className="card-blockchain p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Connect your MetaMask wallet to verify your identity and cast your vote on the blockchain.
            </p>
            <button onClick={connect} className="btn-primary px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connect MetaMask
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card-blockchain p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="text-slate-400 text-sm">Your Wallet</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{truncateAddress(account || "", 6)}</span>
                  <button 
                    onClick={() => copyAddress(account || "")}
                    className="p-1 hover:bg-slate-700/50 rounded transition-all"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
              
              <div className="card-blockchain p-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <span className="text-slate-400 text-sm">Your Role</span>
                </div>
                <span className="font-semibold">
                  {role === 1 ? "Admin" : role === 2 ? "Registered Voter" : "Not Registered"}
                </span>
              </div>
              
              <div className="card-blockchain p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Vote className="w-5 h-5 text-primary" />
                  <span className="text-slate-400 text-sm">Voting Status</span>
                </div>
                <span className={`font-semibold ${hasVoted || votedFor !== null ? "text-accent-green" : "text-slate-300"}`}>
                  {hasVoted || votedFor !== null ? "Vote Cast" : "Not Voted"}
                </span>
              </div>
            </div>

            {role !== 2 && role !== 1 && (
              <div className="card-blockchain p-6 mb-8 border-amber-500/30">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-400 mb-1">Not Registered</h3>
                    <p className="text-slate-400">
                      Your wallet address is not registered as a voter. Contact the election administrator to be added to the whitelist.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {electionState === 0 && (
              <div className="card-blockchain p-6 mb-8">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Election Not Started</h3>
                    <p className="text-slate-400">
                      The election has not started yet. Please wait for the administrator to begin the voting period.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Candidates</h2>
              <p className="text-slate-400">
                {candidates.length} candidates registered
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onVote={() => setSelectedCandidate(candidate)}
                  disabled={!canVote || votedFor !== null}
                  showVotes={showVotes}
                  isVoted={votedFor === candidate.id}
                />
              ))}
            </div>

            {contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000" && (
              <div className="mt-12 p-6 rounded-xl glass-light">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  Contract Information
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Contract Address:</span>
                  <span className="font-mono text-sm">{truncateAddress(contractAddress, 8)}</span>
                  <button 
                    onClick={() => copyAddress(contractAddress)}
                    className="p-1 hover:bg-slate-700/50 rounded transition-all"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                  <a 
                    href={`https://etherscan.io/address/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-slate-700/50 rounded transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <VoteConfirmModal
            candidate={selectedCandidate}
            onConfirm={handleVote}
            onCancel={() => setSelectedCandidate(null)}
            isLoading={isVoting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VotePage() {
  return (
    <Web3Provider>
      <Navbar />
      <VoteContent />
    </Web3Provider>
  );
}
