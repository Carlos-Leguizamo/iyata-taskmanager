<template>
  <div>
    <Menubar v-if="auth.isAuthenticated" :model="menuItems" />
    <router-view />
  </div>
</template>

<script setup>
import Menubar from "primevue/menubar";
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const menuItems = ref([
  { label: "Dashboard", to: "/" },
  { label: "Proyectos", to: "/projects" },
  { label: "Tareas", to: "/tasks" },
  {
    label: "Salir",
    command: async () => {
      await auth.logout();
    },
  },
]);
const isLogged = computed(() => !!auth.user || !!auth.token);
</script>
