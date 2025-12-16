import React from 'react'
import { useVotingMode } from '../context/VotingContext'
import clsx from 'clsx'

interface ModeToggleProps {
  className?: string
  showLabel?: boolean
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ className, showLabel = true }) => {
  const { mode, setMode } = useVotingMode()

  return (
    <div className={clsx(
      'flex items-center gap-2 p-2 bg-slate-800 rounded-lg border border-slate-700',
      className
    )}>
      {showLabel && <span className="text-sm text-slate-400">Mode:</span>}
      <button
        onClick={() => setMode('BLOCKCHAIN')}
        className={clsx(
          'px-3 py-1 rounded text-sm font-medium transition-all duration-300',
          mode === 'BLOCKCHAIN'
            ? 'bg-yellow-400 text-slate-900'
            : 'text-slate-300 hover:text-white'
        )}
      >
        🔗 Blockchain
      </button>
      <button
        onClick={() => setMode('DEMO')}
        className={clsx(
          'px-3 py-1 rounded text-sm font-medium transition-all duration-300',
          mode === 'DEMO'
            ? 'bg-blue-400 text-slate-900'
            : 'text-slate-300 hover:text-white'
        )}
      >
        🔄 Demo
      </button>
    </div>
  )
}
