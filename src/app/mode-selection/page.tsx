/**
 * Mode Selection Landing Page
 * Users choose between Blockchain Mode or Demo Mode
 * Based on frontend-ui.md section 7.1
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { OfficialBadge } from "@/components/ui/OfficialBadge";
import { Button } from "@/components/ui/Button";

export default function ModeSelectionPage() {
  const [selectedMode, setSelectedMode] = useState<"blockchain" | "demo" | null>(
    null
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-bg-primary min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border-subtle bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <OfficialBadge />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-6xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title Section */}
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            {/* Government Seal */}
            <svg
              className="w-24 h-24 text-gold mx-auto mb-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 7 15.5 7 14 7.67 14 8.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 7 8.5 7 7 7.67 7 8.5 7.67 10 8.5 10zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>

            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
              Election Commission Voting Platform
            </h1>
            <p className="text-lg text-text-secondary mb-8">
              Powered by Blockchain Technology
            </p>
            <p className="text-text-tertiary">
              Select your participation mode to continue
            </p>
          </motion.div>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Blockchain Mode Card */}
            <motion.div
              variants={itemVariants}
              onHoverStart={() => setSelectedMode("blockchain")}
              onHoverEnd={() => setSelectedMode(null)}
            >
              <Link href="/blockchain/home">
                <div className="relative h-full group cursor-pointer">
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blockchain-blue/10 to-blockchain-blue/5 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

                  {/* Card Content */}
                  <div className="relative bg-bg-surface border-2 border-border-subtle rounded-xl p-8 transition-all duration-300 group-hover:border-blockchain-blue hover:shadow-lg">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-blockchain-blue/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blockchain-blue/20 transition-all">
                      <svg
                        className="w-8 h-8 text-blockchain-blue"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 7 15.5 7 14 7.67 14 8.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 7 8.5 7 7 7.67 7 8.5 7.67 10 8.5 10zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                      </svg>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-text-primary mb-3">
                      🔗 Blockchain Mode
                    </h2>

                    {/* Description */}
                    <p className="text-text-secondary mb-6">
                      Connect your wallet and cast real votes on the blockchain.
                      Your vote is verified on-chain and permanent.
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3 text-sm text-text-secondary">
                        <svg
                          className="w-5 h-5 text-blockchain-blue flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span>MetaMask wallet required</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-text-secondary">
                        <svg
                          className="w-5 h-5 text-blockchain-blue flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span>Live blockchain voting</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-text-secondary">
                        <svg
                          className="w-5 h-5 text-blockchain-blue flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span>On-chain verified & permanent</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-text-secondary">
                        <svg
                          className="w-5 h-5 text-blockchain-blue flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span>Official voting results</span>
                      </li>
                    </ul>

                    {/* Button */}
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full justify-center"
                    >
                      Enter Blockchain Mode
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Demo Mode Card */}
            <motion.div
              variants={itemVariants}
              onHoverStart={() => setSelectedMode("demo")}
              onHoverEnd={() => setSelectedMode(null)}
            >
              <Link href="/demo/home">
                <div className="relative h-full group cursor-pointer">
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-status-warning/10 to-status-warning/5 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

                  {/* Card Content */}
                  <div className="relative bg-bg-surface border-2 border-border-subtle rounded-xl p-8 transition-all duration-300 group-hover:border-status-warning hover:shadow-lg">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-status-warning/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-status-warning/20 transition-all">
                      <svg
                        className="w-8 h-8 text-status-warning"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                      </svg>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-text-primary mb-3">
                      ⚠️ Demo Mode
                    </h2>

                    {/* Subtitle */}
                    <div className="inline-block mb-6">
                      <span className="text-xs font-semibold text-status-warning uppercase tracking-wide bg-status-warning/10 px-3 py-1 rounded">
                        Simulation Only
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-text-secondary mb-6">
                      Test the voting system without blockchain. Perfect for
                      learning how to vote and exploring features.
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3 text-sm text-text-secondary">
                        <svg
                          className="w-5 h-5 text-status-warning flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span>No wallet required</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-text-secondary">
                        <svg
                          className="w-5 h-5 text-status-warning flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span>Simulated voting</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-text-secondary">
                        <svg
                          className="w-5 h-5 text-status-warning flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span>Practice voting interface</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-text-secondary">
                        <svg
                          className="w-5 h-5 text-status-warning flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span>Demo results not recorded</span>
                      </li>
                    </ul>

                    {/* Button */}
                    <Button
                      variant="gold"
                      size="lg"
                      className="w-full justify-center"
                    >
                      Enter Demo Mode
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Information Section */}
          <motion.div
            className="bg-bg-surface border border-border-subtle rounded-xl p-8"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              How to Choose
            </h3>
            <p className="text-text-secondary mb-4">
              <strong className="text-text-primary">Blockchain Mode:</strong> Use
              this for official voting. You'll need MetaMask installed and
              connected to participate. Your vote is recorded on the blockchain
              and verified permanently.
            </p>
            <p className="text-text-secondary">
              <strong className="text-text-primary">Demo Mode:</strong> Use this
              to explore the system without a wallet. Simulated votes are not
              recorded on blockchain. Perfect for testing and learning.
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-secondary mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-text-tertiary text-center">
            © 2025 Government Election Commission. Official Blockchain Voting
            System.
          </p>
        </div>
      </footer>
    </div>
  );
}
