<template>
  <div>
    <Menubar v-show="isLogged" :model="menuItems" class="shadow-lg" />
    <router-view />
  </div>
</template>

<script setup>
import Menubar from "primevue/menubar";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const isLogged = computed(() => !!auth.user && !!auth.token);

const menuItems = ref([
  { label: "Dashboard", command: () => router.push("/dashboard") },
  { label: "Proyectos", command: () => router.push("/projects") },
  { label: "Tareas", command: () => router.push("/tasks") },
  {
    label: "Salir",
    command: async () => {
      await auth.logout();
      router.push("/login");
    },
  },
]);
</script>

<style scoped>
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
