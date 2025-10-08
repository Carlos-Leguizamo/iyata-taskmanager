import { defineStore } from "pinia";
import api from "@/services/api"; 

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      const { data } = await api.post("/login", credentials); 
      this.token = data.token;
      localStorage.setItem("token", data.token);
      this.user = data.user;
    },
    async fetchMe() {
      if (!this.token) return;
      const { data } = await api.get("/me");
      this.user = data;
    },
    async register(userData) {
      const { data } = await api.post("/register", userData);
      return data;
    },
    async logout() {
      try {
        await api.post("/logout"); 
      } catch {}
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});