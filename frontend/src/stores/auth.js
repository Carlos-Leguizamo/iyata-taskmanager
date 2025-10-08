import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, token: localStorage.getItem('token') || null }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async login(payload) {
      const { data } = await api.post('/login', payload);
      this.user = data.user;
      this.token = data.token;
      localStorage.setItem('token', data.token);
    },
    async register(payload) {
      const { data } = await api.post('/register', payload);
      this.user = data.user;
      this.token = data.token;
      localStorage.setItem('token', data.token);
    },
    logout() {
      localStorage.removeItem('token');
      this.user = null;
      this.token = null;
    },
    async fetchMe() {
      if (!this.token) return;
      const { data } = await api.get('/me');
      this.user = data;
    }
  }
});
