import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { adapterFactory, type VotingMode } from '@/adapters/AdapterFactory'

interface VotingContextType {
  mode: VotingMode
  setMode: (mode: VotingMode) => void
  showModeSelection: boolean
  setShowModeSelection: (show: boolean) => void
  completeModeSelection: (mode: VotingMode) => void
  isFirstVisit: boolean
}

const VotingContext = createContext<VotingContextType | undefined>(undefined)

export const VotingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<VotingMode>(() => {
    // Check URL params first (highest priority)
    const params = new URLSearchParams(window.location.search)
    const urlMode = params.get('mode')
    if (urlMode === 'demo') return 'DEMO'
    if (urlMode === 'blockchain') return 'BLOCKCHAIN'

    // Check sessionStorage (user's current session preference)
    const savedMode = sessionStorage.getItem('votingMode') as VotingMode | null
    if (savedMode) return savedMode

    // Default to BLOCKCHAIN
    return 'BLOCKCHAIN'
  })

  const [showModeSelection, setShowModeSelection] = useState<boolean>(() => {
    // Show mode selection if first visit and no URL param
    const params = new URLSearchParams(window.location.search)
    const urlMode = params.get('mode')
    const hasVisited = localStorage.getItem('visitedBefore')

    if (urlMode) return false // URL param overrides mode selection
    if (hasVisited) return false // Already visited, don't show again
    return true // First visit, show mode selection
  })

  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return !localStorage.getItem('visitedBefore')
  })

  /**
   * Update mode and sync with adapter factory
   */
  const setMode = useCallback((newMode: VotingMode) => {
    setModeState(newMode)
    adapterFactory.setVotingMode(newMode)
    sessionStorage.setItem('votingMode', newMode)
    console.log(`[VotingContext] Mode changed to: ${newMode}`)
  }, [])

  /**
   * Complete mode selection flow
   */
  const completeModeSelection = useCallback((selectedMode: VotingMode) => {
    setMode(selectedMode)
    setShowModeSelection(false)
    localStorage.setItem('visitedBefore', 'true')
    setIsFirstVisit(false)
  }, [setMode])

  // Sync initial mode with adapter factory
  useEffect(() => {
    adapterFactory.setVotingMode(mode)
  }, [])

  return (
    <VotingContext.Provider
      value={{
        mode,
        setMode,
        showModeSelection,
        setShowModeSelection,
        completeModeSelection,
        isFirstVisit
      }}
    >
      {children}
    </VotingContext.Provider>
  )
}

export const useVotingMode = () => {
  const context = useContext(VotingContext)
  if (!context) {
    throw new Error('useVotingMode must be used within VotingProvider')
  }
  return context
}
