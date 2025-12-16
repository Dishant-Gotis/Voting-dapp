import React, { useState, useRef } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Modal } from '@/components/Modal'
import { useVotingMode } from '@/context/VotingContext'
import { DemoAdminAdapter } from '@/adapters/DemoAdminAdapter'
import toast from 'react-hot-toast'

type AdminStep = 'captcha' | 'wallet' | 'login' | 'dashboard'

export const AdminPage: React.FC = () => {
  const { mode } = useVotingMode()
  const [step, setStep] = useState<AdminStep>('captcha')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Election form state
  const [electionTitle, setElectionTitle] = useState('')
  const [electionDescription, setElectionDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Use useRef to maintain single instance across renders
  const adminAdapterRef = useRef(new DemoAdminAdapter())
  const adminAdapter = adminAdapterRef.current

  // Mock data
  const elections = [
    { id: 1, title: 'General Elections 2024', status: 'ONGOING', votes: 1200000 },
    { id: 2, title: 'Local Council 2024', status: 'ENDED', votes: 450000 },
    { id: 3, title: 'Municipal Elections', status: 'DRAFT', votes: 0 }
  ]

  const handleCaptchaVerify = () => {
    setStep(mode === 'BLOCKCHAIN' ? 'wallet' : 'login')
  }

  const handleWalletConnect = () => {
    setStep('login')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    setIsSubmitting(true)
    try {
      const result = await adminAdapter.authenticateCredentials(email, password)
      if (result.success) {
        setIsLoggedIn(true)
        setStep('dashboard')
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!electionTitle || !startDate || !endDate) {
      toast.error('Please fill all required fields')
      return
    }
    
    setIsSubmitting(true)
    try {
      const startTime = new Date(startDate).getTime()
      const endTime = new Date(endDate).getTime()
      
      if (startTime >= endTime) {
        toast.error('End date must be after start date')
        setIsSubmitting(false)
        return
      }
      
      const result = await adminAdapter.createElection({
        title: electionTitle,
        description: electionDescription,
        startTime,
        endTime
      })
      
      if (result.success) {
        toast.success(result.message)
        setShowCreateModal(false)
        // Reset form
        setElectionTitle('')
        setElectionDescription('')
        setStartDate('')
        setEndDate('')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Create election error:', error)
      toast.error('Failed to create election')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 'captcha') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Admin Verification</h1>
            <p className="text-slate-300 mb-8">
              Verify you're human to proceed
            </p>
            <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
              <div className="text-2xl mb-2">🤖</div>
              <p className="text-slate-400 text-sm">reCAPTCHA / hCaptcha</p>
              <p className="text-slate-500 text-xs mt-2">
                Click the checkbox below
              </p>
              <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-600 text-left">
                <input type="checkbox" id="captcha" className="mr-2" />
                <label htmlFor="captcha" className="text-sm text-slate-300">
                  I'm not a robot
                </label>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCaptchaVerify}
            >
              Continue
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (step === 'wallet' && mode === 'BLOCKCHAIN') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Connect Wallet</h1>
            <p className="text-slate-300 mb-8">
              Connect your MetaMask wallet to manage elections
            </p>
            <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
              <div className="text-5xl mb-3">🦊</div>
              <p className="font-semibold text-slate-100">MetaMask</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full mb-4"
              onClick={handleWalletConnect}
            >
              Connect MetaMask
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setStep('login')}
            >
              Use Demo Mode Instead
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (step === 'login' && !isLoggedIn) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-8">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="admin@election.gov"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Remember me</span>
            </label>
            <Button variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="text-center mt-6">
            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">
              Forgot password?
            </a>
          </div>
        </Card>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button
            variant="secondary"
            onClick={() => {
              setIsLoggedIn(false)
              setStep('captcha')
              setEmail('')
              setPassword('')
            }}
          >
            Logout ⬅️
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-5xl font-bold text-yellow-400 mb-2">5</div>
            <div className="text-slate-400">Total Elections</div>
          </Card>
          <Card>
            <div className="text-5xl font-bold text-green-400 mb-2">2</div>
            <div className="text-slate-400">Active Elections</div>
          </Card>
          <Card>
            <div className="text-5xl font-bold text-blue-400 mb-2">1.2M</div>
            <div className="text-slate-400">Total Votes Cast</div>
          </Card>
        </div>

        {/* Recent Elections */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Recent Elections</h2>
          <div className="space-y-4">
            {elections.map((election) => (
              <div key={election.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <h3 className="font-bold text-slate-100">{election.title}</h3>
                  <p className="text-slate-400 text-sm">
                    {election.votes.toLocaleString()} votes cast
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    election.status === 'ONGOING' ? 'bg-green-500/20 text-green-400' :
                    election.status === 'ENDED' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {election.status}
                  </span>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Election */}
          <Card>
            <h3 className="text-2xl font-bold mb-4">Create Election</h3>
            <p className="text-slate-400 mb-6">
              Set up a new election and configure voting rules.
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setShowCreateModal(true)}
            >
              + New Election
            </Button>
          </Card>

          {/* Manage Voters */}
          <Card>
            <h3 className="text-2xl font-bold mb-4">Manage Voters</h3>
            <p className="text-slate-400 mb-6">
              Add, remove, or verify voter registrations.
            </p>
            <Button variant="secondary" size="lg" className="w-full">
              Manage Voters
            </Button>
          </Card>

          {/* Parties */}
          <Card>
            <h3 className="text-2xl font-bold mb-4">Manage Parties</h3>
            <p className="text-slate-400 mb-6">
              Add candidates and configure party details.
            </p>
            <Button variant="secondary" size="lg" className="w-full">
              Configure Parties
            </Button>
          </Card>

          {/* Results */}
          <Card>
            <h3 className="text-2xl font-bold mb-4">Election Results</h3>
            <p className="text-slate-400 mb-6">
              View results and announce official outcomes.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setShowResultsModal(true)}
            >
              View Results
            </Button>
          </Card>
        </div>

        {/* Audit Logs */}
        <Card className="mt-8">
          <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: '🔐 Admin login', by: 'John Doe', time: '2 mins ago', ip: '192.168.1.1' },
              { action: '🗳️ Election started', by: 'Jane Smith', time: '1 hour ago', ip: '10.0.0.5' },
              { action: '✏️ 5 voters added', by: 'System', time: '2 hours ago', ip: 'Batch import' },
              { action: '📊 Results announced', by: 'Admin', time: '5 hours ago', ip: '192.168.1.100' }
            ].map((log, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-slate-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-slate-100">{log.action}</p>
                  <p className="text-slate-400 text-sm">
                    By {log.by} • {log.time}
                  </p>
                </div>
                <div className="text-right text-sm text-slate-400">
                  {log.ip}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Create Election Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Election"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreateElection}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Election'}
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleCreateElection}>
          <Input 
            label="Election Title" 
            placeholder="General Elections 2024" 
            value={electionTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setElectionTitle(e.target.value)}
            required
          />
          <Input 
            label="Description" 
            placeholder="Brief description of the election" 
            value={electionDescription}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setElectionDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Start Date" 
              type="datetime-local" 
              value={startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
              required
            />
            <Input 
              label="End Date" 
              type="datetime-local" 
              value={endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Election Type
            </label>
            <select className="input">
              <option>General Elections</option>
              <option>Local Elections</option>
              <option>Special Elections</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Voting Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mode" defaultChecked />
                <span>Blockchain Mode</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mode" />
                <span>Demo Mode</span>
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* Results Modal */}
      <Modal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        title="Election Results"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-slate-100 mb-4">General Elections 2024</h3>
            {[
              { name: 'Unity Party', votes: 450000, pct: 45 },
              { name: 'Progress Alliance', votes: 300000, pct: 30 },
              { name: 'Future Coalition', votes: 250000, pct: 25 }
            ].map((party, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-slate-300">{party.name}</span>
                  <span className="text-yellow-400">{party.votes.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-yellow-400 h-full"
                    style={{ width: `${party.pct}%` }}
                  />
                </div>
                <p className="text-slate-400 text-sm mt-1">{party.pct}% of votes</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-300">
              <span className="font-bold text-yellow-400">Unity Party</span> wins with 450,000 votes!
            </p>
          </div>
          <Button variant="primary" className="w-full">
            Announce Results
          </Button>
        </div>
      </Modal>
    </div>
  )
}
