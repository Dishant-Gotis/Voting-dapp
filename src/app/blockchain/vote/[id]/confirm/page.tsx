/**
 * Vote Confirmation Page
 * Shows confirmation modal before committing vote
 * Based on frontend-ui.md section 7.5
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GovernmentLayout } from "@/components/GovernmentLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function VoteConfirmationPage() {
  const params = useParams();
  const electionId = params.id as string;
  const [isConfirming, setIsConfirming] = useState(false);

  const mockVote = {
    electionTitle: "Municipal Referendum 2025",
    question: "Should the city approve $50M bond for public infrastructure improvements?",
    selectedOption: "Yes - Approve Bond",
    optionId: "opt-yes",
  };

  const handleConfirmVote = async () => {
    setIsConfirming(true);
    // Simulate blockchain confirmation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Redirect to success page
    window.location.href = "/blockchain/vote/success";
  };

  return (
    <GovernmentLayout mode="blockchain" network="Ethereum Sepolia">
      {/* Centered Modal Layout */}
      <motion.div
        className="min-h-[70vh] flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full max-w-2xl">
          {/* Confirmation Card */}
          <Card elevation="lg">
            {/* Header with Icon */}
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blockchain-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blockchain-blue"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-text-primary">
                  Confirm Your Vote
                </h1>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Election Info */}
              <div>
                <p className="text-sm text-text-tertiary mb-2">Election</p>
                <h2 className="text-lg font-semibold text-text-primary">
                  {mockVote.electionTitle}
                </h2>
              </div>

              {/* Question */}
              <div>
                <p className="text-sm text-text-tertiary mb-2">Question</p>
                <p className="text-text-secondary">{mockVote.question}</p>
              </div>

              {/* Your Choice Highlight */}
              <motion.div
                className="bg-blockchain-blue/10 border border-blockchain-blue rounded-lg p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-text-tertiary mb-2">Your Choice</p>
                <p className="text-xl font-bold text-blockchain-blue">
                  {mockVote.selectedOption}
                </p>
              </motion.div>

              {/* Important Notice */}
              <motion.div
                className="bg-status-warning/10 border border-status-warning rounded-lg p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex gap-3">
                  <svg
                    className="w-6 h-6 text-status-warning flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-text-primary mb-2">
                      ⚠️ Important Notice
                    </p>
                    <p className="text-sm text-text-secondary">
                      This action is permanent and recorded on the blockchain.
                      You cannot change your vote after confirmation.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm font-semibold text-text-primary mb-4">
                  🔗 Next Steps
                </p>
                <ol className="space-y-3 text-sm text-text-secondary">
                  <li className="flex gap-3">
                    <span className="text-blockchain-blue font-semibold flex-shrink-0">
                      1.
                    </span>
                    <span>Click "Confirm Vote"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blockchain-blue font-semibold flex-shrink-0">
                      2.
                    </span>
                    <span>MetaMask will open for approval</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blockchain-blue font-semibold flex-shrink-0">
                      3.
                    </span>
                    <span>Review the transaction details</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blockchain-blue font-semibold flex-shrink-0">
                      4.
                    </span>
                    <span>Click "Sign" to confirm on blockchain</span>
                  </li>
                </ol>
              </motion.div>

              {/* Loading State */}
              {isConfirming && (
                <motion.div
                  className="bg-blockchain-blue/5 border border-blockchain-blue rounded-lg p-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="inline-block relative w-8 h-8 mb-4">
                    <div className="absolute border-4 border-text-tertiary rounded-full w-8 h-8"></div>
                    <div className="absolute border-4 border-blockchain-blue rounded-full w-8 h-8 animate-spin" style={{borderTopColor: "transparent", borderRightColor: "transparent"}}></div>
                  </div>
                  <p className="text-text-secondary">
                    Processing your vote...
                  </p>
                </motion.div>
              )}
            </CardContent>

            {/* Footer with Buttons */}
            <div className="px-8 py-6 border-t border-border-subtle bg-bg-elevated rounded-b-lg flex gap-4">
              <Link href={`/blockchain/election/${electionId}`} className="flex-1">
                <Button variant="secondary" size="lg" className="w-full">
                  Cancel
                </Button>
              </Link>
              <button className="flex-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirmVote}
                  disabled={isConfirming}
                >
                  {isConfirming ? "Confirming..." : "Confirm Vote"}
                </Button>
              </button>
            </div>
          </Card>

          {/* Info Box */}
          <motion.p
            className="text-center text-text-tertiary text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            ℹ️ This is a blockchain transaction. It requires network confirmation.
          </motion.p>
        </div>
      </motion.div>
    </GovernmentLayout>
  );
}
