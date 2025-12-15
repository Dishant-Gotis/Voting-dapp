"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Blocks, 
  Shield, 
  Eye, 
  Lock, 
  Wallet,
  Code,
  Server,
  FileCode,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Github
} from "lucide-react";
import { Web3Provider } from "@/lib/web3-context";
import { Navbar } from "@/components/navbar";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

function AboutSection() {
  return (
    <section className="py-16">
      <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">
          About <span className="gradient-text">BlockVote</span>
        </h2>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p>
            BlockVote is a decentralized voting application built on the Ethereum blockchain. 
            It provides a secure, transparent, and immutable platform for conducting elections 
            where every vote is permanently recorded on the blockchain.
          </p>
          <p>
            Traditional voting systems are vulnerable to fraud, manipulation, and lack transparency. 
            Our solution leverages smart contract technology to ensure that elections are conducted 
            fairly, with results that anyone can verify independently.
          </p>
          <p>
            The system uses a whitelist mechanism where only registered voters can participate, 
            while maintaining the anonymity of individual votes. Once a vote is cast, it cannot 
            be altered or deleted, ensuring the integrity of the election process.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Cryptographic security ensures votes cannot be tampered with or forged. Each transaction is verified by the network.",
    },
    {
      icon: Eye,
      title: "Complete Transparency",
      description: "All votes are recorded on a public ledger. Anyone can verify the results without compromising voter privacy.",
    },
    {
      icon: Lock,
      title: "Immutable Records",
      description: "Once recorded, votes cannot be changed or deleted. The blockchain provides a permanent audit trail.",
    },
    {
      icon: Blocks,
      title: "Decentralization",
      description: "No single point of failure or control. The system runs on a distributed network of nodes.",
    },
  ];

  return (
    <section className="py-16">
      <motion.h2 
        {...fadeInUp}
        className="text-3xl font-bold mb-12 text-center"
      >
        Benefits Over <span className="gradient-text">Traditional Systems</span>
      </motion.h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {benefits.map((benefit, i) => (
          <motion.div
            key={i}
            className="card-blockchain p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
              <benefit.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
            <p className="text-slate-400">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TechStackSection() {
  const technologies = [
    { icon: Code, name: "Solidity", description: "Smart contract language" },
    { icon: Blocks, name: "Ethereum", description: "Blockchain platform" },
    { icon: FileCode, name: "React/Next.js", description: "Frontend framework" },
    { icon: Server, name: "Ethers.js", description: "Web3 library" },
  ];

  return (
    <section className="py-16">
      <motion.h2 
        {...fadeInUp}
        className="text-3xl font-bold mb-12 text-center"
      >
        Technology <span className="gradient-text">Stack</span>
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {technologies.map((tech, i) => (
          <motion.div
            key={i}
            className="card-blockchain p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <tech.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">{tech.name}</h3>
            <p className="text-sm text-slate-400">{tech.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function VoterGuideSection() {
  const steps = [
    { step: "1", title: "Install MetaMask", description: "Download and install the MetaMask browser extension from metamask.io" },
    { step: "2", title: "Create/Import Wallet", description: "Set up a new wallet or import an existing one using your seed phrase" },
    { step: "3", title: "Connect Wallet", description: "Click 'Connect Wallet' on the voting page and approve the connection" },
    { step: "4", title: "Get Whitelisted", description: "Contact the election administrator to add your wallet to the voter list" },
    { step: "5", title: "Cast Your Vote", description: "Select your preferred candidate and confirm the transaction" },
    { step: "6", title: "Verify on Blockchain", description: "Your vote is recorded on the blockchain - verify it on Etherscan" },
  ];

  return (
    <section className="py-16">
      <motion.h2 
        {...fadeInUp}
        className="text-3xl font-bold mb-4 text-center"
      >
        Voter <span className="gradient-text">Guide</span>
      </motion.h2>
      <motion.p 
        {...fadeInUp}
        className="text-slate-400 text-center mb-12 max-w-2xl mx-auto"
      >
        Follow these steps to participate in the election
      </motion.p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((item, i) => (
          <motion.div
            key={i}
            className="card-blockchain p-6 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-lg">
              {item.step}
            </div>
            <div className="pt-4">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "Do I need cryptocurrency to vote?",
      answer: "Yes, you need a small amount of ETH to pay for the gas fees when submitting your vote. The amount is usually very small (a few cents worth).",
    },
    {
      question: "Can I change my vote after submitting?",
      answer: "No, once your vote is recorded on the blockchain, it cannot be changed or deleted. This ensures the integrity of the election.",
    },
    {
      question: "How do I know my vote was counted?",
      answer: "After voting, you'll receive a transaction hash. You can use this to verify your vote on Etherscan or any Ethereum block explorer.",
    },
    {
      question: "Is my vote anonymous?",
      answer: "While the blockchain is public, your identity is represented only by your wallet address. Your vote is linked to your address, not your personal identity.",
    },
    {
      question: "What happens if I'm not whitelisted?",
      answer: "You won't be able to cast a vote. Contact the election administrator to have your wallet address added to the voter whitelist.",
    },
    {
      question: "Which networks are supported?",
      answer: "The contract can be deployed on Ethereum mainnet, testnets (Sepolia, Goerli), or local networks for testing (Hardhat, Ganache).",
    },
  ];

  return (
    <section className="py-16">
      <motion.h2 
        {...fadeInUp}
        className="text-3xl font-bold mb-12 text-center"
      >
        Frequently Asked <span className="gradient-text">Questions</span>
      </motion.h2>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            className="card-blockchain p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-start gap-4">
              <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-slate-400">{faq.answer}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16">
      <motion.div
        className="card-blockchain p-12 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <h2 className="text-3xl font-bold mb-4">Ready to Vote?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Connect your wallet and participate in secure, transparent elections on the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/vote"
              className="btn-primary px-8 py-4 rounded-xl font-semibold flex items-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Start Voting
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://github.com/ashishlamsal/voting-dapp"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-8 py-4 rounded-xl font-semibold flex items-center gap-2 text-slate-300"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </motion.div>
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
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/vote" className="text-slate-400 hover:text-white transition-colors">
              Vote
            </Link>
            <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
              Admin
            </Link>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-8 border-t border-slate-800 text-slate-500 text-sm">
          © {new Date().getFullYear()} BlockVote. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function AboutPage() {
  return (
    <Web3Provider>
      <Navbar />
      <main className="min-h-screen pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-4">
              About <span className="gradient-text">BlockVote</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Learn how blockchain technology is revolutionizing the way we vote
            </p>
          </motion.div>

          <AboutSection />
          <BenefitsSection />
          <TechStackSection />
          <VoterGuideSection />
          <FAQSection />
          <CTASection />
        </div>
      </main>
      <Footer />
    </Web3Provider>
  );
}
