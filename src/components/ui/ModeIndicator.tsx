/**
 * Blockchain Mode Indicator
 * Shows whether system is in Blockchain Mode or Demo Mode
 * Positioned in navigation header
 */

import React from "react";

export interface ModeIndicatorProps {
  mode: "blockchain" | "demo";
  network?: string;
}

export const ModeIndicator: React.FC<ModeIndicatorProps> = ({
  mode,
  network = "Ethereum Sepolia",
}) => {
  const isBockchainMode = mode === "blockchain";

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm ${
        isBockchainMode
          ? "bg-blockchain-blue/10 text-blockchain-blue"
          : "bg-status-warning/10 text-status-warning"
      }`}
    >
      {/* Mode Icon */}
      {isBockchainMode ? (
        <>
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span className="uppercase tracking-wide">🔗 Blockchain Mode</span>
          {network && (
            <span className="text-xs opacity-75 ml-2">
              ({network})
            </span>
          )}
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
          <span className="uppercase tracking-wide">
            ⚠️ Demo Mode (Simulation)
          </span>
        </>
      )}
    </div>
  );
};

export default ModeIndicator;
