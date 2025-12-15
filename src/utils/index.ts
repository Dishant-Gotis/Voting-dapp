import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate wallet address for display
 */
export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Format large numbers with appropriate suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Generate blockchain explorer URL for transaction
 */
export function getExplorerUrl(hash: string, type: 'tx' | 'address' = 'tx'): string {
  const baseUrl = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://etherscan.io';
  return `${baseUrl}/${type}/${hash}`;
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format time remaining in human readable format
 */
export function formatTimeRemaining(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp - now;
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Format date for display
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep utility for testing and delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse contract error messages to user-friendly format
 */
export function parseContractError(error: any): string {
  if (typeof error === 'string') return error;
  
  if (error?.reason) return error.reason;
  if (error?.message) {
    // Extract revert reason from error message
    const match = error.message.match(/revert (.+)/);
    if (match) return match[1];
    return error.message;
  }
  
  return 'Transaction failed. Please try again.';
}

/**
 * Validate election form data
 */
export function validateElectionData(data: {
  title: string;
  description: string;
  startTime: number;
  endTime: number;
}): string[] {
  const errors: string[] = [];
  
  if (!data.title.trim()) errors.push('Title is required');
  if (!data.description.trim()) errors.push('Description is required');
  if (data.startTime <= Date.now()) errors.push('Start time must be in the future');
  if (data.endTime <= data.startTime) errors.push('End time must be after start time');
  
  return errors;
}

/**
 * Validate candidate data
 */
export function validateCandidateData(data: {
  name: string;
  description: string;
}): string[] {
  const errors: string[] = [];
  
  if (!data.name.trim()) errors.push('Candidate name is required');
  if (!data.description.trim()) errors.push('Candidate description is required');
  
  return errors;
}