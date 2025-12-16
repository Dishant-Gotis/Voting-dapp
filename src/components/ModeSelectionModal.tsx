import React, { useState } from 'react'
import { useVotingMode } from '../context/VotingContext'
import { Button, Modal } from './index'

/**
 * Mode Selection Modal
 * Shown on first visit to select between Blockchain and Demo modes
 */
export const ModeSelectionModal: React.FC = () => {
  const { showModeSelection, completeModeSelection } = useVotingMode()
  const [selectedMode, setSelectedMode] = useState<'BLOCKCHAIN' | 'DEMO' | null>(null)

  const handleContinue = () => {
    if (selectedMode) {
      completeModeSelection(selectedMode)
    }
  }

  return (
    <Modal
      isOpen={showModeSelection}
      onClose={() => {}}
      size="lg"
    >
      <div className="py-8">
        <h2 className="text-3xl font-bold text-center mb-4">Choose Your Voting Mode</h2>
        <p className="text-center text-slate-400 mb-12 max-w-md mx-auto">
          Select how you want to participate in voting. You can always switch later.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Blockchain Option */}
          <div
            onClick={() => setSelectedMode('BLOCKCHAIN')}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
              selectedMode === 'BLOCKCHAIN'
                ? 'border-yellow-400 bg-slate-800 ring-2 ring-yellow-400'
                : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
            }`}
          >
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-2xl font-bold mb-2">Blockchain Mode</h3>
            <p className="text-slate-400 mb-4 text-sm">
              Vote on the blockchain using MetaMask. Maximum transparency and immutability.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Decentralized & transparent</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Immutable voting record</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>MetaMask required</span>
              </div>
              <div className="flex gap-2">
                <span className="text-yellow-400">⚡</span>
                <span>5-15 seconds per vote</span>
              </div>
            </div>
          </div>

          {/* Demo Option */}
          <div
            onClick={() => setSelectedMode('DEMO')}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
              selectedMode === 'DEMO'
                ? 'border-blue-400 bg-slate-800 ring-2 ring-blue-400'
                : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
            }`}
          >
            <div className="text-5xl mb-4">🔄</div>
            <h3 className="text-2xl font-bold mb-2">Demo Mode</h3>
            <p className="text-slate-400 mb-4 text-sm">
              Test the voting system using our cloud backend. Perfect for testing without blockchain.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Instant results (&lt;1 second)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>No wallet required</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Same UI & experience</span>
              </div>
              <div className="flex gap-2">
                <span className="text-blue-400">💡</span>
                <span>Great for demos & testing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Note */}
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-8">
          <p className="text-sm text-slate-300 text-center">
            Both modes provide identical security & voting experience. The difference is in how votes are stored:
            <br />
            <span className="text-yellow-400 font-semibold">Blockchain</span> = distributed ledger, or
            <span className="text-blue-400 font-semibold"> Demo</span> = secure cloud backend.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            disabled={true}
          >
            Cancel (must select mode)
          </Button>
          <Button
            variant="primary"
            size="lg"
            disabled={!selectedMode}
            onClick={handleContinue}
          >
            Continue with {selectedMode === 'BLOCKCHAIN' ? '🔗 Blockchain' : '🔄 Demo'}
          </Button>
        </div>

        {/* Info Note */}
        <p className="text-center text-slate-400 text-xs mt-6">
          You can switch modes anytime from the mode toggle in the header.
        </p>
      </div>
    </Modal>
  )
}
