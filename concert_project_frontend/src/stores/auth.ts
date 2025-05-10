import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import type { User } from '../types/User'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    user: null as User | null,
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        const response = await api.post('api/auth/login/', {
          username,
          password,
        });

        this.accessToken = response.data.access;
        if (this.accessToken) {
          localStorage.setItem('access_token', this.accessToken);
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
        await this.fetchUser();
      } catch (err) {
        console.error('Login failed', err);
      }
    },

    async fetchUser() {
      try {
        const response = await api.get('/api/auth/me/');
        this.user = response.data;
      } catch (err) {
        console.error('Fetch user failed', err);
      }
    },

    logout() {
      this.accessToken = null;
      this.user = null;
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
    },
  }
});
