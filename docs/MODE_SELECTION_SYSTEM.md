# Mode Selection System - Complete Reference

## Overview

The mode selection system ensures users choose between Blockchain and Demo modes on their first visit, with seamless switching capabilities.

---

## Components

### 1. VotingContext (`src/context/VotingContext.tsx`)

**Purpose**: Global state management for voting mode

**State Variables**:
```typescript
mode: 'BLOCKCHAIN' | 'DEMO'           // Current voting mode
showModeSelection: boolean            // Show/hide mode modal
isFirstVisit: boolean                 // Track first-time visitors
```

**Key Functions**:

#### `setMode(mode: VotingMode): void`
Change the current voting mode and sync with adapter factory.

```typescript
const { setMode } = useVotingMode()
setMode('DEMO')
// Updates context, localStorage, and adapter factory
```

#### `completeModeSelection(mode: VotingMode): void`
Complete initial mode selection flow.

```typescript
const { completeModeSelection } = useVotingMode()
completeModeSelection('BLOCKCHAIN')
// Closes modal, marks as visited, syncs adapters
```

**Initialization Logic**:
```typescript
// Priority order for mode detection:
1. URL parameter (?mode=blockchain or ?mode=demo)
2. SessionStorage (user's current session choice)
3. Default: BLOCKCHAIN

// Show mode selection modal if:
1. First visit (no localStorage.visitedBefore)
2. AND no URL parameter override
```

---

### 2. ModeSelectionModal (`src/components/ModeSelectionModal.tsx`)

**Purpose**: Interactive mode selection interface shown on first visit

**Features**:
- Visual comparison of Blockchain vs Demo modes
- Feature lists for each option
- Cannot close without selecting (no cancel)
- Smooth transition to application after selection

**Props**: None (reads from context)

**Flow**:
```
Modal Appears (first visit)
  ↓
User Reviews Both Options
  ↓
User Clicks Option (toggles selection)
  ↓
User Clicks "Continue"
  ↓
completeModeSelection() called
  ↓
Modal Closes
  ↓
Adapters Sync
  ↓
UI Shows Selected Mode
```

**Styling**:
- Gold border for Blockchain (✨ premium)
- Blue border for Demo (💡 experimental)
- Detailed feature lists
- Comparison callout

---

### 3. ModeToggle (`src/components/ModeToggle.tsx`)

**Purpose**: Header-based mode switcher for returning users

**Features**:
- Always visible in header
- Quick toggle between modes
- Shows current active mode
- Optional label display
- No page reload on switch

**Usage**:
```typescript
// In header or navigation
<ModeToggle showLabel={true} />
```

**UI States**:
- Active mode: Gold/Blue background highlight
- Inactive mode: Muted, clickable
- Hover effect on inactive mode

---

## User Flows

### Flow 1: First-Time Visitor

```
1. User visits app.voting-dapp.com
   ↓
2. App loads, VotingContext initializes
   ↓
3. Context checks:
   - localStorage.visitedBefore? → No
   - ?mode=... in URL? → No
   ↓
4. showModeSelection = true
   ↓
5. ModeSelectionModal renders
   ↓
6. User Reviews:
   - 🔗 Blockchain: Immutable, MetaMask required, 5-15s
   - 🔄 Demo: Instant, no setup, cloud backend
   ↓
7. User Clicks Option (selects one)
   ↓
8. User Clicks "Continue"
   ↓
9. completeModeSelection('BLOCKCHAIN' or 'DEMO')
   ↓
10. localStorage.visitedBefore = 'true'
    sessionStorage.votingMode = selected mode
    adapterFactory.setVotingMode(selected)
   ↓
11. Modal closes, homepage appears
   ↓
12. User sees mode toggle in header
```

### Flow 2: Returning Visitor (Same Session)

```
1. User already on voting-dapp.com
   ↓
2. App loads, VotingContext initializes
   ↓
3. Context reads sessionStorage.votingMode
   ↓
4. Mode auto-loaded
   ↓
5. showModeSelection = false
   ↓
6. No modal, user sees homepage
   ↓
7. Adapters use saved mode
```

### Flow 3: Returning Visitor (New Session/Tab)

```
1. User opens new tab to voting-dapp.com
   ↓
2. App loads, VotingContext initializes
   ↓
3. Context checks:
   - sessionStorage empty (new session)
   - localStorage.visitedBefore = 'true'
   ↓
4. showModeSelection = false
   ↓
5. Default mode: BLOCKCHAIN
   ↓
6. User sees homepage, can toggle mode in header
```

### Flow 4: Direct URL Override

```
1. User visits app.voting-dapp.com?mode=demo
   ↓
2. App loads, VotingContext initializes
   ↓
3. Context detects URL param
   ↓
4. Mode forced to DEMO
   ↓
5. showModeSelection = false (URL param overrides)
   ↓
6. No modal shown
   ↓
7. Adapters use DEMO mode
```

### Flow 5: Mode Switching (Via Header)

```
User on Homepage (Blockchain Mode)
  ↓
User Clicks Mode Toggle → Demo
  ↓
setMode('DEMO') called
  ↓
Context updates state
adapterFactory.setVotingMode('DEMO')
sessionStorage updated
  ↓
Component re-renders (if mode is read)
  ↓
Next adapter call uses DEMO adapter
  ↓
No page reload, no data loss
  ↓
UI visually identical (only backend changed)
```

---

## Storage Mechanism

### localStorage (Persistent Across Sessions)
```javascript
localStorage.visitedBefore = 'true'
// Set on: First mode selection completion
// Used for: Determining if mode selection modal should show
// Cleared on: User explicitly clears browser storage
```

### sessionStorage (Session-Specific)
```javascript
sessionStorage.votingMode = 'BLOCKCHAIN' | 'DEMO'
// Set on: Mode change (initial selection or toggle)
// Used for: Remembering mode within same session/tab
// Cleared on: Browser tab closed or storage cleared
```

### URL Parameters (Highest Priority)
```
?mode=blockchain → Force Blockchain mode
?mode=demo       → Force Demo mode
// Overrides saved preferences
// Useful for: Sharing links to specific mode
// No modal shown when URL param present
```

---

## Integration Points

### 1. App Initialization

In `App.tsx`:
```typescript
<VotingProvider>
  <Router>
    <ModeSelectionModal />  {/* Shows on first visit */}
    <Header />              {/* Contains ModeToggle */}
    <Routes>
      {/* Pages use adapterFactory */}
    </Routes>
  </Router>
</VotingProvider>
```

### 2. Component Usage

In any page or component:
```typescript
import { useVotingMode } from '../context/VotingContext'

const MyComponent = () => {
  const { mode, setMode } = useVotingMode()

  // Read current mode
  console.log(mode) // 'BLOCKCHAIN' or 'DEMO'

  // Change mode (if needed in component)
  setMode('DEMO')

  // Use adapters
  const adapter = adapterFactory.getVotingAdapter()
  await adapter.castVote(...)
}
```

### 3. Adapter Factory Sync

```typescript
// When setMode() is called:
1. Update React state
2. Call adapterFactory.setVotingMode(newMode)
3. Save to sessionStorage
4. Component re-renders

// All subsequent adapter.method() calls use new mode
```

---

## Configuration

### Default Mode
```typescript
// In VotingContext initialization
const [mode, setModeState] = useState<VotingMode>(() => {
  // ... checks ...
  return 'BLOCKCHAIN'  // Default if no preference
})
```

### First Visit Detection
```typescript
const [showModeSelection] = useState<boolean>(() => {
  const hasVisited = localStorage.getItem('visitedBefore')
  const hasUrlParam = new URLSearchParams(...).get('mode')
  return !hasVisited && !hasUrlParam
})
```

### Session Duration
SessionStorage is cleared when:
- Browser tab is closed
- Browser is closed
- User clears site storage
- 24 hours pass (browser-dependent)

---

## Common Scenarios

### Scenario 1: Multiple Tabs

```
Tab 1: blockchain mode (selected at init)
  ↓
Tab 2: opens voting-dapp.com
  ↓
Tab 2 reads sessionStorage
  ↓
sessionStorage is per-origin, shared across tabs
  ↓
Tab 2 gets "blockchain mode"
  ↓
Both tabs use same mode

If user switches in Tab 1:
Tab 1: setMode('DEMO')
  ↓
sessionStorage.votingMode = 'DEMO'
  ↓
Tab 2 may need refresh to sync
  ↓
Use BroadcastChannel for cross-tab sync (future)
```

### Scenario 2: Guest vs Registered Users

**Guest (No Account):**
- Mode selection shown on first visit
- Mode stored in sessionStorage
- Lost on tab close

**Registered (Has Account):**
- Mode could be stored in user profile
- Synced from backend on login
- Persists across devices

**Implementation:**
```typescript
useEffect(() => {
  if (user && user.preferredMode) {
    setMode(user.preferredMode)
  }
}, [user])
```

### Scenario 3: Admin vs Voter

**Voter Path:**
1. Mode selection modal
2. Vote page
3. View results

**Admin Path:**
1. CAPTCHA verification
2. Wallet/Login
3. Admin dashboard
4. Both modes available (admin can test both)

---

## Error Handling

### Adapter Mismatch
If adapter is missing a method:
```typescript
try {
  const result = await votingAdapter.castVote(...)
} catch (error) {
  if (error.name === 'NotImplementedError') {
    console.error('This method not available in current mode')
  }
}
```

### Mode Initialization Failure
```typescript
// If adapterFactory.setVotingMode() fails
// Show error and fallback to default
if (!adapterFactory.getVotingMode()) {
  console.warn('Adapter init failed, using default')
  adapterFactory.setVotingMode('BLOCKCHAIN')
}
```

---

## Testing

### Unit Test: VotingContext
```typescript
it('should load saved mode from sessionStorage', () => {
  sessionStorage.setItem('votingMode', 'DEMO')
  const { mode } = renderHook(() => useVotingMode())
  expect(mode).toBe('DEMO')
})

it('should show modal on first visit', () => {
  localStorage.removeItem('visitedBefore')
  const { showModeSelection } = renderHook(() => useVotingMode())
  expect(showModeSelection).toBe(true)
})

it('should hide modal on returning visit', () => {
  localStorage.setItem('visitedBefore', 'true')
  const { showModeSelection } = renderHook(() => useVotingMode())
  expect(showModeSelection).toBe(false)
})
```

### Integration Test: Mode Switching
```typescript
it('should switch adapters on mode change', async () => {
  const { setMode } = renderHook(() => useVotingMode())
  
  setMode('BLOCKCHAIN')
  let adapter = adapterFactory.getVotingAdapter()
  expect(adapter).toBeInstanceOf(BlockchainVotingAdapter)
  
  setMode('DEMO')
  adapter = adapterFactory.getVotingAdapter()
  expect(adapter).toBeInstanceOf(DemoVotingAdapter)
})
```

---

## Security Considerations

### No Sensitive Data in Storage
```typescript
// ❌ DON'T store in sessionStorage
sessionStorage.setItem('userToken', token)
sessionStorage.setItem('privateKey', key)

// ✅ Only store mode selection
sessionStorage.setItem('votingMode', mode)
```

### XSS Protection
Mode selection is safe:
- No user input in mode name
- Values hardcoded: 'BLOCKCHAIN' or 'DEMO'
- No eval() or dynamic code generation

### CSRF Protection
Each adapter should implement CSRF tokens for backend calls:
```typescript
// In adapter methods
const headers = {
  'X-CSRF-Token': await getCsrfToken(),
  ...
}
```

---

## Best Practices

✅ **Always use context to read/set mode**
```typescript
const { mode, setMode } = useVotingMode()
```

✅ **Always use adapterFactory for adapter access**
```typescript
const adapter = adapterFactory.getVotingAdapter()
```

✅ **Store mode in sessionStorage, not component state**
```typescript
sessionStorage.setItem('votingMode', mode)
```

✅ **Let VotingContext manage modal visibility**
```typescript
// Don't manually control showModeSelection elsewhere
```

❌ **Don't hardcode mode selection**
```typescript
// Don't do this
if (isElectionPage) {
  setMode('BLOCKCHAIN')
}
```

❌ **Don't store sensitive data with mode**
```typescript
// Don't do this
sessionStorage.setItem('votingMode', JSON.stringify({
  mode: 'BLOCKCHAIN',
  userToken: token  // ❌ Security risk!
}))
```

---

## Future Enhancements

1. **Cross-Tab Sync**
   - Use BroadcastChannel API
   - When mode changes in Tab 1, sync to Tab 2
   
2. **Backend-Stored Preference**
   - Save mode in user profile
   - Load on login
   - Sync across devices

3. **Adaptive Mode Selection**
   - Auto-detect MetaMask installed
   - Suggest Blockchain if available
   - Suggest Demo if no MetaMask

4. **Mode Reporting**
   - Analytics: Track which mode users prefer
   - A/B testing: Compare user metrics per mode

5. **Forced Mode (Admin)**
   - Admin setting: Force all users to one mode
   - Override individual preferences
   - Useful for elections requiring blockchain

---

## Quick Reference

| Aspect | Detail |
|--------|--------|
| **Initial Mode** | BLOCKCHAIN (default) |
| **First Visit** | Show ModeSelectionModal |
| **Returning Visit** | Load from sessionStorage |
| **URL Override** | ?mode=demo or ?mode=blockchain |
| **Mode Persistence** | sessionStorage (cleared on tab close) |
| **Visit Flag** | localStorage.visitedBefore |
| **Adapter Sync** | Automatic via context |
| **UI Branch** | Never branch on mode |
| **Logic Branch** | Only in adapter factory |
