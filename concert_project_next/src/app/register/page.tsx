'use client'

import { Header } from '../../components/Header'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
// Update the path below to the correct relative path if your auth store is located elsewhere, for example:
import { useAuthStore } from '../../lib/auth'
// Or create the file at src/lib/auth.ts if it does not exist.
import { useState } from 'react'
import { AlertCircle, Mail, Lock, User } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error } = useAuthStore()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters')
      return
    }

    await register(username, email, password)
    if (useAuthStore.getState().isAuthenticated) {
      router.push('/map')
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-dark-800 rounded-2xl border border-dark-700 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-neon p-8 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h1 className="text-3xl font-bold text-white">Join Out2Nite</h1>
              <p className="text-gray-200 mt-2">Create an account to get started</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {(error || validationError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-gap gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                >
                  <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                  <span className="text-red-400 text-sm">{error || validationError}</span>
                </motion.div>
              )}

              <div>
                <label className="block text-gray-300 font-medium mb-2">Username</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-neon hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-dark-700 text-center text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:text-secondary font-medium transition-colors">
                Sign in
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
