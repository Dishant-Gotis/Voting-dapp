/**
 * Election Details Page
 * Shows election question, eligibility, voting instructions
 * Based on frontend-ui.md section 7.4
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GovernmentLayout } from "@/components/GovernmentLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface VotingOption {
  id: string;
  label: string;
  description?: string;
}

interface ElectionDetails {
  id: string;
  title: string;
  question: string;
  type: string;
  status: "active" | "closed";
  daysRemaining?: number;
  totalParticipants: number;
  maxParticipants: number;
  description: string;
  options: VotingOption[];
  hasVoted: boolean;
  pendingConfirmation: boolean;
}

const mockElectionDetails: Record<string, ElectionDetails> = {
  "ele-2025-001": {
    id: "ele-2025-001",
    title: "Municipal Referendum 2025",
    question:
      "Should the city approve $50M bond for public infrastructure improvements?",
    type: "Ballot Measure",
    status: "active",
    daysRemaining: 23,
    totalParticipants: 1240,
    maxParticipants: 5000,
    description:
      "This referendum allows citizens to vote on a proposed $50 million municipal bond. The funds would be allocated to infrastructure projects including road repairs, public transportation upgrades, and water system improvements.",
    options: [
      {
        id: "opt-yes",
        label: "Yes - Approve Bond",
        description: "Support the infrastructure improvements",
      },
      {
        id: "opt-no",
        label: "No - Reject Bond",
        description: "Oppose the spending proposal",
      },
      {
        id: "opt-abstain",
        label: "Abstain",
        description: "Do not participate in this measure",
      },
    ],
    hasVoted: false,
    pendingConfirmation: false,
  },
};

export default function ElectionDetailsPage() {
  const params = useParams();
  const electionId = params.id as string;
  const election = mockElectionDetails[electionId] || mockElectionDetails["ele-2025-001"];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const turnoutPercentage = Math.round(
    (election.totalParticipants / election.maxParticipants) * 100
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <GovernmentLayout mode="blockchain" network="Ethereum Sepolia">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Link */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link
            href="/blockchain/home"
            className="inline-flex items-center gap-2 text-blockchain-blue hover:text-blockchain-blue-light"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Elections
          </Link>
        </motion.div>

        {/* Title Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            {election.title}
          </h1>
          <div className="flex flex-wrap gap-4 items-center">
            <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
              election.status === "active"
                ? "bg-status-success/10 text-status-success"
                : "bg-text-tertiary/10 text-text-tertiary"
            }`}>
              {election.status === "active" ? "🟢 Active" : "🔒 Closed"}
            </span>
            {election.status === "active" && election.daysRemaining && (
              <span className="text-text-tertiary">
                {election.daysRemaining} days remaining
              </span>
            )}
          </div>
        </motion.div>

        {/* Main Question */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card elevation="md">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                {election.question}
              </h2>
              <p className="text-text-secondary">{election.description}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Election Metadata */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card elevation="sm">
            <CardContent className="pt-6">
              <p className="text-text-tertiary text-sm">Election ID</p>
              <p className="text-lg font-mono text-blockchain-blue font-medium mt-2">
                {election.id}
              </p>
            </CardContent>
          </Card>
          <Card elevation="sm">
            <CardContent className="pt-6">
              <p className="text-text-tertiary text-sm">Election Type</p>
              <p className="text-lg font-medium text-text-primary mt-2">
                {election.type}
              </p>
            </CardContent>
          </Card>
          <Card elevation="sm">
            <CardContent className="pt-6">
              <p className="text-text-tertiary text-sm">Participation</p>
              <p className="text-lg font-medium text-text-primary mt-2">
                {election.totalParticipants} / {election.maxParticipants}
              </p>
              <div className="w-full bg-bg-elevated rounded-full h-2 mt-2">
                <div
                  className="bg-blockchain-blue rounded-full h-2"
                  style={{ width: `${turnoutPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Eligibility & Instructions */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Eligibility */}
          <Card elevation="md">
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                ✅ Your Eligibility
              </h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <span className="text-status-success">✅</span>
                  <span className="text-text-secondary">Registered Voter</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="text-status-success">✅</span>
                  <span className="text-text-secondary">Eligible District</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="text-status-warning">⚠️</span>
                  <span className="text-text-secondary">
                    Wallet Connected
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card elevation="md">
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                📋 Voting Instructions
              </h3>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="flex gap-3 text-sm">
                  <span className="text-blockchain-blue font-semibold flex-shrink-0">
                    1.
                  </span>
                  <span className="text-text-secondary">
                    Read each option carefully
                  </span>
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="text-blockchain-blue font-semibold flex-shrink-0">
                    2.
                  </span>
                  <span className="text-text-secondary">
                    Select your choice
                  </span>
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="text-blockchain-blue font-semibold flex-shrink-0">
                    3.
                  </span>
                  <span className="text-text-secondary">
                    Confirm in MetaMask
                  </span>
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="text-blockchain-blue font-semibold flex-shrink-0">
                    4.
                  </span>
                  <span className="text-text-secondary">
                    Vote recorded on blockchain
                  </span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>

        {/* Voting Options */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Voting Options
          </h2>

          <div className="space-y-4">
            {election.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? "bg-blockchain-blue/10 border-blockchain-blue"
                    : "bg-bg-surface border-border-subtle hover:border-border-strong"
                }`}
              >
                <input
                  type="radio"
                  name="voting-option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-5 h-5 text-blockchain-blue cursor-pointer"
                  disabled={election.hasVoted || election.status === "closed"}
                />
                <div className="ml-4 flex-1">
                  <p className="text-text-primary font-semibold">
                    {option.label}
                  </p>
                  {option.description && (
                    <p className="text-text-tertiary text-sm mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4 sticky bottom-0 bg-bg-primary border-t border-border-subtle p-6 -m-4 mt-8"
        >
          <Link href="/blockchain/home" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">
              Cancel
            </Button>
          </Link>
          {election.status === "active" && !election.hasVoted && (
            <Link href={`/blockchain/vote/${election.id}/confirm`} className="flex-1">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!selectedOption}
              >
                Cast Your Vote
              </Button>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </GovernmentLayout>
  );
}
