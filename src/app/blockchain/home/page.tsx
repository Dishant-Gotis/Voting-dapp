/**
 * Blockchain Mode - Home Page
 * Lists active and past elections
 * Based on frontend-ui.md section 7.2
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GovernmentLayout } from "@/components/GovernmentLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface Election {
  id: string;
  title: string;
  type: string;
  status: "active" | "closed" | "pending";
  daysRemaining?: number;
  totalVoters: number;
  votersParticipated: number;
  userVoteStatus: "not-voted" | "pending" | "confirmed";
}

const mockElections: Election[] = [
  {
    id: "ele-2025-001",
    title: "Municipal Referendum 2025",
    type: "Ballot Measure",
    status: "active",
    daysRemaining: 23,
    totalVoters: 5000,
    votersParticipated: 1240,
    userVoteStatus: "not-voted",
  },
  {
    id: "ele-2025-002",
    title: "School Board Election Q1",
    type: "Representative Election",
    status: "active",
    daysRemaining: 5,
    totalVoters: 4200,
    votersParticipated: 2890,
    userVoteStatus: "pending",
  },
  {
    id: "ele-2024-001",
    title: "2024 General Election",
    type: "General Election",
    status: "closed",
    totalVoters: 8500,
    votersParticipated: 7234,
    userVoteStatus: "confirmed",
  },
];

function StatusBadge({ status }: { status: Election["status"] }) {
  const styles = {
    active: "bg-status-success/10 text-status-success",
    closed: "bg-text-tertiary/10 text-text-tertiary",
    pending: "bg-status-info/10 text-status-info",
  };

  const labels = {
    active: "🟢 Active",
    closed: "🔒 Closed",
    pending: "⏳ Pending",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function VoteStatusBadge({ status }: { status: Election["userVoteStatus"] }) {
  const styles = {
    "not-voted": "text-text-tertiary",
    pending: "text-status-info",
    confirmed: "text-status-success",
  };

  const labels = {
    "not-voted": "Not Voted",
    pending: "Pending Confirmation",
    confirmed: "✅ Confirmed",
  };

  return (
    <span className={`text-sm font-medium ${styles[status]}`}>
      Your Vote: {labels[status]}
    </span>
  );
}

function ElectionCard({ election }: { election: Election }) {
  const turnoutPercentage = Math.round(
    (election.votersParticipated / election.totalVoters) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation="md" hoverable={true}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-text-primary">
                {election.title}
              </h3>
              <p className="text-sm text-text-tertiary mt-1">{election.type}</p>
            </div>
            <StatusBadge status={election.status} />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Status Line */}
            <div className="flex items-center justify-between">
              <VoteStatusBadge status={election.userVoteStatus} />
              {election.status === "active" && election.daysRemaining && (
                <span className="text-sm text-text-tertiary">
                  {election.daysRemaining} days remaining
                </span>
              )}
            </div>

            {/* Participation Stats */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Participation</span>
                <span className="text-text-primary font-medium">
                  {election.votersParticipated} / {election.totalVoters} (
                  {turnoutPercentage}%)
                </span>
              </div>
              <div className="w-full bg-bg-elevated rounded-full h-2">
                <div
                  className="bg-blockchain-blue rounded-full h-2 transition-all duration-500"
                  style={{ width: `${turnoutPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border-subtle">
              {election.status === "active" && (
                <Link href={`/blockchain/vote/${election.id}`} className="flex-1">
                  <Button variant="primary" size="md" className="w-full">
                    Vote Now
                  </Button>
                </Link>
              )}
              <Link href={`/blockchain/election/${election.id}`} className={election.status === "active" ? "flex-1" : "flex-1"}>
                <Button
                  variant={election.status === "active" ? "secondary" : "primary"}
                  size="md"
                  className="w-full"
                >
                  {election.status === "closed" ? "View Results" : "Details"}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function BlockchainHomePage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "closed">("all");

  const filteredElections = mockElections.filter((e) =>
    filterStatus === "all" ? true : e.status === filterStatus
  );

  const activeElections = mockElections.filter((e) => e.status === "active");

  return (
    <GovernmentLayout mode="blockchain" network="Ethereum Sepolia">
      {/* Welcome Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          Welcome, Citizen
        </h1>
        <p className="text-lg text-text-secondary">
          Your vote strengthens democracy. Cast your vote on active elections
          below.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex gap-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {(["all", "active", "closed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === status
                ? "bg-blockchain-blue text-text-primary"
                : "bg-bg-surface border border-border-subtle text-text-secondary hover:border-border-strong"
            }`}
          >
            {status === "all" ? "All Elections" : status === "active" ? "Active" : "Closed"}
          </button>
        ))}
      </motion.div>

      {/* Active Elections Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            Active Elections ({activeElections.length})
          </h2>
          <span className="inline-block w-3 h-3 bg-status-success rounded-full animate-pulse" />
        </div>

        {filteredElections.filter((e) => e.status === "active").length > 0 ? (
          <div className="grid gap-6">
            {filteredElections
              .filter((e) => e.status === "active")
              .map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
          </div>
        ) : (
          <Card>
            <CardContent>
              <p className="text-text-tertiary text-center py-8">
                No active elections at this time.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Elections Section */}
      {filteredElections.some((e) => e.status === "closed") && (
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Past Elections
          </h2>

          <div className="grid gap-6">
            {filteredElections
              .filter((e) => e.status === "closed")
              .map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
          </div>
        </div>
      )}
    </GovernmentLayout>
  );
}
