import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ModeSelectionModal } from '@/components/ModeSelectionModal'
import { VotingProvider } from '@/context/VotingContext'
import { HomePage } from '@/pages/Home'
import { AboutPage } from '@/pages/About'
import { VotePage } from '@/pages/Vote'
import { AdminPage } from '@/pages/Admin'

function App() {
  return (
    <VotingProvider>
      <Router>
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
          <ModeSelectionModal />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/vote" element={<VotePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </VotingProvider>
  )
}

export default App
