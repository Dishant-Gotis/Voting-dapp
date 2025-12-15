import React, { useState } from 'react';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { cn, truncateAddress, copyToClipboard, getExplorerUrl } from '@/utils';
import { Button } from './Button';

interface AddressDisplayProps {
  address: string;
  truncate?: boolean;
  copyable?: boolean;
  explorerLink?: boolean;
  startLength?: number;
  endLength?: number;
  className?: string;
}

export function AddressDisplay({
  address,
  truncate = true,
  copyable = true,
  explorerLink = false,
  startLength = 6,
  endLength = 4,
  className,
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const displayAddress = truncate 
    ? truncateAddress(address, startLength, endLength)
    : address;

  const handleCopy = async () => {
    const success = await copyToClipboard(address);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExplorerClick = () => {
    window.open(getExplorerUrl(address, 'address'), '_blank');
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-gray-900 dark:text-gray-100">
        {displayAddress}
      </code>
      
      {copyable && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
          title="Copy address"
        >
          {copied ? (
            <Check className="h-3 w-3 text-accent-green" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      )}

      {explorerLink && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExplorerClick}
          className="h-8 w-8 p-0"
          title="View on explorer"
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

// Wallet address display with connection status
export function WalletAddress({ 
  address, 
  isConnected, 
  balance 
}: { 
  address: string | null; 
  isConnected: boolean;
  balance?: string;
}) {
  if (!isConnected || !address) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span>Not connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
        <AddressDisplay address={address} />
      </div>
      {balance && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {parseFloat(balance).toFixed(4)} ETH
        </span>
      )}
    </div>
  );
}