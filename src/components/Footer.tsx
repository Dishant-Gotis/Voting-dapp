import React from 'react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-bold text-gradient mb-2">🔗 VOTING DAPP</div>
            <p className="text-slate-400 text-sm">
              Secure. Transparent. Immutable.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-slate-300 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/" className="hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-yellow-400 transition-colors">About</a></li>
              <li><a href="/vote" className="hover:text-yellow-400 transition-colors">Vote</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-slate-300 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Audit Report</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-slate-300 mb-3">Follow Us</h4>
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-yellow-400 transition-colors text-xl">𝕏</a>
              <a href="#" className="hover:text-yellow-400 transition-colors text-xl">⚙️</a>
              <a href="#" className="hover:text-yellow-400 transition-colors text-xl">📧</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; {currentYear} Voting DAPP. All rights reserved.</p>
          <p className="mt-2">Built with blockchain integrity.</p>
        </div>
      </div>
    </footer>
  )
}
