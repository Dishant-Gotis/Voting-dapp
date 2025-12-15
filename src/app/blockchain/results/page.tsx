/**
 * Election Results Page
 * Shows final voting results with on-chain verification
 * Based on frontend-ui.md section 7.8
 */

"use client";

import React from "react";
import Link from "next/link";
import { GovernmentLayout } from "@/components/GovernmentLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface VoteResult {
  option: string;
  votes: number;
  percentage: number;
  color: string;
}

const mockResults: VoteResult[] = [
  { option: "Yes - Approve Bond", votes: 1523, percentage: 62, color: "bg-blockchain-blue" },
  { option: "No - Reject Bond", votes: 614, percentage: 25, color: "bg-text-tertiary" },
  { option: "Abstain", votes: 319, percentage: 13, color: "bg-gold" },
];

const totalVotes = mockResults.reduce((sum, r) => sum + r.votes, 0);

export default function ElectionResultsPage() {
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
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Municipal Referendum 2025 - Results
          </h1>
          <div className="flex flex-wrap gap-4 items-center">
            <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-text-tertiary/10 text-text-tertiary">
              🔒 Closed (Final Results)
            </span>
            <span className="inline-flex items-center gap-2 bg-status-success/10 text-status-success px-3 py-1 rounded text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              Results Verified On-Chain
            </span>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card elevation="sm">
            <CardContent className="pt-6">
              <p className="text-text-tertiary text-sm">Total Votes Cast</p>
              <p className="text-3xl font-bold text-text-primary mt-2">
                {totalVotes.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card elevation="sm">
            <CardContent className="pt-6">
              <p className="text-text-tertiary text-sm">Voter Turnout</p>
              <p className="text-3xl font-bold text-text-primary mt-2">
                49.12%
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                {totalVotes.toLocaleString()} / 5,000
              </p>
            </CardContent>
          </Card>
          <Card elevation="sm">
            <CardContent className="pt-6">
              <p className="text-text-tertiary text-sm">Last Updated</p>
              <p className="text-lg font-mono text-blockchain-blue font-semibold mt-2">
                Block #12,345,678
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Results Card */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card elevation="md">
            <CardHeader>
              <h2 className="text-2xl font-bold text-text-primary">
                Official Results
              </h2>
            </CardHeader>
            <CardContent className="space-y-8">
              {mockResults.map((result, index) => (
                <motion.div
                  key={result.option}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {/* Result Item */}
                  <div>
                    {/* Label and Percentage */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-primary font-semibold">
                        {result.option}
                      </span>
                      <span className="text-text-primary font-bold text-lg">
                        {result.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-bg-elevated rounded-full h-3 mb-2 overflow-hidden">
                      <motion.div
                        className={`${result.color} rounded-full h-3`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>

                    {/* Vote Count */}
                    <div className="text-sm text-text-tertiary">
                      {result.votes.toLocaleString()} votes
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Official Result */}
        <motion.div
          variants={itemVariants}
          className="bg-status-success/10 border border-status-success rounded-lg p-8 mb-8"
        >
          <div className="text-center">
            <p className="text-text-tertiary text-sm mb-2">Official Result</p>
            <h3 className="text-2xl font-bold text-status-success mb-4">
              ✅ MEASURE APPROVED
            </h3>
            <p className="text-text-secondary">
              The Municipal Referendum 2025 has passed. Results are final and
              recorded on the blockchain.
            </p>
          </div>
        </motion.div>

        {/* Technical Details */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card elevation="sm">
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                ℹ️ Technical Details
              </h3>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Election ID:</span>
                <span className="font-mono text-blockchain-blue">ELE-2025-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Smart Contract:</span>
                <span className="font-mono text-blockchain-blue text-xs break-all">
                  0x1a2b3c4d...9a0b
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Network:</span>
                <span className="text-text-secondary">Ethereum Sepolia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Finality:</span>
                <span className="text-status-success flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  Final (On-Chain Verified)
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/blockchain/home">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Back to Elections
            </Button>
          </Link>
          <Button variant="ghost" size="lg" className="w-full sm:w-auto">
            Download Results
          </Button>
        </motion.div>
      </motion.div>
    </GovernmentLayout>
  );
}
