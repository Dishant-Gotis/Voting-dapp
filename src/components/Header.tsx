import React from 'react'
import { Link } from 'react-router-dom'
import { ModeToggle } from './ModeToggle'
import clsx from 'clsx'

interface HeaderProps {
  transparent?: boolean
}

export const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <header className={clsx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      transparent ? 'bg-transparent' : 'bg-slate-900/95 backdrop-blur border-b border-slate-700'
    )}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="text-2xl font-bold text-gradient">🔗</div>
          <span className="text-xl font-bold text-slate-100 group-hover:text-yellow-400 transition-colors">
            VOTING DAPP
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-300 hover:text-yellow-400 transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-slate-300 hover:text-yellow-400 transition-colors">
            About
          </Link>
          <Link to="/vote" className="text-slate-300 hover:text-yellow-400 transition-colors">
            Vote
          </Link>
          <Link to="/admin" className="text-slate-300 hover:text-yellow-400 transition-colors">
            Admin
          </Link>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <ModeToggle showLabel={false} />

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <nav className="md:hidden bg-slate-800 border-t border-slate-700 p-4 space-y-3">
          <Link
            to="/"
            className="block text-slate-300 hover:text-yellow-400 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-slate-300 hover:text-yellow-400 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/vote"
            className="block text-slate-300 hover:text-yellow-400 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Vote
          </Link>
          <Link
            to="/admin"
            className="block text-slate-300 hover:text-yellow-400 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  )
}
