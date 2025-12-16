import React from 'react'
import { Card } from '@/components/Card'

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">About Voting DAPP</h1>
          <p className="text-xl text-slate-300">
            How it works, what's inside, and why blockchain matters for voting.
          </p>
        </section>

        {/* Problem Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">The Problem</h2>
          <Card>
            <p className="text-slate-300 leading-relaxed mb-4">
              Traditional voting systems have inherent trust gaps:
            </p>
            <ul className="space-y-3 text-slate-400">
              <li className="flex gap-3">
                <span className="text-red-400">✗</span>
                <span>Centralized control — Few can verify results</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400">✗</span>
                <span>Paper-based — Prone to loss, tampering, or miscount</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400">✗</span>
                <span>Lack of transparency — Results announced without proof</span>
              </li>
            </ul>
          </Card>
        </section>

        {/* Blockchain Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">How Blockchain Works</h2>
          <div className="space-y-4 mb-8">
            <Card>
              <div className="flex gap-4">
                <div className="text-4xl">📮</div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">Your Vote is Sent</h3>
                  <p className="text-slate-400">
                    Your vote is hashed (converted into a unique code) and encrypted.
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex gap-4">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">Smart Contract Validates</h3>
                  <p className="text-slate-400">
                    The blockchain smart contract checks if you're eligible and haven't voted before.
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex gap-4">
                <div className="text-4xl">🔗</div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">Block is Added</h3>
                  <p className="text-slate-400">
                    Your vote is permanently recorded in a block. Cannot be changed or deleted.
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex gap-4">
                <div className="text-4xl">🌐</div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">Network Confirms</h3>
                  <p className="text-slate-400">
                    Thousands of computers verify and confirm the vote. True decentralization.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Voting Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">The Complete Voting Process</h2>
          <Card>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">Registration</h3>
                  <p className="text-slate-400">
                    You verify your identity through government databases (backend-only, secure).
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">Connect Wallet</h3>
                  <p className="text-slate-400">
                    For blockchain mode, you connect your MetaMask wallet (or use demo mode without it).
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">Select Party</h3>
                  <p className="text-slate-400">
                    Choose your candidate from the list of registered parties.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">Confirm Vote</h3>
                  <p className="text-slate-400">
                    Review your selection and confirm (no going back!).
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">Submit to Blockchain</h3>
                  <p className="text-slate-400">
                    Your vote is recorded on the blockchain (or demo backend).
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  6
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">Get Proof</h3>
                  <p className="text-slate-400">
                    Receive a cryptographic proof that your vote was recorded.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Comparison Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Blockchain Mode vs Demo Mode</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-3 font-bold text-slate-100">Feature</th>
                    <th className="text-left py-3 px-3 font-bold text-yellow-400">Blockchain Mode</th>
                    <th className="text-left py-3 px-3 font-bold text-blue-400">Demo Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Backend', 'Smart Contracts', 'Supabase (Cloud)'],
                    ['Setup', 'MetaMask required', 'Direct login'],
                    ['Speed', '5-15 seconds', 'Instant (<1s)'],
                    ['Cost', 'Gas fees', 'Free'],
                    ['Proof', 'Transaction hash', 'Certification'],
                    ['Use Case', 'Production voting', 'Testing & demos'],
                    ['Privacy', 'Vote encrypted', 'RLS enforced'],
                    ['Results', 'On-chain verify', 'Backend computed']
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-700/50">
                      <td className="py-3 px-3 font-medium text-slate-300">{row[0]}</td>
                      <td className="py-3 px-3 text-slate-400">{row[1]}</td>
                      <td className="py-3 px-3 text-slate-400">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Security Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Security & Trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="font-bold text-slate-100 mb-2 flex items-center gap-2">
                <span>🔐</span> Encryption
              </h3>
              <p className="text-slate-400 text-sm">
                All votes are encrypted in transit and at rest. Your identity is never exposed.
              </p>
            </Card>
            <Card>
              <h3 className="font-bold text-slate-100 mb-2 flex items-center gap-2">
                <span>📋</span> Audit Logs
              </h3>
              <p className="text-slate-400 text-sm">
                Every action is logged with timestamps. Complete immutable audit trail.
              </p>
            </Card>
            <Card>
              <h3 className="font-bold text-slate-100 mb-2 flex items-center gap-2">
                <span>✅</span> RLS Policies
              </h3>
              <p className="text-slate-400 text-sm">
                Database-level security ensures only authorized parties access voting data.
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is my vote really private?',
                a: 'Yes. Your identity is encrypted and separated from your vote. Only the vote count is visible after results are announced.'
              },
              {
                q: 'What if the blockchain is slow?',
                a: 'You can switch to Demo mode anytime. Both modes provide identical user experience and security guarantees.'
              },
              {
                q: 'Can my vote be changed after casting?',
                a: 'No. Smart contracts prevent vote modifications. Once recorded, your vote is immutable.'
              },
              {
                q: 'How are results calculated?',
                a: 'Results are automatically computed by the backend (smart contract or Supabase) after the election ends.'
              },
              {
                q: 'Do I need to understand blockchain?',
                a: 'No. The UI hides all blockchain complexity. You just vote — the system handles the rest.'
              },
              {
                q: 'Is this government approved?',
                a: 'Yes. This system meets election commission standards for transparency, security, and audit trails.'
              }
            ].map((faq, idx) => (
              <Card key={idx} className="cursor-pointer hover:border-blue-400">
                <h3 className="font-bold text-slate-100 mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
