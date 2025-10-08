<template>
  <div class="p-6">
    <h1>Bienvenido, {{ user?.name }}</h1>
    <div class="grid">
      <Card>
        <h3>Proyectos</h3>
        <p>{{ projectsCount }}</p>
      </Card>
      <Card>
        <h3>Tareas</h3>
        <p>{{ tasksCount }}</p>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'
import { useTaskStore } from '@/stores/task'
const auth = useAuthStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

onMounted(async () => {
  await auth.fetchMe()
  await projectStore.fetchProjects()
  await taskStore.fetchTasks()
})

const user = computed(() => auth.user)
const projectsCount = computed(() => projectStore.projects.length)
const tasksCount = computed(() => taskStore.tasks.length)
</script>
