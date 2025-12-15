/**
 * Demo Mode - Home Page
 * Same layout as blockchain mode but simulated voting
 * Based on frontend-ui.md - Demo Mode is visually secondary
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
  status: "active" | "closed";
  daysRemaining?: number;
  totalVoters: number;
  votersParticipated: number;
  userVoteStatus: "not-voted" | "pending" | "confirmed";
}

const mockElections: Election[] = [
  {
    id: "ele-demo-001",
    title: "Sample Municipal Election",
    type: "Ballot Measure",
    status: "active",
    daysRemaining: 30,
    totalVoters: 1000,
    votersParticipated: 450,
    userVoteStatus: "not-voted",
  },
  {
    id: "ele-demo-002",
    title: "Practice School Board Vote",
    type: "Representative Election",
    status: "closed",
    totalVoters: 800,
    votersParticipated: 600,
    userVoteStatus: "not-voted",
  },
];

function StatusBadge({ status }: { status: Election["status"] }) {
  const styles = {
    active: "bg-status-success/10 text-status-success",
    closed: "bg-text-tertiary/10 text-text-tertiary",
  };

  const labels = {
    active: "🟢 Active",
    closed: "🔒 Closed",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${styles[status]}`}>
      {labels[status]}
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
                  className="bg-status-warning rounded-full h-2 transition-all duration-500"
                  style={{ width: `${turnoutPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border-subtle">
              {election.status === "active" && (
                <Link href={`/demo/election/${election.id}`} className="flex-1">
                  <Button variant="gold" size="md" className="w-full">
                    Try Voting
                  </Button>
                </Link>
              )}
              <Link href={`/demo/election/${election.id}`} className={election.status === "active" ? "flex-1" : "flex-1"}>
                <Button
                  variant={election.status === "active" ? "secondary" : "primary"}
                  size="md"
                  className="w-full"
                >
                  Details
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DemoHomePage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "closed">("all");

  const filteredElections = mockElections.filter((e) =>
    filterStatus === "all" ? true : e.status === filterStatus
  );

  const activeElections = mockElections.filter((e) => e.status === "active");

  return (
    <GovernmentLayout mode="demo">
      {/* Welcome Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          Welcome to Demo Mode
        </h1>
        <p className="text-lg text-text-secondary">
          Explore the voting system. These votes are simulated and not recorded
          on blockchain.
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
                ? "bg-status-warning text-text-inverse"
                : "bg-bg-surface border border-border-subtle text-text-secondary hover:border-border-strong"
            }`}
          >
            {status === "all" ? "All" : status === "active" ? "Active" : "Closed"}
          </button>
        ))}
      </motion.div>

      {/* Active Elections Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            Sample Elections ({activeElections.length})
          </h2>
          <span className="inline-block px-2 py-0.5 bg-status-warning/20 text-status-warning text-xs font-semibold rounded">
            DEMO
          </span>
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
                No active elections available in demo mode.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info Box */}
      <motion.div
        className="bg-status-warning/10 border border-status-warning rounded-lg p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-text-secondary">
          <span className="font-semibold text-text-primary">Demo Mode Info:</span> This
          system simulates blockchain voting. No actual blockchain transactions
          occur. Results are not recorded.
        </p>
      </motion.div>
    </GovernmentLayout>
  );
}
