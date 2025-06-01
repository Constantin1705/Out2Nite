import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import type { User } from 'src/types/User'
import type { AxiosError } from 'axios'
// import router from 'src/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loaded: false
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        await api.post('/api/auth/login/', { username, password })
        await this.fetchUser()
      } catch (err) {
        console.error('Login failed', err)
      }
    },

    async register(username: string, email: string, password: string) {
      try {
        await api.post('/api/auth/register/', { username, email, password })
        await this.fetchUser()
      } catch (err) {
        console.error('Register failed', err)
      }
    },

    async fetchUser() {
       if (this.loaded) return
  this.loaded = true

  try {
    const response = await api.get('/api/auth/me/')
    this.user = response.data
    console.log(this.user)
    this.isAuthenticated = true
  } catch (err) {
  const error = err as AxiosError
  if (error.response?.status === 401) {
    console.warn('User not authenticated')
  } else {
    console.error('Fetch user failed', error)
  }

  this.user = null
  this.isAuthenticated = false
}
},
    async logout() {
      try {
        await api.post('/api/auth/logout/')
      } catch (err) {
        console.error('Logout failed', err)
      }
      this.user = null
      this.isAuthenticated = false
      this.loaded = false
    }
  }
})
