/**
 * Government Election Commission - Main Layout Component
 * Includes Header with Official Badge, Mode Indicator, and Footer
 * Based on frontend-ui.md specifications
 */

import React from 'react';
import { OfficialBadge } from '@/components/ui/OfficialBadge';
import { ModeIndicator } from '@/components/ui/ModeIndicator';

interface GovernmentLayoutProps {
  children: React.ReactNode;
  mode?: 'blockchain' | 'demo';
  network?: string;
}

export function GovernmentLayout({
  children,
  mode = 'blockchain',
  network = 'Ethereum Sepolia',
}: GovernmentLayoutProps) {
  return (
    <div className="bg-bg-primary min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-secondary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Branding */}
            <div className="flex items-center gap-4">
              {/* Election Commission Logo/Seal */}
              <svg
                className="w-8 h-8 text-gold"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-label="Election Commission Seal"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 7 15.5 7 14 7.67 14 8.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 7 8.5 7 7 7.67 7 8.5 7.67 10 8.5 10zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>

              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-text-primary">
                  Government
                </span>
                <span className="text-xs text-text-tertiary">
                  Election Commission
                </span>
              </div>
            </div>

            {/* Center: Mode Indicator */}
            <div className="hidden md:block">
              <ModeIndicator mode={mode} network={network} />
            </div>

            {/* Right: Navigation & Status */}
            <div className="flex items-center gap-4">
              {/* Placeholder for wallet connection */}
              <div className="text-xs text-text-tertiary truncate max-w-xs hidden sm:block">
                [Wallet Connection Area]
              </div>
            </div>
          </div>

          {/* Mobile Mode Indicator */}
          <div className="md:hidden pb-4">
            <ModeIndicator mode={mode} network={network} />
          </div>
        </div>
      </header>

      {/* Demo Mode Warning Banner */}
      {mode === 'demo' && (
        <div className="bg-status-warning/10 border-l-4 border-status-warning text-status-warning p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">
                ⚠️ Demo Mode - Simulation Only
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Votes in this mode are NOT recorded on the blockchain. Use
                blockchain mode to participate in official voting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-secondary mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Government Seal & Info */}
            <div className="flex flex-col items-start">
              <svg
                className="w-12 h-12 text-gold mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-label="Election Commission Official Seal"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 7 15.5 7 14 7.67 14 8.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 7 8.5 7 7 7.67 7 8.5 7.67 10 8.5 10zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              <h3 className="text-sm font-semibold text-gold">
                Election Commission
              </h3>
              <p className="text-xs text-text-tertiary mt-2">
                Official Government Blockchain Voting Platform
              </p>
            </div>

            {/* Center Column: Links */}
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-4">
                Resources
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/about" className="text-text-secondary hover:text-text-primary">
                    About This System
                  </a>
                </li>
                <li>
                  <a href="/help" className="text-text-secondary hover:text-text-primary">
                    Help & Support
                  </a>
                </li>
                <li>
                  <a href="/accessibility" className="text-text-secondary hover:text-text-primary">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>

            {/* Right Column: Legal */}
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/privacy" className="text-text-secondary hover:text-text-primary">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-text-secondary hover:text-text-primary">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-text-secondary hover:text-text-primary">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-border-subtle">
            <p className="text-xs text-text-tertiary text-center">
              © 2025 Government Election Commission. All rights reserved.
              Blockchain-Verified Voting System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default GovernmentLayout;
