'use client'

import React, { useEffect } from 'react'
import { useAuthStore } from '../lib/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if user is still logged in on mount
    const token = localStorage.getItem('auth_token')
    if (token && !useAuthStore.getState().isAuthenticated) {
      useAuthStore.getState().fetchUser()
    }
  }, [])

  return <>{children}</>
}
