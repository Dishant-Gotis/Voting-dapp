import React, { useState } from 'react';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { cn, truncateAddress, copyToClipboard, getExplorerUrl } from '@/utils';
import { Button } from './Button';
import { TransactionStatusBadge } from './Badge';

interface TransactionHashProps {
  hash: string;
  status?: 'pending' | 'confirmed' | 'failed';
  explorerLink?: boolean;
  truncate?: boolean;
  className?: string;
}

export function TransactionHash({
  hash,
  status,
  explorerLink = true,
  truncate = true,
  className,
}: TransactionHashProps) {
  const [copied, setCopied] = useState(false);

  const displayHash = truncate ? truncateAddress(hash, 8, 6) : hash;

  const handleCopy = async () => {
    const success = await copyToClipboard(hash);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExplorerClick = () => {
    window.open(getExplorerUrl(hash, 'tx'), '_blank');
  };

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className="flex items-center space-x-2">
        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-gray-900 dark:text-gray-100">
          {displayHash}
        </code>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
          title="Copy transaction hash"
        >
          {copied ? (
            <Check className="h-3 w-3 text-accent-green" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>

        {explorerLink && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExplorerClick}
            className="h-8 w-8 p-0"
            title="View on blockchain explorer"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
      </div>

      {status && <TransactionStatusBadge status={status} />}
    </div>
  );
}

// Transaction receipt display
export function TransactionReceipt({
  hash,
  status,
  gasUsed,
  blockNumber,
  timestamp,
}: {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
  blockNumber?: number;
  timestamp?: number;
}) {
  return (
    <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Transaction Hash
        </span>
        <TransactionHash hash={hash} status={status} />
      </div>

      {blockNumber && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Block Number
          </span>
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {blockNumber.toLocaleString()}
          </span>
        </div>
      )}

      {gasUsed && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Gas Used
          </span>
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {gasUsed.toLocaleString()}
          </span>
        </div>
      )}

      {timestamp && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Timestamp
          </span>
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {new Date(timestamp).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}