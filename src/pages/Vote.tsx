import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { useVotingMode } from '@/context/VotingContext'
import { adapterFactory } from '@/adapters/AdapterFactory'

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
  
  const [selectedParty, setSelectedParty] = useState<Party | null>(null)
  const [voted, setVoted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voteResult, setVoteResult] = useState<any>(null)

  // Mock data
  const parties: Party[] = [
    { id: '1', name: 'Unity Party', emoji: '🔵', votes: 450000, percentage: 45 },
    { id: '2', name: 'Progress Alliance', emoji: '🟢', votes: 300000, percentage: 30 },
    { id: '3', name: 'Future Coalition', emoji: '🟡', votes: 250000, percentage: 25 }
  ]

  const handleVote = (party: Party) => {
    setSelectedParty(party)
    setShowConfirmation(true)
  }

  const confirmVote = async () => {
    if (!selectedParty) return

    setIsSubmitting(true)
    try {
      // Call adapter based on mode
      const result = await votingAdapter.castVote('election_1', selectedParty.id)
      console.log('Vote result:', result)
      setVoteResult(result)
      setVoted(true)
      setShowConfirmation(false)
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
