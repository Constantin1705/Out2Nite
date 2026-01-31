'use client'

// Update the path below to the correct relative path where Header.tsx is located
import { Header } from '../../components/Header'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
// Update the path below to the correct relative path where your auth store is located
import { useAuthStore } from '../../lib/auth'
import { useState } from 'react'
import { AlertCircle, Mail, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(username, password)
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
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-200 mt-2">Sign in to discover tonight&#39;s events</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-gap gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                >
                  <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                  <span className="text-red-400 text-sm">{error}</span>
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
                    placeholder="Enter your username"
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
                    placeholder="Enter your password"
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
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-dark-700 text-center text-gray-400">
              Don&#39;t have an account?{' '}
              <a href="/register" className="text-primary hover:text-secondary font-medium transition-colors">
                Register now
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
