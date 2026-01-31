'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../lib/auth'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-dark-700 bg-dark-900/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center text-white">
              🌙
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Out2Nite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/map"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Map
                </Link>
                <Link
                  href="/list"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Events
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">
                    {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary hover:bg-secondary rounded-lg transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-dark-700 rounded-lg"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-dark-700 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/map"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                >
                  Map
                </Link>
                <Link
                  href="/list"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                >
                  Events
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 bg-primary hover:bg-secondary rounded-lg transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
