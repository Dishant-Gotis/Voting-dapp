/**
 * Vote Success Page
 * Confirms vote was recorded on blockchain
 * Based on frontend-ui.md section 7.7
 */

"use client";

import React from "react";
import Link from "next/link";
import { GovernmentLayout } from "@/components/GovernmentLayout";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function VoteSuccessPage() {
  const mockTransaction = {
    electionTitle: "Municipal Referendum 2025",
    selectedVote: "Yes - Approve Bond",
    transactionHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
    blockNumber: 12345678,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const successIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <GovernmentLayout mode="blockchain" network="Ethereum Sepolia">
      {/* Centered Success Content */}
      <motion.div
        className="min-h-[70vh] flex items-center justify-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-2xl w-full text-center">
          {/* Success Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-status-success/10 rounded-full mb-8"
            variants={successIconVariants}
          >
            <svg
              className="w-12 h-12 text-status-success"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </motion.div>

          {/* Main Success Message */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold text-status-success mb-2">
              ✅ Vote Successfully Cast!
            </h1>
            <p className="text-lg text-text-secondary">
              Your vote has been recorded on the blockchain.
            </p>
          </motion.div>

          {/* Vote Details */}
          <motion.div variants={itemVariants} className="bg-bg-surface border border-border-subtle rounded-lg p-8 mb-8">
            <div className="space-y-6">
              {/* Election Info */}
              <div>
                <p className="text-sm text-text-tertiary mb-1">Election</p>
                <p className="text-xl font-semibold text-text-primary">
                  {mockTransaction.electionTitle}
                </p>
              </div>

              {/* Vote Choice */}
              <div>
                <p className="text-sm text-text-tertiary mb-1">Your Vote</p>
                <p className="text-lg font-semibold text-blockchain-blue">
                  {mockTransaction.selectedVote}
                </p>
              </div>

              {/* Blockchain Verification */}
              <div className="border-t border-border-subtle pt-6">
                <div className="inline-flex items-center gap-2 bg-status-success/10 text-status-success px-4 py-2 rounded-full mb-6">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span className="font-medium text-sm">On-Chain Verified</span>
                </div>

                {/* Transaction Details */}
                <div className="space-y-4 text-left bg-bg-elevated rounded-lg p-4">
                  <div>
                    <p className="text-xs text-text-tertiary mb-2">Transaction Hash</p>
                    <p className="font-mono text-sm text-text-primary break-all">
                      {mockTransaction.transactionHash.substring(0, 20)}...
                      {mockTransaction.transactionHash.substring(
                        mockTransaction.transactionHash.length - 20
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-tertiary mb-2">Block Number</p>
                    <p className="font-mono text-sm text-text-primary">
                      #{mockTransaction.blockNumber.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gratitude Message */}
          <motion.div variants={itemVariants} className="mb-12">
            <p className="text-text-secondary text-lg">
              Thank you for participating in democracy!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link href="/blockchain/home">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/blockchain/results">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                View Election Results
              </Button>
            </Link>
            <Link href="/blockchain/home">
              <Button variant="gold" size="lg" className="w-full sm:w-auto">
                Vote in Another Election
              </Button>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="text-center text-text-tertiary text-sm"
          >
            <p>
              🔗 Your vote is now permanently recorded on the blockchain and
              cannot be changed.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </GovernmentLayout>
  );
}
