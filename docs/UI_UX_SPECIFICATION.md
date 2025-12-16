# Frontend UI/UX Specification – Government Blockchain Theme

## 1. Design System Overview

### Color Palette

#### Primary Colors
- **Deep Navy Blue**: `#0A1f3F` - Government authority, trust
- **Blockchain Gold**: `#FFD700` - Premium, secure, valuable
- **Electric Blue**: `#00D9FF` - Tech-forward, transparency
- **Accent Green**: `#10B981` - Success, validation, completeness
- **Warning Red**: `#EF4444` - Alerts, critical actions

#### Neutral Colors
- **Dark Background**: `#0D1117` - Main dark surface
- **Card Background**: `#1C2333` - Elevated surface
- **Border Color**: `#30363D` - Subtle dividers
- **Text Primary**: `#E6EDF3` - Main text
- **Text Secondary**: `#8B949E` - Muted text
- **Text Tertiary**: `#6E7681` - Minimal contrast

#### Accent Backgrounds
- **Success Bg**: `rgba(16, 185, 129, 0.1)` - Light green overlay
- **Error Bg**: `rgba(239, 68, 68, 0.1)` - Light red overlay
- **Info Bg**: `rgba(59, 130, 246, 0.1)` - Light blue overlay

### Typography

#### Font Stack
```css
font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
```

#### Scale
- **Heading 1** (H1): 48px, weight 700, line-height 1.2
- **Heading 2** (H2): 36px, weight 700, line-height 1.3
- **Heading 3** (H3): 28px, weight 600, line-height 1.4
- **Body Large**: 16px, weight 400, line-height 1.6
- **Body Regular**: 14px, weight 400, line-height 1.5
- **Body Small**: 12px, weight 400, line-height 1.4
- **Label**: 12px, weight 600, letter-spacing 0.5px

### Spacing Scale
```
0.25rem (4px)
0.5rem (8px)
0.75rem (12px)
1rem (16px)
1.5rem (24px)
2rem (32px)
3rem (48px)
4rem (64px)
6rem (96px)
```

### Border Radius
- **Sharp**: 2px
- **Subtle**: 4px
- **Rounded**: 8px
- **Smooth**: 12px
- **Pill**: 9999px

### Shadows
```css
Shadow 1 (Subtle):
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

Shadow 2 (Elevated):
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

Shadow 3 (Modal):
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.5);

Glow Effect (Blockchain):
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
```

### Interactive Elements

#### Button States
- **Default**: Navy background, gold border (1px)
- **Hover**: Bright electric blue background, gold glow
- **Active/Pressed**: Deep navy with increased glow
- **Disabled**: Gray text, 50% opacity
- **Loading**: Spinning blockchain icon inside

#### Link States
- **Default**: Electric blue text, underline
- **Hover**: Gold underline, slight scale up
- **Active**: Gold text
- **Visited**: Muted blue

#### Form Inputs
- **Default**: Border in `#30363D`, text in light gray
- **Focus**: Border in electric blue (2px), subtle glow
- **Filled**: Border in gold on focus exit
- **Error**: Border in red, error message below
- **Disabled**: Opacity 50%, cursor not-allowed

### Animations & Transitions

#### Standard Easing
```css
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
ease-out: cubic-bezier(0, 0, 0.2, 1);
ease-in: cubic-bezier(0.4, 0, 1, 1);
```

#### Timing
- **Quick interactions**: 150ms
- **Standard transitions**: 300ms
- **Complex animations**: 500ms

#### Hover Effects
- **Scale**: 1.02 (buttons, cards)
- **Glow**: 0 0 20px rgba(0, 217, 255, 0.4)
- **Shadow elevation**: Increase shadow by 1 level

#### Loading States
- **Spinner**: Rotating blockchain icon, 1.5s rotation
- **Skeleton**: Pulsing gray blocks at 1.5s opacity cycle
- **Progress bar**: Animated width, segmented blockchain blocks

### Cursor Responsiveness

#### Custom Cursor System
```
Default: Standard arrow with blockchain icon trailing effect
Hoverable: Blue glow circle (20px radius) following cursor
Clickable: Gold ring + inner crosshair, slight delay (50ms)
Loading: Spinning blockchain cube
Disabled: No-entry symbol
Text: Text selection cursor
```

#### Trail Effects
- **Hover Trail**: 3-4 trailing blockchain blocks behind cursor
- **Click Ripple**: Electric blue ripple expanding from click point (300ms)
- **Drag Effect**: If dragging, show hand cursor + gold outline

---

## 2. Page Specifications

### 2.1 HOME PAGE

#### Purpose
First impression, clear CTAs, trust signals, blockchain branding

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER / NAV                         │
├─────────────────────────────────────────────────────────────┤
│                     HERO SECTION                            │
│  - Main headline + subheading                               │
│  - Two large CTA buttons (Voting / Demo-Voting)            │
│  - Animated blockchain background                          │
├─────────────────────────────────────────────────────────────┤
│                   TRUST INDICATORS                          │
│  - Cert badges, gov seal, blockchain icons                │
│  - Quote: "Transparent. Secure. Immutable."                │
├─────────────────────────────────────────────────────────────┤
│                  HOW IT WORKS SECTION                       │
│  - 4-step visual process (with icons)                      │
│  - Brief descriptions                                       │
├─────────────────────────────────────────────────────────────┤
│                   FEATURES SECTION                          │
│  - Grid: 3 cols (Blockchain | Anonymous | Instant)        │
│  - Icons + descriptions                                     │
├─────────────────────────────────────────────────────────────┤
│                   CALL-TO-ACTION SECTION                    │
│  - "Ready to Vote?" + CTA buttons                          │
│  - Mode selection prominence                               │
├─────────────────────────────────────────────────────────────┤
│                      FOOTER                                 │
│  - Links, copyright, social                                │
└─────────────────────────────────────────────────────────────┘
```

#### Components

##### Header / Navigation
```
┌──────────────────────────────────────────────────────┐
│ [🔗 VOTING DAPP]    [Home] [About] [Vote] [Admin]   │
│                                        [Mode Toggle] │
└──────────────────────────────────────────────────────┘
```
- Logo: Blockchain + voting icon
- Nav links: Simple, spaced
- Mode toggle: Blockchain ⚡ | Demo 🔄 (top-right)
- Sticky: Yes (background blur on scroll)
- Mobile: Hamburger menu

##### Hero Section
```
┌─────────────────────────────────────────────────────┐
│   SECURE VOTING.                                    │
│   ON THE BLOCKCHAIN.                                │
│                                                     │
│   Fast. Transparent. Immutable. Trusted by          │
│   Election Commissions worldwide.                   │
│                                                     │
│   [START VOTING] [LEARN MORE]                       │
│                                                     │
│   (Animated blockchain grid background, floating)  │
└─────────────────────────────────────────────────────┘
```
- Headline: 48px, bold, navy + gold accent
- Subheading: 20px, muted, soft tone
- CTA buttons: Large, full-width on mobile, side-by-side on desktop
- Background: Animated blockchain grid (low opacity, slow movement)

##### Trust Indicators
```
┌────────────┬────────────┬────────────┬────────────┐
│ 🏛️ Gov    │ 🔐 ISO     │ 💎 EVM     │ ✅ Audit   │
│ Approved   │ Certified  │ Compatible │ Verified   │
└────────────┴────────────┴────────────┴────────────┘

"Transparent. Secure. Immutable." - Election Commission
```
- Grid layout, 4 items
- Icons + labels
- Subtle background color blocks
- Desktop: 4 cols, Mobile: 2 cols

##### How It Works
```
Step 1: Register          Step 2: Select Party
   ⬇️                          ⬇️
Verify your identity  →  Choose your candidate

   Step 3: Confirm            Step 4: Secure
      ⬇️                          ⬇️
  Confirm vote       →   Vote recorded forever
```
- 4 cards, vertical on mobile, horizontal on desktop
- Icons: Custom (person → checkbox → thumbs-up → blockchain)
- Connectors: Arrow lines between steps
- Hover: Card glows, icon animates

##### Features Grid
```
┌─────────────────────────────────────────────┐
│ Blockchain-Backed              Anonymous    │
│ Every vote on a distributed  Your identity │
│ ledger. Immutable. Auditable. stays private│
│                                            │
│ Instant Results             Multi-Mode     │
│ See results as they arrive. Blockchain or  │
│ Real-time transparency.     cloud, you     │
│ (after announcement)        choose.        │
└─────────────────────────────────────────────┘
```
- 2x2 grid
- Cards: Navy background, gold border on hover
- Icons: Blockchain symbols
- Mobile: Single column

##### Footer
```
┌─────────────────────────────────────────────┐
│ VOTING DAPP © 2025                          │
│                                             │
│ [Home] [About] [Privacy] [Terms]            │
│                                             │
│ Follow: [Twitter] [GitHub] [Email]          │
└─────────────────────────────────────────────┘
```
- Links, copyright, social icons
- Dark background, muted text
- Responsive: Vertical stack on mobile

---

### 2.2 ABOUT PAGE

#### Purpose
Educate users on voting mechanics and system architecture in simple terms

#### Layout
```
┌─────────────────────────────────────────────┐
│            PAGE HEADER                      │
│   "About Voting DAPP"                       │
│   Subtitle: How it works, what's inside     │
├─────────────────────────────────────────────┤
│          SECTION 1: THE PROBLEM              │
│   Traditional voting has trust gaps.        │
│   (3 bullet points)                         │
├─────────────────────────────────────────────┤
│       SECTION 2: HOW BLOCKCHAIN WORKS        │
│   • Distributed ledger                      │
│   • Immutable records                       │
│   • Transparent verification                │
│   (With diagram/visual)                     │
├─────────────────────────────────────────────┤
│      SECTION 3: VOTING PROCESS EXPLAINED     │
│   (6-step visual flow)                      │
├─────────────────────────────────────────────┤
│   SECTION 4: BLOCKCHAIN vs DEMO MODE        │
│   (Comparison table)                        │
├─────────────────────────────────────────────┤
│         SECTION 5: SECURITY & TRUST         │
│   Audit trails, encryption, RLS policies    │
├─────────────────────────────────────────────┤
│               FAQ SECTION                   │
│   Collapsible Q&A items                     │
└─────────────────────────────────────────────┘
```

#### Key Sections

##### How Blockchain Works (Simplified)
```
┌─────────────────┐
│  Your Vote 📮   │
│   Sent → Hash   │
└────────┬────────┘
         ⬇️
┌─────────────────┐
│  Smart Contract │
│  Validates      │
└────────┬────────┘
         ⬇️
┌─────────────────┐
│  Block Added 🔗 │
│  Immutable      │
└────────┬────────┘
         ⬇️
┌─────────────────┐
│  Network Spread │
│  Confirmed      │
└─────────────────┘
```

##### Blockchain vs Demo Mode
```
┌─────────────────────────────────────────┐
│          │  BLOCKCHAIN MODE │ DEMO MODE  │
├──────────┼──────────────────┼────────────┤
│ Backend  │  Smart Contracts │ Supabase   │
│ Setup    │  MetaMask        │ DB         │
│ Speed    │  5-15 sec        │ <1 sec     │
│ Cost     │  Gas fee         │ Free       │
│ Proof    │  Transaction     │ Cert       │
│ Use      │  Production      │ Testing    │
└─────────────────────────────────────────┘
```

##### FAQ (Collapsible)
```
Q: Is my vote really private?
A: Yes, your identity is encrypted. Only vote count visible.

Q: What if blockchain is slow?
A: You can switch to Demo mode anytime.

Q: Can votes be changed after casting?
A: No. Smart contracts prevent modifications.

Q: How are results calculated?
A: Automatically at election end (backend-only).
```

---

### 2.3 VOTE PAGE

#### Purpose
Main voting interface, professional & trustworthy

#### Layout (Pre-Vote)
```
┌────────────────────────────────────────┐
│      HEADER: ELECTION DETAILS           │
│  "2024 General Elections"               │
│  "Time remaining: 2 days 14 hours"     │
├────────────────────────────────────────┤
│      WALLET CONNECTION STATUS           │
│  [Status Badge: Connected / Pending]    │
│  MetaMask: 0x1234...5678                │
├────────────────────────────────────────┤
│           PARTIES GRID                  │
│  ┌──────────┬──────────┬──────────┐    │
│  │ Party A  │ Party B  │ Party C  │    │
│  │ Logo     │ Logo     │ Logo     │    │
│  │ Votes: 0 │ Votes: 0 │ Votes: 0 │    │
│  │[VOTE]    │[VOTE]    │[VOTE]    │    │
│  └──────────┴──────────┴──────────┘    │
├────────────────────────────────────────┤
│        STATUS: "Ready to vote"           │
│        Connected wallet ✅               │
└────────────────────────────────────────┘
```

#### Layout (Post-Vote)
```
┌────────────────────────────────────────┐
│    CONFIRMATION: VOTE RECORDED ✅       │
│  "Your vote for Party A is confirmed"  │
│                                         │
│  Vote Hash: 0xABCD...EFGH              │
│  Transaction: 0x1234...5678            │
│  Time: 2:45 PM, Dec 16, 2024           │
│                                         │
│  [VIEW PROOF] [RETURN HOME]             │
└────────────────────────────────────────┘
```

#### Components

##### Election Header Card
```
┌─────────────────────────────────────┐
│ 2024 GENERAL ELECTIONS              │
│ Active now                          │
│                                     │
│ ⏱️  Ends in: 2 days, 14 hours      │
│ 🗳️  Total votes cast: 1,234,567     │
│ ✅ You: Eligible to vote            │
└─────────────────────────────────────┘
```
- Background: Gold accent border
- Status badge: Green "Active"
- Countdown timer: Real-time update
- Text: Large, bold

##### Wallet Status Badge
```
  ┌─────────────────────────────┐
  │ 🟢 CONNECTED (MetaMask)     │
  │ 0x1234...5678              │
  │ Balance: 0.5 ETH            │
  │ [DISCONNECT]                │
  └─────────────────────────────┘
```
- Status: Green dot + text
- Address: Truncated (first 6 + last 4 chars)
- Clickable: Shows full address tooltip
- Mobile: Vertical layout

##### Party Cards
```
  ┌──────────────────────┐
  │                      │
  │      [Logo]          │
  │                      │
  │   PARTY NAME         │
  │   Votes: 1,234 (20%) │
  │                      │
  │    [VOTE FOR PARTY]  │
  │                      │
  └──────────────────────┘
```
- Width: ~250px desktop, full on mobile
- Logo: Centered, 80x80px
- Party name: 20px bold
- Vote count: Small, bottom-right
- Button: Full-width, hover glow
- Hover: Card glows with party color

##### Confirmation Modal (After Vote)
```
┌─────────────────────────────────────┐
│      ✅ VOTE RECORDED               │
│                                     │
│  "Your vote for PARTY NAME is       │
│   safely recorded on the            │
│   blockchain."                      │
│                                     │
│  Vote ID: 0xABCD...EFGH             │
│  Hash: 0x1234...5678                │
│  Block: 1234567                     │
│  Time: 2:45 PM                      │
│                                     │
│  [VIEW BLOCKCHAIN PROOF]  [CLOSE]   │
└─────────────────────────────────────┘
```
- Modal: Center screen, semi-transparent dark overlay
- Animation: Fade-in + subtle scale
- Close: Auto-close after 10 sec or manual click
- Proof link: Opens external block explorer

---

### 2.4 ADMIN PANEL

#### Purpose
Election management interface, government-grade security

#### Flow

##### Step 1: CAPTCHA Gate
```
┌──────────────────────────────────────┐
│      ADMIN VERIFICATION               │
│                                       │
│   "Verify you're human"               │
│                                       │
│   [reCAPTCHA / hCaptcha]              │
│                                       │
│   [CONTINUE]                          │
└──────────────────────────────────────┘
```
- Simple CAPTCHA (reCAPTCHA v3 recommended)
- Single button to proceed
- Styling: Government blue theme

##### Step 2: Wallet Connection (Blockchain Mode Only)
```
┌──────────────────────────────────────┐
│    BLOCKCHAIN MODE: CONNECT WALLET    │
│                                       │
│    "Connect your MetaMask wallet      │
│     to manage this election"          │
│                                       │
│    [CONNECT METAMASK]                 │
│                                       │
│    ⓘ This is blockchain mode          │
│                                       │
│    [USE DEMO MODE INSTEAD]            │
└──────────────────────────────────────┘
```
- Large CTA button
- Toggle option to switch to demo mode
- Status: "Connecting..." with spinner

##### Step 3: Username / Password
```
┌──────────────────────────────────────┐
│      ADMIN LOGIN                      │
│                                       │
│   Email: [____________________]       │
│                                       │
│   Password: [_________________] 👁️   │
│                                       │
│   [LOGIN]                             │
│                                       │
│   Forgot password? [Link]             │
└──────────────────────────────────────┘
```
- Email + password inputs
- Show/hide password toggle
- Remember me checkbox (optional, no localStorage)
- Submit button: Full-width

##### Admin Dashboard (Post-Login)
```
┌─────────────────────────────────────────────┐
│  [Admin Panel]  [Home] [Elections] [Audit]  │
│                              [Logout ⬅️]     │
├─────────────────────────────────────────────┤
│                                             │
│  QUICK STATS                                │
│  ┌──────────┬──────────┬──────────┐        │
│  │ Elections│ Active   │ Ended    │        │
│  │    5     │    2     │    3     │        │
│  └──────────┴──────────┴──────────┘        │
│                                             │
├─────────────────────────────────────────────┤
│  RECENT ELECTIONS                           │
│  ┌─────────────────────────────────────┐   │
│  │ [Edit] Election 1 | Status: ONGOING │   │
│  │ [Edit] Election 2 | Status: ENDED   │   │
│  │ [Edit] Election 3 | Status: DRAFT   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [+ CREATE NEW ELECTION]                    │
│                                             │
└─────────────────────────────────────────────┘
```

###### Dashboard Cards

**Election Stats Card**
```
┌─────────────────┐
│  Votes Cast     │
│  1,234,567      │
│  ↑ 12% today    │
└─────────────────┘
```
- Large number, trend indicator

**Create Election Modal**
```
┌────────────────────────────────────┐
│  NEW ELECTION                      │
│                                    │
│  Title: [________________]         │
│  Description: [_____________]      │
│  Start Time: [Pick] [Pick Time]    │
│  End Time: [Pick] [Pick Time]      │
│  Election Type: [Dropdown ▼]       │
│                                    │
│  Voting Mode:                      │
│  ⚫ Blockchain   ○ Demo             │
│                                    │
│  [CREATE] [CANCEL]                 │
└────────────────────────────────────┘
```

**Parties Management**
```
┌──────────────────────────────────┐
│  MANAGE PARTIES                  │
│                                  │
│  [Party A] [Remove] [Edit Logo]  │
│  [Party B] [Remove] [Edit Logo]  │
│  [Party C] [Remove] [Edit Logo]  │
│                                  │
│  [+ ADD PARTY]                   │
└──────────────────────────────────┘
```

**Voters Management**
```
┌────────────────────────────────────┐
│  MANAGE VOTERS (1,234 registered)  │
│                                    │
│  [Search: _____________] [Filter▼] │
│                                    │
│  ☑️  John Doe  | vote: ✓ Verified  │
│  ☑️  Jane Doe  | vote: ✗ Pending   │
│  ☑️  Bob Smith | vote: ✓ Verified  │
│                                    │
│  [BULK ACTIONS ▼] [EXPORT CSV]    │
└────────────────────────────────────┘
```

**Results View (After Election Ends)**
```
┌────────────────────────────────────┐
│  LIVE RESULTS (Updated every 10s)  │
│                                    │
│  Party A   ████████░  45% (456K)   │
│  Party B   ██████░░░  30% (304K)   │
│  Party C   ████░░░░░  25% (253K)   │
│                                    │
│  Total Votes: 1,013,000            │
│  Last Updated: 2 mins ago          │
│                                    │
│  [ANNOUNCE RESULTS] [DOWNLOAD PDF] │
└────────────────────────────────────┘
```

**Audit Logs**
```
┌──────────────────────────────────────┐
│  AUDIT LOG                           │
│                                      │
│  🔐 Admin "John" logged in           │
│     2:45 PM | IP: 192.168.1.1        │
│                                      │
│  🗳️  Election started                │
│     2:30 PM | Created by John        │
│                                      │
│  ✏️  5 voters added                  │
│     2:15 PM | Batch import           │
│                                      │
│  [LOAD MORE] [DOWNLOAD LOG]          │
└──────────────────────────────────────┘
```

---

## 3. Responsive Design

### Breakpoints
```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
Large Desktop: > 1440px
```

### Mobile-First Approach
- Start with mobile layout, enhance for larger screens
- Touch-friendly buttons: Min 44x44px
- Single column layouts for mobile
- Expandable menus (hamburger nav)
- Full-width cards and inputs

### Tablet Optimizations
- 2-column grids where applicable
- Slightly larger touch targets
- Side navigation (collapsible)

### Desktop Enhancements
- 3-4 column grids
- Persistent sidebars
- Larger typography
- Multi-panel layouts

---

## 4. Accessibility & Inclusivity

### WCAG 2.1 AA Compliance
- **Color contrast**: Minimum 4.5:1 for text
- **Focus indicators**: Visible 2px outline on all interactive elements
- **Keyboard navigation**: All features operable via keyboard
- **Alt text**: All images have descriptive alt text
- **ARIA labels**: Form inputs, buttons, sections properly labeled

### Screen Reader Support
- Semantic HTML (buttons, links, nav, main, section)
- ARIA roles and attributes where needed
- Form labels associated with inputs
- Meaningful link text (not "click here")

### Motion & Animation
- Respect `prefers-reduced-motion` setting
- Provide static versions of animations
- No auto-playing videos
- Warn before heavy animations

---

## 5. Blockchain Visual Language

### Icons & Symbols
- **Blockchain icon**: Connected nodes in chain
- **Vote icon**: Ballot box, checkmark
- **Lock icon**: Security, confirmed state
- **Wallet icon**: MetaMask or generic wallet symbol
- **Verification icon**: Green checkmark + shield
- **Error icon**: Red X + warning triangle

### Animations
- **Blockchain confirmations**: Blocks appearing left-to-right
- **Vote submission**: Ripple from click point
- **Loading state**: Rotating blockchain cube
- **Success state**: Checkmark animation + confetti (subtle)

---

## 6. Mode Switching Visual Cues

### Blockchain Mode Indicators
- Gold accent color prominently used
- MetaMask logo/icon visible in wallet badge
- Transaction hash display
- Block explorer links available
- Gas fee estimates (if applicable)
- "Blockchain Mode" label subtle in UI

### Demo Mode Indicators
- Blue accent color (different shade)
- "Demo Mode" label subtle in UI
- No wallet connection required (bypassed)
- Instant feedback (no transaction wait)
- No block explorer links
- Disclaimer banner (optional): "This is a demo environment"

### Mode Toggle Location
- Top-right corner: Small toggle switch
- Label: "🔗 Blockchain | 🔄 Demo"
- Visual feedback: Selected mode highlighted
- Accessible: Can also use `?mode=demo` in URL

---

## 7. Trust & Security Visual Elements

### Trust Signals
- Government seal (top-left or header)
- "Verified by Election Commission" badge
- Security certifications (ISO, SOC2 if applicable)
- Real-time audit log visible (admin dashboard)
- Vote counts updating live
- Blockchain explorer links (for transparency)

### Security Indicators
- Padlock icon on sensitive forms
- SSL/HTTPS badge (if applicable)
- Encryption indicators
- Session timeout warnings
- 2FA indicators (if enabled)

---

## 8. Error Handling & Feedback

### Error States
```
Network Error:
┌──────────────────────────────┐
│ ⚠️  Connection Failed         │
│ Unable to connect to network  │
│ [RETRY] [CONTACT SUPPORT]    │
└──────────────────────────────┘

Wallet Error:
┌──────────────────────────────┐
│ ❌ MetaMask Error             │
│ Please connect your wallet    │
│ [CONNECT METAMASK]           │
└──────────────────────────────┘

Vote Already Cast:
┌──────────────────────────────┐
│ ✓ Already Voted               │
│ You've already voted in this  │
│ election on Nov 15, 2024      │
│ [VIEW PROOF]                 │
└──────────────────────────────┘
```

### Success Feedback
- Toast notifications (top-right)
- Inline success messages (green text + icon)
- Confirmation modals for critical actions
- Redirect after success (e.g., to vote confirmation page)

### Loading States
- Skeleton screens for data loading
- Spinner with "Processing..." text
- Progress bars for multi-step processes
- Estimated time remaining (if available)

---

## 9. Performance & Optimization

### Image Optimization
- WebP format with PNG fallback
- Lazy loading for below-fold images
- Responsive images (srcset) for different screen sizes
- SVG for icons and logos

### CSS & JavaScript
- Minimal animations on low-end devices (detect via `prefers-reduced-motion`)
- Code splitting by route
- Lazy load heavy components (charts, modals)
- Debounce/throttle scroll and resize events

### Loading Performance
- Target: First Contentful Paint < 1.5s
- Target: Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

---

## 10. Component Library

### Reusable Components (To Build)
- Button (primary, secondary, danger, disabled states)
- Card (elevated, bordered)
- Modal (centered, side-sheet)
- Input (text, email, password, number)
- Select/Dropdown
- Checkbox / Radio
- Toggle Switch
- Badge (success, error, warning, info)
- Toast Notification
- Skeleton Loader
- Progress Bar
- Spinner
- Stepper (for multi-step flows)
- Tabs
- Accordion
- Table (with sorting, pagination)
- Avatar
- Alert Box
- Breadcrumb

---

## 11. Content Tone & Voice

### Writing Style
- **Professional**: Government authority, trust
- **Clear**: Simple language, jargon-free
- **Reassuring**: "Your vote is safe," "Verified," "Secure"
- **Action-oriented**: Clear CTAs, next steps

### Key Phrases
- "Secure your vote on the blockchain"
- "Transparent. Immutable. Trusted."
- "One-click voting"
- "Your identity is private"
- "Instant confirmation"
- "Election Commission verified"

---

## 12. Deployment & Documentation

### Required Assets
- Logo and wordmark (SVG)
- Favicon
- Government seal / badge (PNG, SVG)
- Party candidate images (placeholder system)
- Icons (custom blockchain set)
- Screenshot/preview images

### Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS 14+, Android 10+

### Testing Checklist
- [ ] All pages responsive on mobile/tablet/desktop
- [ ] All forms functional and validated
- [ ] Buttons and links clickable
- [ ] Animations smooth (60 FPS)
- [ ] Accessibility: WCAG 2.1 AA pass
- [ ] Dark theme consistent across all pages
- [ ] Mode switching works without page reload
- [ ] Error handling graceful
- [ ] Loading states visible
- [ ] Performance metrics meet targets

---

## Summary

This UI/UX specification provides:
1. **Comprehensive design system** (colors, typography, spacing)
2. **Government-grade theme** with blockchain branding
3. **Dark mode excellence** optimized for eye comfort
4. **Cursor-reactive interactions** for premium feel
5. **Four main pages** (Home, About, Vote, Admin) with detailed layouts
6. **Responsive design** from mobile to large desktop
7. **Accessibility-first approach** (WCAG 2.1 AA)
8. **Dual-mode visual cues** (Blockchain vs Demo)
9. **Trust signals & security indicators** prominently featured
10. **Complete component library** specifications

All pages maintain identical UX across blockchain and demo modes, with only subtle visual cues to indicate which backend is active.
