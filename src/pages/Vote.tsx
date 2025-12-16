import React, { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { useVotingMode } from '@/context/VotingContext'
import { adapterFactory } from '@/adapters/AdapterFactory'
import { getElectionWithParties, getElectionResults } from '@/services/supabaseClient'

interface Party {
  id: string
  name: string
  emoji: string
  votes: number
  percentage: number
}

export const VotePage: React.FC = () => {
  const { mode } = useVotingMode()
  const votingAdapter = adapterFactory.getVotingAdapter()
  const electionAdapter = adapterFactory.getElectionAdapter()
  
  const [selectedParty, setSelectedParty] = useState<Party | null>(null)
  const [voted, setVoted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voteResult, setVoteResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [electionId, setElectionId] = useState<string | null>(null)
  const [parties, setParties] = useState<Party[]>([])

  // On first load, fetch active election and parties from backend (Supabase in DEMO)
  useEffect(() => {
    let mounted = true

    async function bootstrap() {
      try {
        setIsLoading(true)
        setLoadError(null)

        // Ensure demo identity in DEMO mode (wallet + user id for adapter)
        if (mode === 'DEMO') {
          const demo = adapterFactory.getDemoVotingAdapter()
          const existingWallet = demo.getWalletAddress()
          const existingUser = demo.getUserId()
          if (!existingWallet) demo.setWalletAddress('0xDEMO000000000000000000000000000000000001')
          if (!existingUser) demo.setUserId(`demo_${Date.now()}`)
        }

        // Pick the most recent ACTIVE election; if none, fall back to latest
        const elections = await electionAdapter.listElections()
        const active = elections.find((e: any) => (e.status === 'ACTIVE' || e.status === 'ONGOING'))
        const chosen = active || elections[0]
        if (!chosen) {
          throw new Error('No elections found. Please create one from Admin.')
        }
        if (!mounted) return
        setElectionId(chosen.id)

        // Fetch election with parties
        const updateFromBackend = async () => {
          const ep = await getElectionWithParties(chosen.id)
          if (!ep) return
          const resultsMap = await getElectionResults(chosen.id)
          const totalVotes = Object.values(resultsMap).reduce((a: number, b: any) => a + (b as number), 0)
          const mapped: Party[] = (ep.parties || []).map((p: any) => {
            const count = (resultsMap as any)[p.id] || 0
            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
            return { id: p.id, name: p.name, emoji: '🗳️', votes: count, percentage: pct }
          })
          if (mounted) setParties(mapped)
        }

        await updateFromBackend()
        // Lightweight polling for realtime feel
        const interval = setInterval(updateFromBackend, 2500)
        return () => clearInterval(interval)
      } catch (err) {
        if (mounted) setLoadError(err instanceof Error ? err.message : 'Failed to load election')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    const cleanup = bootstrap()
    return () => { mounted = false; (async () => { const c = await cleanup; if (typeof c === 'function') c() })() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const handleVote = (party: Party) => {
    setSelectedParty(party)
    setShowConfirmation(true)
  }

  const confirmVote = async () => {
    if (!selectedParty) return

    setIsSubmitting(true)
    try {
      // Call adapter based on mode
      if (!electionId) throw new Error('Election not loaded')
      const result = await votingAdapter.castVote(electionId, selectedParty.id)
      console.log('Vote result:', result)
      setVoteResult(result)
      setVoted(true)
      setShowConfirmation(false)
      // trigger a quick refresh to reflect new totals
      // state polling above will also catch it
    } catch (error) {
      console.error('Error casting vote:', error)
      alert('Failed to cast vote. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (voted) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-4xl font-bold mb-4 text-green-400">Vote Recorded!</h1>
            <p className="text-xl text-slate-300 mb-6">
              Your vote for <span className="font-bold text-yellow-400">{selectedParty?.name}</span> is safely recorded.
            </p>
            <div className="bg-slate-800 rounded-lg p-6 mb-8 text-left space-y-3">
              <div>
                <span className="text-slate-400">Vote ID:</span>
                <p className="font-mono text-sm text-slate-200 break-all">{voteResult?.voteId}</p>
              </div>
              {mode === 'BLOCKCHAIN' && voteResult?.transactionHash && (
                <>
                  <div>
                    <span className="text-slate-400">Transaction Hash:</span>
                    <p className="font-mono text-sm text-slate-200 break-all">{voteResult.transactionHash}</p>
                  </div>
                  {voteResult?.proof?.blockNumber && (
                    <div>
                      <span className="text-slate-400">Block:</span>
                      <p className="font-mono text-sm text-slate-200">{voteResult.proof.blockNumber}</p>
                    </div>
                  )}
                </>
              )}
              {mode === 'DEMO' && voteResult?.proof?.certificateId && (
                <div>
                  <span className="text-slate-400">Certificate ID:</span>
                  <p className="font-mono text-sm text-slate-200 break-all">{voteResult.proof.certificateId}</p>
                </div>
              )}
              <div>
                <span className="text-slate-400">Time:</span>
                <p className="text-slate-200">{new Date(voteResult?.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Voted via: <span className="font-semibold text-slate-300">
                {mode === 'BLOCKCHAIN' ? '🔗 Blockchain' : '🔄 Demo'}
              </span>
            </p>
            <div className="flex gap-4">
              <Button variant="primary">
                View Proof
              </Button>
              <Button variant="secondary">
                Return Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Load state / errors */}
        {isLoading && (
          <Card className="mb-8">
            <p className="text-slate-400">Loading election…</p>
          </Card>
        )}
        {loadError && (
          <Card className="mb-8 border-red-500/40">
            <p className="text-red-300">{loadError}</p>
          </Card>
        )}
        {/* Election Header */}
        <Card className="mb-8 border-yellow-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">2024 General Elections</h2>
              <p className="text-slate-400">Active now • Status: Ongoing</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400">1.2M</div>
              <div className="text-slate-400">Total Votes Cast</div>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-semibold mb-2">✅ Eligible</div>
              <div className="text-slate-400">⏱️ Ends in 2d 14h</div>
            </div>
          </div>
        </Card>

        {/* Wallet Status / Demo Mode Notice */}
        {mode === 'BLOCKCHAIN' && (
          <Card className="mb-8 border-blue-400">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-100 mb-2">🟢 Connected to MetaMask</h3>
                <p className="text-slate-400 font-mono text-sm">0x1234...5678</p>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-sm">Balance</div>
                <div className="text-lg font-bold">0.5 ETH</div>
              </div>
            </div>
          </Card>
        )}

        {mode === 'DEMO' && (
          <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <p className="text-blue-300 text-sm">
              ℹ️ <span className="font-semibold">Demo Mode</span> - This is a simulation for testing purposes. Votes are stored securely in our cloud backend with identical guarantees as blockchain voting.
            </p>
          </div>
        )}

        {/* Parties Grid */}
        <h2 className="text-3xl font-bold mb-8">Cast Your Vote</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {parties.map((party) => (
            <Card
              key={party.id}
              className={`text-center transition-all duration-300 cursor-pointer ${
                selectedParty?.id === party.id
                  ? 'border-green-400 ring-2 ring-green-400'
                  : ''
              }`}
              onClick={() => handleVote(party)}
            >
              <div className="text-6xl mb-4">{party.emoji}</div>
              <h3 className="text-2xl font-bold mb-4">{party.name}</h3>
              <div className="mb-6">
                <div className="text-3xl font-bold text-yellow-400">{party.votes.toLocaleString()}</div>
                <div className="text-slate-400">{party.percentage}% of votes</div>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  handleVote(party)
                }}
              >
                Vote for {party.name}
              </Button>
            </Card>
          ))}
        </div>

        {/* Status */}
        {!selectedParty && (
          <Card className="text-center">
            <p className="text-slate-400">👆 Select a party above to cast your vote</p>
          </Card>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Your Vote"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmVote}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Confirm & Submit
            </Button>
          </>
        }
      >
        {selectedParty && (
          <div className="text-center py-6">
            <div className="text-6xl mb-4">{selectedParty.emoji}</div>
            <p className="text-slate-300 mb-4">
              You are about to vote for
            </p>
            <h3 className="text-3xl font-bold text-yellow-400 mb-4">
              {selectedParty.name}
            </h3>
            <div className="bg-slate-800 rounded-lg p-4 mb-4">
              <p className="text-slate-400 text-sm">
                Once submitted, your vote cannot be changed. Please review your selection.
              </p>
            </div>
            <p className="text-slate-400 text-sm">
              This will be submitted to the {mode === 'BLOCKCHAIN' ? '🔗 blockchain' : '🔄 secure backend'}.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
