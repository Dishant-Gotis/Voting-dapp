"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Blocks, Menu, X, Wallet, ChevronDown, LogOut } from "lucide-react";
import { useWeb3 } from "@/lib/web3-context";
import { truncateAddress } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { account, isConnected, isConnecting, connect, disconnect, chainId } = useWeb3();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/vote", label: "Vote" },
    { href: "/admin", label: "Admin Panel" },
  ];

  const getNetworkName = (id: number | null) => {
    const networks: Record<number, string> = {
      1: "Ethereum",
      5: "Goerli",
      11155111: "Sepolia",
      137: "Polygon",
      80001: "Mumbai",
      1337: "Localhost",
      31337: "Hardhat",
    };
    return id ? networks[id] || `Chain ${id}` : "Unknown";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Blocks className="w-8 h-8 text-primary transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-all" />
            </div>
            <span className="text-xl font-bold gradient-text">BlockVote</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isConnected && chainId && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <span className="text-sm text-slate-300">{getNetworkName(chainId)}</span>
              </div>
            )}
            
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass-light hover:bg-slate-700/50 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Wallet className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-mono text-sm">{truncateAddress(account || "")}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg glass overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          disconnect();
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-700/50 transition-all text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-all"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-700/50"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-700/50">
                {isConnected ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-sm text-slate-400">
                      Connected: {truncateAddress(account || "")}
                    </div>
                    <button
                      onClick={() => {
                        disconnect();
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg text-left text-red-400 hover:bg-slate-700/50 transition-all"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connect();
                      setIsOpen(false);
                    }}
                    className="w-full btn-primary px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
