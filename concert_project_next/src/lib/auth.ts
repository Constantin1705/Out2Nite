import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from './api'
import type { User } from '../types/User'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.post('/api/auth/login/', {
            username,
            password,
          })
          if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token)
          }
          await useAuthStore.getState().fetchUser()
        } catch (err: any) {
          const error = err.response?.data?.message || 'Login failed'
          set({ error })
          console.error('Login failed:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          await apiClient.post('/api/auth/register/', {
            username,
            email,
            password,
          })
          await useAuthStore.getState().fetchUser()
        } catch (err: any) {
          const error = err.response?.data?.message || 'Registration failed'
          set({ error })
          console.error('Register failed:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      fetchUser: async () => {
        set({ isLoading: true })
        try {
          const response = await apiClient.get('/api/auth/me/')
          set({ user: response.data, isAuthenticated: true, isLoading: false })
        } catch (err: any) {
          if (err.response?.status === 401) {
            localStorage.removeItem('auth_token')
            set({ user: null, isAuthenticated: false, isLoading: false })
          } else {
            console.error('Fetch user failed:', err)
          }
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await apiClient.post('/api/auth/logout/')
        } catch (err) {
          console.error('Logout failed:', err)
        } finally {
          localStorage.removeItem('auth_token')
          set({ user: null, isAuthenticated: false, isLoading: false, error: null })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
