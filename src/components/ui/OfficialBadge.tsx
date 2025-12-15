/**
 * Official Government Website Badge
 * Displays "OFFICIAL GOVERNMENT WEBSITE" with seal icon
 * Required on all major pages for legitimacy
 */

import React from "react";

export const OfficialBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-2 bg-bg-surface border border-border-strong rounded px-4 py-3">
      {/* Government Seal Icon */}
      <svg
        className="w-5 h-5 text-gold"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 7 15.5 7 14 7.67 14 8.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 7 8.5 7 7 7.67 7 8.5 7.67 10 8.5 10zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
      </svg>

      {/* Badge Text */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gold uppercase tracking-wide">
          🛡️ Official Government Website
        </span>
        <span className="text-xs text-text-secondary">
          Election Commission Platform
        </span>
      </div>
    </div>
  );
};

export default OfficialBadge;
