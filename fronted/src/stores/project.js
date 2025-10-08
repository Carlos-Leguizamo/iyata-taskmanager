import { defineStore } from "pinia";
import api from "@/services/api";

export const useProjectStore = defineStore("project", {
  state: () => ({ projects: [], pagination: {} }),
  actions: {
    async fetchProjects(page = 1) {
      const { data } = await api.get("/projects?page=" + page);
      this.projects = data.data;
      this.pagination = { ...data.meta };
    },
    async createProject(payload) {
      const { data } = await api.post("/projects", payload);
      this.projects.unshift(data.data || data);
    },
    async updateProject(id, data) {
      try {
        const response = await axios.put(`/projects/${id}`, data);
        const index = this.projects.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.projects[index] = response.data;
        }
        return response.data;
      } catch (error) {
        console.error("Error al actualizar proyecto:", error);
        throw error;
      }
    },

    async deleteProject(id) {
      await api.delete(`/projects/${id}`);
      this.fetchProjects();
    },
  },
});
