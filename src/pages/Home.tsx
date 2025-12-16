import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { adapterFactory } from '@/adapters/AdapterFactory'
import type { Election } from '@/adapters/IElectionAdapter'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const list = await adapterFactory.getElectionAdapter().listElections()
        if (mounted) setElections(list)
      } catch (e) {
        if (mounted) setError('Failed to load elections')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    const interval = setInterval(() => { load() }, 5000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Secure Voting.</span>
            <br />
            <span className="text-white">On the Blockchain.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Fast. Transparent. Immutable. Trusted by election commissions worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={() => navigate('/vote')}>
              Start Voting
            </Button>
            <Button variant="secondary" size="lg" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
              Learn More
            </Button>
          </div>
        </div>

        {/* Animated background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-500 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-slate-900 rounded-lg border border-slate-700 hover:border-yellow-400 transition-colors">
              <div className="text-4xl mb-3">🏛️</div>
              <div className="font-semibold text-slate-100">Government Approved</div>
            </div>
            <div className="text-center p-6 bg-slate-900 rounded-lg border border-slate-700 hover:border-yellow-400 transition-colors">
              <div className="text-4xl mb-3">🔐</div>
              <div className="font-semibold text-slate-100">ISO Certified</div>
            </div>
            <div className="text-center p-6 bg-slate-900 rounded-lg border border-slate-700 hover:border-yellow-400 transition-colors">
              <div className="text-4xl mb-3">💎</div>
              <div className="font-semibold text-slate-100">EVM Compatible</div>
            </div>
            <div className="text-center p-6 bg-slate-900 rounded-lg border border-slate-700 hover:border-yellow-400 transition-colors">
              <div className="text-4xl mb-3">✅</div>
              <div className="font-semibold text-slate-100">Audit Verified</div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg text-slate-300 italic">
              "Transparent. Secure. Immutable." — Election Commission
            </p>
          </div>
        </div>
      </section>

      {/* Elections Overview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Elections</h2>
          {loading && (
            <Card className="mb-6"><p className="text-slate-400">Loading elections…</p></Card>
          )}
          {error && (
            <Card className="mb-6 border-red-500/40"><p className="text-red-300">{error}</p></Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {elections.map((e) => (
              <Card key={e.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{e.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{e.description || '—'}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${
                    e.status === 'ONGOING' || e.status === 'PUBLISHED' ? 'border-green-500/40 text-green-300' :
                    e.status === 'ENDED' || e.status === 'ANNOUNCED' ? 'border-yellow-500/40 text-yellow-300' :
                    'border-slate-600 text-slate-300'
                  }`}>{e.status}</span>
                  <a href="/vote" className="text-blue-400 hover:text-blue-300 text-sm">Go Vote →</a>
                </div>
              </Card>
            ))}
            {(!loading && elections.length === 0) && (
              <Card><p className="text-slate-400">No elections yet. Create one in the Admin panel.</p></Card>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: 1, title: 'Register', desc: 'Verify your identity', icon: '👤' },
              { num: 2, title: 'Select', desc: 'Choose your candidate', icon: '✓' },
              { num: 3, title: 'Confirm', desc: 'Confirm your vote', icon: '👍' },
              { num: 4, title: 'Secure', desc: 'Recorded forever', icon: '🔗' }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <Card className="text-center h-full">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.desc}</p>
                </Card>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-2xl text-yellow-400">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-2xl font-bold mb-4">Blockchain-Backed</h3>
              <p className="text-slate-400">
                Every vote is recorded on a distributed ledger. Immutable. Auditable. Transparent.
              </p>
            </Card>
            <Card>
              <h3 className="text-2xl font-bold mb-4">Anonymous</h3>
              <p className="text-slate-400">
                Your identity stays private. Only vote counts are visible after announcement.
              </p>
            </Card>
            <Card>
              <h3 className="text-2xl font-bold mb-4">Instant Results</h3>
              <p className="text-slate-400">
                See results as they arrive in real-time. (Results announced after election ends)
              </p>
            </Card>
            <Card>
              <h3 className="text-2xl font-bold mb-4">Multi-Mode</h3>
              <p className="text-slate-400">
                Choose between Blockchain or Cloud Demo mode. Same UI, different backends.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Vote?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of users voting securely on the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={() => navigate('/vote')}>
              Vote Now
            </Button>
            <Button variant="secondary" size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
