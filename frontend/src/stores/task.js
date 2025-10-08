import { defineStore } from 'pinia'
import api from '@/services/api'

export const useTaskStore = defineStore('task', {
  state: () => ({ tasks: [], pagination: {} }),
  actions: {
    async fetchTasks(page = 1) {
      const { data } = await api.get('/tasks?page=' + page);
      this.tasks = data.data;
      this.pagination = { ...data.meta };
    },
    async createTask(payload) {
      const { data } = await api.post('/tasks', payload);
      this.tasks.unshift(data.data || data);
    },
    async updateTask(id, payload) {
      await api.put(`/tasks/${id}`, payload);
      this.fetchTasks();
    },
    async deleteTask(id) {
      await api.delete(`/tasks/${id}`);
      this.fetchTasks();
    }
  }
});
