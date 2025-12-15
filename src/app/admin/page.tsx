"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Vote, 
  BarChart3,
  Play,
  Square,
  Plus,
  Wallet,
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Trophy
} from "lucide-react";
import { Web3Provider, useWeb3 } from "@/lib/web3-context";
import { Navbar } from "@/components/navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type TabType = "dashboard" | "candidates" | "voters" | "results";

function StatCard({ icon: Icon, label, value, color }: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number;
  color: string;
}) {
  return (
    <motion.div
      className="card-blockchain p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold gradient-text">{value}</p>
    </motion.div>
  );
}

function DashboardTab() {
  const { candidatesCount, votersCount, electionState, candidates, startElection, endElection } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  const handleStartElection = async () => {
    setIsLoading(true);
    await startElection();
    setIsLoading(false);
  };

  const handleEndElection = async () => {
    setIsLoading(true);
    await endElection();
    setIsLoading(false);
  };

  const chartData = candidates.map(c => ({
    name: c.name,
    votes: c.voteCount
  }));

  const colors = ["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Candidates" value={candidatesCount} color="bg-primary" />
        <StatCard icon={UserPlus} label="Registered Voters" value={votersCount} color="bg-secondary" />
        <StatCard icon={Vote} label="Total Votes" value={totalVotes} color="bg-accent-green" />
        <StatCard 
          icon={electionState === 1 ? CheckCircle2 : Clock} 
          label="Election Status" 
          value={electionState === 0 ? "Not Started" : electionState === 1 ? "Active" : "Ended"} 
          color={electionState === 1 ? "bg-accent-green" : electionState === 2 ? "bg-red-500" : "bg-slate-500"} 
        />
      </div>

      <div className="card-blockchain p-6">
        <h3 className="text-xl font-bold mb-6">Election Control</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleStartElection}
            disabled={isLoading || electionState !== 0}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all
              ${electionState === 0 
                ? "btn-primary" 
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            Start Election
          </button>
          
          <button
            onClick={handleEndElection}
            disabled={isLoading || electionState !== 1}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all
              ${electionState === 1 
                ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30" 
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Square className="w-5 h-5" />}
            End Election
          </button>
        </div>
        
        {electionState === 0 && (
          <p className="text-slate-400 text-sm mt-4">
            Add candidates and voters before starting the election.
          </p>
        )}
      </div>

      {candidates.length > 0 && (
        <div className="card-blockchain p-6">
          <h3 className="text-xl font-bold mb-6">Vote Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: "rgba(30, 41, 59, 0.95)", 
                    border: "1px solid rgba(37, 99, 235, 0.3)",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function CandidatesTab() {
  const { candidates, addCandidate, electionState } = useWeb3();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    const success = await addCandidate(name.trim());
    if (success) {
      setName("");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="card-blockchain p-6">
        <h3 className="text-xl font-bold mb-6">Add New Candidate</h3>
        
        {electionState !== 0 ? (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Candidates can only be added before the election starts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Candidate Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter candidate name"
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 focus:border-primary focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Add Candidate
            </button>
          </form>
        )}
      </div>

      <div className="card-blockchain p-6">
        <h3 className="text-xl font-bold mb-6">Registered Candidates ({candidates.length})</h3>
        <div className="space-y-4">
          {candidates.map((candidate, i) => (
            <motion.div
              key={candidate.id}
              className="p-4 rounded-lg bg-slate-800/50 flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <span className="font-bold">{candidate.id + 1}</span>
                </div>
                <div>
                  <p className="font-semibold">{candidate.name}</p>
                  <p className="text-sm text-slate-400">ID: {candidate.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold gradient-text">{candidate.voteCount}</p>
                <p className="text-sm text-slate-400">votes</p>
              </div>
            </motion.div>
          ))}
          {candidates.length === 0 && (
            <p className="text-slate-400 text-center py-8">No candidates registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function VotersTab() {
  const { votersCount, addVoter, electionState } = useWeb3();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setIsLoading(true);
    const success = await addVoter(address.trim());
    if (success) {
      setAddress("");
    }
    setIsLoading(false);
  };

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);

  return (
    <div className="space-y-8">
      <div className="card-blockchain p-6">
        <h3 className="text-xl font-bold mb-6">Add Voter to Whitelist</h3>
        
        {electionState !== 0 ? (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Voters can only be added before the election starts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Wallet Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border font-mono text-sm focus:outline-none transition-all
                  ${address && !isValidAddress ? "border-red-500" : "border-slate-700 focus:border-primary"}`}
              />
              {address && !isValidAddress && (
                <p className="text-red-400 text-sm mt-2">Invalid Ethereum address</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !isValidAddress}
              className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              Add Voter
            </button>
          </form>
        )}
      </div>

      <div className="card-blockchain p-6">
        <h3 className="text-xl font-bold mb-6">Voter Statistics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-slate-800/50 text-center">
            <p className="text-4xl font-bold gradient-text mb-2">{votersCount}</p>
            <p className="text-slate-400">Total Registered Voters</p>
          </div>
          <div className="p-6 rounded-lg bg-slate-800/50 text-center">
            <p className="text-4xl font-bold gradient-text mb-2">
              {electionState === 2 ? "Closed" : electionState === 1 ? "Open" : "Pending"}
            </p>
            <p className="text-slate-400">Voter Registration</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsTab() {
  const { candidates, electionState } = useWeb3();
  
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const winner = sortedCandidates[0];

  if (electionState !== 2) {
    return (
      <div className="card-blockchain p-12 text-center">
        <Clock className="w-16 h-16 text-slate-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">Results Not Available</h3>
        <p className="text-slate-400">
          Election results will be displayed after the election ends.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {winner && winner.voteCount > 0 && (
        <motion.div
          className="card-blockchain p-8 border-accent-green/50 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-accent-green/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-accent-green" />
              </div>
              <div>
                <p className="text-sm text-accent-green font-medium">Election Winner</p>
                <h2 className="text-3xl font-bold">{winner.name}</h2>
              </div>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-slate-400">Total Votes</p>
                <p className="text-2xl font-bold gradient-text">{winner.voteCount}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Vote Share</p>
                <p className="text-2xl font-bold gradient-text">
                  {totalVotes > 0 ? ((winner.voteCount / totalVotes) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="card-blockchain p-6">
        <h3 className="text-xl font-bold mb-6">Final Results</h3>
        <div className="space-y-4">
          {sortedCandidates.map((candidate, i) => {
            const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
            return (
              <motion.div
                key={candidate.id}
                className="p-4 rounded-lg bg-slate-800/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                      ${i === 0 ? "bg-accent-green text-white" : "bg-slate-700"}`}>
                      {i + 1}
                    </div>
                    <span className="font-semibold">{candidate.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{candidate.voteCount} votes</span>
                    <span className="text-slate-400 ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${i === 0 ? "bg-accent-green" : "bg-primary"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AdminContent() {
  const { isConnected, connect, role } = useWeb3();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const tabs = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "candidates" as TabType, label: "Candidates", icon: Users },
    { id: "voters" as TabType, label: "Voters", icon: UserPlus },
    { id: "results" as TabType, label: "Results", icon: BarChart3 },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card-blockchain p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-8">
              Connect your wallet to access the admin dashboard. Only the contract owner can manage the election.
            </p>
            <button onClick={connect} className="btn-primary px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connect MetaMask
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (role !== 1) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card-blockchain p-12 text-center border-red-500/30">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-slate-400">
              Only the contract owner can access the admin dashboard. Your wallet is not authorized.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400">Manage election, candidates, and voters</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 p-2 rounded-xl glass-light">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                ${activeTab === tab.id 
                  ? "btn-primary" 
                  : "hover:bg-slate-700/50 text-slate-400"
                }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "candidates" && <CandidatesTab />}
        {activeTab === "voters" && <VotersTab />}
        {activeTab === "results" && <ResultsTab />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Web3Provider>
      <Navbar />
      <AdminContent />
    </Web3Provider>
  );
}
