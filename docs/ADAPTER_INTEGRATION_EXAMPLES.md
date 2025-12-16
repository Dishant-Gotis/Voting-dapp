# Adapter Pattern - Integration Examples

## Quick Integration Guide

This guide shows how to integrate adapters into your components without ever branching on mode.

---

## Pattern 1: Simple Adapter Call

### ❌ Wrong Way (Mode-Aware UI)
```typescript
export const VotePage: React.FC = () => {
  const { mode } = useVotingMode()

  if (mode === 'BLOCKCHAIN') {
    return <BlockchainVoteUI />
  } else {
    return <DemoVoteUI />
  }
}
```

### ✅ Right Way (Mode-Agnostic UI)
```typescript
import { adapterFactory } from '../adapters'

export const VotePage: React.FC = () => {
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (partyId: string) => {
    setIsVoting(true)
    const votingAdapter = adapterFactory.getVotingAdapter()
    
    try {
      const result = await votingAdapter.castVote('election_1', partyId)
      if (result.success) {
        // Show success (same for both modes)
        setVoteResult(result)
      } else {
        alert(result.message)
      }
    } finally {
      setIsVoting(false)
    }
  }

  // Render same UI for both modes
  return (
    <div>
      <button onClick={() => handleVote('party_1')} disabled={isVoting}>
        {isVoting ? 'Voting...' : 'Cast Vote'}
      </button>
    </div>
  )
}
```

---

## Pattern 2: Mode Indicator (Optional)

If you **must** show which mode is active (for transparency), do it via label only, not UI change:

```typescript
import { useVotingMode } from '../context/VotingContext'

export const VoteConfirmation: React.FC<{ result: VoteResult }> = ({ result }) => {
  const { mode } = useVotingMode()

  return (
    <div className="success-card">
      <h2>✅ Vote Recorded</h2>
      
      {/* Mode label only, not conditional rendering */}
      <div className="mode-badge">
        Voted via: {mode === 'BLOCKCHAIN' ? '🔗 Blockchain' : '🔄 Demo'}
      </div>

      {/* Same confirmation UI for both */}
      <p>Vote ID: {result.voteId}</p>
      <p>Time: {new Date(result.timestamp).toLocaleString()}</p>

      {/* Conditional data display based on what proof was returned */}
      {result.transactionHash && (
        <p>Transaction: {result.transactionHash}</p>
      )}
      {result.proof?.certificateId && (
        <p>Certificate: {result.proof.certificateId}</p>
      )}
    </div>
  )
}
```

---

## Pattern 3: Async Data Fetching

### With Elections
```typescript
import { adapterFactory } from '../adapters'

export const ElectionsList: React.FC = () => {
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchElections = async () => {
      const electionAdapter = adapterFactory.getElectionAdapter()
      const data = await electionAdapter.listElections()
      setElections(data)
      setLoading(false)
    }

    fetchElections()
  }, [])

  if (loading) return <Spinner />

  return (
    <div>
      {elections.map(election => (
        <div key={election.id}>
          <h3>{election.title}</h3>
          <p>{election.description}</p>
          <p>Status: {election.status}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## Pattern 4: Mode Switching with State Persistence

### Complete Mode Toggle Component
```typescript
import { useVotingMode } from '../context/VotingContext'
import { adapterFactory } from '../adapters'

export const ModeToggle: React.FC = () => {
  const { mode, setMode } = useVotingMode()

  const handleModeChange = async (newMode: 'BLOCKCHAIN' | 'DEMO') => {
    // Adapter factory automatically syncs when context updates
    setMode(newMode)

    // Optional: Fetch fresh data for new mode
    const electionAdapter = adapterFactory.getElectionAdapter()
    const elections = await electionAdapter.listElections()
    
    // Update UI with new data
    setElections(elections)
  }

  return (
    <div className="mode-toggle">
      <button
        onClick={() => handleModeChange('BLOCKCHAIN')}
        className={mode === 'BLOCKCHAIN' ? 'active' : ''}
      >
        🔗 Blockchain
      </button>
      <button
        onClick={() => handleModeChange('DEMO')}
        className={mode === 'DEMO' ? 'active' : ''}
      >
        🔄 Demo
      </button>
    </div>
  )
}
```

---

## Pattern 5: Mode-Specific Adapter Access (Advanced)

Only use if you need mode-specific implementation details:

```typescript
import { adapterFactory } from '../adapters'

export const AdminDashboard: React.FC = () => {
  const handleMetaMaskConnect = async () => {
    // Get blockchain-specific adapter
    const blockchainAdapter = adapterFactory.getBlockchainVotingAdapter()
    
    // Call blockchain-only method
    blockchainAdapter.setWalletAddress(walletAddress)
  }

  const handleDemoSetup = async () => {
    // Get demo-specific adapter
    const demoAdapter = adapterFactory.getDemoVotingAdapter()
    
    // Call demo-only method
    demoAdapter.setUserId(userId)
  }

  return (
    // ... UI
  )
}
```

---

## Pattern 6: Error Handling (Mode-Agnostic)

```typescript
const handleVote = async (partyId: string) => {
  const votingAdapter = adapterFactory.getVotingAdapter()
  
  try {
    const result = await votingAdapter.castVote(electionId, partyId)
    
    if (!result.success) {
      // Show error message (same for both modes)
      showError(result.message)
      return
    }

    // Success handling (same for both modes)
    showSuccess('Vote recorded successfully!')
    navigate('/vote-confirmation', { state: { result } })

  } catch (error) {
    // Network or system error (same for both modes)
    showError('Failed to cast vote. Please try again.')
    console.error(error)
  }
}
```

---

## Pattern 7: Real-Time Updates

### Blockchain Mode (Event Listeners)
```typescript
export class BlockchainElectionAdapter implements IElectionAdapter {
  listenForVoteEvents(electionId: string, callback: (event: any) => void) {
    // Listen to smart contract events
    this.contract.on('VoteCasted', (voter, partyId, event) => {
      callback({ voter, partyId, blockNumber: event.blockNumber })
    })
  }
}
```

### Demo Mode (Supabase Realtime)
```typescript
export class DemoElectionAdapter implements IElectionAdapter {
  listenForVoteEvents(electionId: string, callback: (event: any) => void) {
    // Listen to Supabase realtime
    supabase
      .from('votes')
      .on('INSERT', payload => {
        callback({ voter: payload.new.voter_id, partyId: payload.new.party_id })
      })
      .subscribe()
  }
}
```

### Usage (Mode-Agnostic)
```typescript
export const LiveResults: React.FC<{ electionId: string }> = ({ electionId }) => {
  const [voteCount, setVoteCount] = useState(0)

  useEffect(() => {
    const electionAdapter = adapterFactory.getElectionAdapter()
    
    // Same code works for both blockchain and demo
    electionAdapter.listenForVoteEvents(electionId, (event) => {
      setVoteCount(prev => prev + 1)
    })
  }, [])

  return <div>Total votes: {voteCount}</div>
}
```

---

## Pattern 8: Conditional Proof Display

Return different proof fields based on mode, UI handles both:

```typescript
interface VoteResult {
  voteId: string
  success: boolean
  timestamp: number
  proof?: {
    merkleRoot?: string        // Blockchain only
    blockNumber?: number       // Blockchain only
    certificateId?: string     // Demo only
  }
  transactionHash?: string     // Blockchain only
}

// UI component handles both gracefully
export const VoteProof: React.FC<{ result: VoteResult }> = ({ result }) => {
  return (
    <div className="proof-display">
      <h3>Vote Proof</h3>
      <p>Vote ID: {result.voteId}</p>

      {/* Display whatever proof was returned */}
      {result.transactionHash && (
        <div>
          <strong>Transaction:</strong>
          <code>{result.transactionHash}</code>
        </div>
      )}

      {result.proof?.blockNumber && (
        <div>
          <strong>Block:</strong>
          <code>{result.proof.blockNumber}</code>
        </div>
      )}

      {result.proof?.certificateId && (
        <div>
          <strong>Certificate:</strong>
          <code>{result.proof.certificateId}</code>
        </div>
      )}
    </div>
  )
}
```

---

## Pattern 9: Form Submission (Admin)

```typescript
import { adapterFactory } from '../adapters'

export const CreateElectionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: 0,
    endTime: 0,
    electionType: 'GENERAL'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Get appropriate adapter (blockchain or demo)
    const electionAdapter = adapterFactory.getElectionAdapter()

    try {
      const election = await electionAdapter.createElection(formData)
      
      // Same success handling for both modes
      showSuccess(`Election "${election.title}" created`)
      navigate(`/elections/${election.id}`)

    } catch (error) {
      showError('Failed to create election')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Election Title"
      />
      {/* More form fields */}
      <button type="submit">Create Election</button>
    </form>
  )
}
```

---

## Pattern 10: Adapter Lifecycle

```typescript
// On App Load
export const App: React.FC = () => {
  useEffect(() => {
    // VotingContext automatically:
    // 1. Reads saved mode from sessionStorage
    // 2. Calls adapterFactory.setVotingMode()
    // All subsequent adapter calls use correct mode
  }, [])

  return <RootLayout />
}

// On Mode Switch (Header)
const switchMode = (newMode: 'BLOCKCHAIN' | 'DEMO') => {
  setMode(newMode) // Updates context + adapter factory
  // No reload needed, adapters switch instantly
}

// On Page Navigation
// Adapters persist across pages (singleton pattern)
// Mode selection doesn't change unless user clicks toggle

// On Tab Close
// Mode is lost (sessionStorage cleared on browser close)
// Next visit shows mode selection modal again
```

---

## Key Takeaways

✅ **Always use `adapterFactory.getAdapter()`** to get the mode-appropriate adapter  
✅ **Never branch UI based on `mode`** - only show UI, not logic  
✅ **All adapters return identical types** - UI doesn't need to know which backend  
✅ **Mode switching is instant** - no page reload, no data loss  
✅ **Testing is easy** - mock adapters, test UI once  

The UI code should never contain:
```typescript
// ❌ DON'T DO THIS
if (mode === 'BLOCKCHAIN') {
  // blockchain-specific UI
} else {
  // demo-specific UI
}
```

Always do this instead:
```typescript
// ✅ DO THIS
const adapter = adapterFactory.getVotingAdapter()
const result = await adapter.castVote(...)
// One UI component for all results
```
