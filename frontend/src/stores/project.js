import { defineStore } from 'pinia'
import api from '@/services/api'

export const useProjectStore = defineStore('project', {
  state: () => ({ projects: [], pagination: {} }),
  actions: {
    async fetchProjects(page = 1) {
      const { data } = await api.get('/projects?page=' + page);
      this.projects = data.data;
      this.pagination = { ...data.meta };
    },
    async createProject(payload) {
      const { data } = await api.post('/projects', payload);
      this.projects.unshift(data.data || data); 
    },
    async updateProject(id, payload) {
      const { data } = await api.put(`/projects/${id}`, payload);
      this.fetchProjects();
    },
    async deleteProject(id) {
      await api.delete(`/projects/${id}`);
      this.fetchProjects();
    }
  }
});
