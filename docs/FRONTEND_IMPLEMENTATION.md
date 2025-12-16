# Voting DAPP - Frontend Implementation

A government-grade blockchain voting platform with dark theme, dual-mode support, and professional UI/UX.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx       # Primary, secondary, danger buttons
│   ├── Card.tsx         # Elevated card component
│   ├── Input.tsx        # Form input with label & error states
│   ├── Header.tsx       # Navigation header with mode toggle
│   ├── Footer.tsx       # Footer with links
│   ├── Modal.tsx        # Dialog modal component
│   ├── ModeToggle.tsx   # Blockchain/Demo mode switcher
│   └── index.ts         # Component exports
│
├── context/             # React context providers
│   └── VotingContext.tsx # Global voting mode state
│
├── pages/               # Full page components
│   ├── Home.tsx         # Landing page with hero, features, CTA
│   ├── About.tsx        # How voting works, blockchain explained
│   ├── Vote.tsx         # Main voting interface
│   ├── Admin.tsx        # Admin dashboard with election management
│   └── index.ts         # Page exports
│
├── App.tsx              # Main app component with routing
├── main.tsx             # Vite entry point
├── index.css            # Global styles + design system
│
index.html              # HTML template
package.json           # Dependencies & scripts
tsconfig.json          # TypeScript configuration
vite.config.ts         # Vite configuration
tailwind.config.js     # Tailwind configuration
```

## Features Implemented

### 🎨 Design System
- **Colors**: Navy (#0A1f3F), Gold (#FFD700), Electric Blue (#00D9FF), Green (#10B981)
- **Typography**: Inter font, 5-tier heading scale, consistent spacing
- **Animations**: Smooth transitions, hover effects, blockchain-themed glows
- **Dark Theme**: Eye-friendly dark backgrounds with light text

### 🧩 Components
- **Button**: Primary, secondary, danger with loading states
- **Card**: Elevated cards with hover glow effects
- **Input**: Text inputs with validation and error states
- **Modal**: Centered modals with overlay and animations
- **Header**: Sticky navigation with mode toggle
- **Footer**: Multi-column footer with social links
- **ModeToggle**: Global voting mode switcher (Blockchain/Demo)

### 📄 Pages
1. **Home Page**
   - Hero section with headline and CTAs
   - Trust indicators (government seal, audit badges)
   - 4-step "How It Works" visual flow
   - Features grid (4 cards)
   - Final CTA section

2. **About Page**
   - Problem statement (3 pain points)
   - Blockchain explained (4-step process)
   - Complete voting process (6 steps)
   - Blockchain vs Demo comparison table
   - Security & trust section
   - FAQ (6 collapsible Q&A items)

3. **Vote Page**
   - Election header with details (title, votes cast, time remaining)
   - Wallet status badge (Blockchain mode only)
   - Party cards grid (3 parties with live vote counts)
   - Vote confirmation modal
   - Vote confirmation page (post-submission)
   - Proof display (vote ID, hash, block, timestamp)

4. **Admin Page**
   - Step 1: CAPTCHA verification
   - Step 2: MetaMask wallet connection (Blockchain only)
   - Step 3: Username/password login
   - Step 4: Dashboard with:
     - Quick stats (5 elections, 2 active, 1.2M votes)
     - Recent elections list
     - Create election button & modal
     - Voter management
     - Party configuration
     - Results view & announcement
     - Audit logs / recent activity

### 🌐 Global Context
- **VotingContext**: Manages voting mode (BLOCKCHAIN/DEMO)
- Mode persistence via sessionStorage
- URL parameter support (?mode=demo)
- Mode auto-detection on first load

### 📱 Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 1024px, 1440px
- Touch-friendly buttons (44x44px minimum)
- Hamburger menu on mobile
- Flexible grid layouts

### ♿ Accessibility
- WCAG 2.1 AA compliance target
- Semantic HTML (nav, main, section, article)
- Focus indicators on interactive elements
- Color contrast ratios 4.5:1+
- ARIA labels on forms
- Keyboard navigation support

## Tech Stack

- **React 18**: UI components
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **React Router v6**: Client-side routing
- **Zustand**: State management (ready for use)

## Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Opens http://localhost:3000

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Design Tokens

### Colors (CSS Variables)
```css
--color-navy: #0A1f3F
--color-gold: #FFD700
--color-electric-blue: #00D9FF
--color-green-success: #10B981
--color-red-error: #EF4444
--color-dark-bg: #0D1117
--color-card-bg: #1C2333
--color-border: #30363D
--color-text-primary: #E6EDF3
--color-text-secondary: #8B949E
--color-text-tertiary: #6E7681
```

### Spacing Scale
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px

### Border Radius
- Sharp: 2px
- Subtle: 4px
- Rounded: 8px
- Smooth: 12px
- Pill: 9999px

## Button Variants

### Primary
- Background: Blue (#1E40AF)
- Border: Gold (#FFD700)
- Hover: Glow effect with electric blue
- State: Active with darker blue

### Secondary
- Background: Slate (#475569)
- Border: Slate (#64748B)
- Hover: Slightly lighter slate

### Danger
- Background: Red (#DC2626)
- Hover: Darker red

## Next Steps (Backend Integration Ready)

The frontend is built to integrate with backend logic via adapters:

1. **Blockchain Adapter**: Smart contract calls
   - MetaMask connection
   - Vote submission to blockchain
   - Transaction hash retrieval
   - Block explorer links

2. **Demo Adapter**: Supabase backend
   - Direct API calls
   - No wallet required
   - Instant results
   - RLS-protected queries

Both adapters maintain identical UI/UX through the adapter pattern.

## Notes

- All pages are static (no backend calls yet)
- Components are fully styled and interactive
- Mode switching works globally via context
- Hover effects and animations are smooth
- Mobile responsive across all pages
- No localStorage used for votes (as required)
- Session-based mode preference OK (sessionStorage)

---

Built with ❤️ for transparent, secure voting.
