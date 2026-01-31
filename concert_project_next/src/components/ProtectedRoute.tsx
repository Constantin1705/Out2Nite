'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
// If your 'auth' file is at 'src/lib/auth.ts', use the relative path:
import { useAuthStore } from '../lib/auth'
// Or, if you want to use the alias '@', ensure your tsconfig.json and next.config.js are configured for path aliases.

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
