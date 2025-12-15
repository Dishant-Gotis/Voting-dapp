"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Blocks, 
  Shield, 
  Eye, 
  Lock, 
  Wallet, 
  UserPlus, 
  Vote, 
  CheckCircle2, 
  BarChart3,
  Github,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Web3Provider } from "@/lib/web3-context";
import { Navbar } from "@/components/navbar";

function BlockchainAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
      
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 border border-primary/20 rounded-lg"
          style={{
            top: `${20 + (i * 15)}%`,
            left: `${10 + (i * 12)}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
      
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0)" />
            <stop offset="50%" stopColor="rgba(37, 99, 235, 0.3)" />
            <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
          </linearGradient>
        </defs>
        {[...Array(3)].map((_, i) => (
          <motion.line
            key={i}
            x1="0"
            y1={200 + i * 150}
            x2="100%"
            y2={200 + i * 150}
            stroke="url(#chainGradient)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
      </svg>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      <BlockchainAnimation />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-slate-300">Powered by Ethereum Blockchain</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Decentralized</span>
            <br />
            <span className="text-white">Voting System</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Cast your vote with confidence. Our blockchain-powered platform ensures 
            every vote is transparent, secure, and permanently recorded.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/vote"
              className="btn-primary px-8 py-4 rounded-xl font-semibold flex items-center gap-2 text-lg"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet & Vote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="btn-secondary px-8 py-4 rounded-xl font-semibold flex items-center gap-2 text-lg text-slate-300"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {[
            { value: "100%", label: "Transparent" },
            { value: "24/7", label: "Available" },
            { value: "0", label: "Fraud Risk" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Blocks,
      title: "Decentralized",
      description: "No central authority controls the voting process. Every vote is distributed across the blockchain network for maximum security.",
    },
    {
      icon: Eye,
      title: "Transparent",
      description: "All votes are recorded on a public ledger. Anyone can verify the results without compromising voter privacy.",
    },
    {
      icon: Lock,
      title: "Immutable",
      description: "Once recorded, votes cannot be altered, deleted, or tampered with. The blockchain ensures permanent integrity.",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Why <span className="gradient-text">Blockchain Voting</span>?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Traditional voting systems are vulnerable to fraud and manipulation. 
            Our solution leverages blockchain technology to ensure fair elections.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="card-blockchain p-8 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: Shield,
      title: "Admin Creates Election",
      description: "Election administrator deploys smart contract and adds candidates",
    },
    {
      icon: UserPlus,
      title: "Voters Get Whitelisted",
      description: "Admin adds eligible voter wallet addresses to the whitelist",
    },
    {
      icon: Wallet,
      title: "Connect Wallet",
      description: "Voters connect their MetaMask wallet to verify identity",
    },
    {
      icon: Vote,
      title: "Cast Your Vote",
      description: "Select your candidate and submit your vote to the blockchain",
    },
    {
      icon: CheckCircle2,
      title: "Vote Recorded",
      description: "Your vote is permanently recorded on the Ethereum blockchain",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Simple, secure, and straightforward voting process powered by smart contracts
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />
          
          <div className="grid lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-primary flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold mt-2 mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { icon: Vote, value: "10,000+", label: "Votes Cast" },
    { icon: Blocks, value: "50+", label: "Elections Held" },
    { icon: UserPlus, value: "5,000+", label: "Registered Voters" },
    { icon: BarChart3, value: "100%", label: "Transparency" },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="card-blockchain p-12">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Blocks className="w-6 h-6 text-primary" />
            <span className="font-bold gradient-text">BlockVote</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/vote" className="text-slate-400 hover:text-white transition-colors">
              Vote
            </Link>
            <a 
              href="https://github.com/ashishlamsal/voting-dapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
          
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Built with</span>
            <svg viewBox="0 0 784.37 1277.39" className="w-4 h-4">
              <g fill="#343434">
                <polygon points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54" fill="#8C8C8C"/>
                <polygon points="392.07,0 0,650.54 392.07,882.29 392.07,472.33" fill="#343434"/>
                <polygon points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89" fill="#8C8C8C"/>
                <polygon points="392.07,1277.38 392.07,956.52 0,724.89" fill="#343434"/>
                <polygon points="392.07,882.29 784.13,650.54 392.07,472.33" fill="#141414"/>
                <polygon points="0,650.54 392.07,882.29 392.07,472.33" fill="#393939"/>
              </g>
            </svg>
            <span>on Ethereum</span>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-8 border-t border-slate-800 text-slate-500 text-sm">
          © {new Date().getFullYear()} BlockVote. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <Web3Provider>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
      </main>
      <Footer />
    </Web3Provider>
  );
}
