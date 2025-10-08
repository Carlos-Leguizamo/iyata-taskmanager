<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-light text-white mb-2">Bienvenido, {{ user?.name }}</h1>
        <p class="text-gray-200 text-sm">Aquí puedes ver un resumen de tus proyectos y tareas</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-between hover:scale-105 transform transition-all duration-300">
          <h3 class="text-lg font-medium text-gray-700 mb-2">Proyectos</h3>
          <p class="text-3xl font-bold text-gray-900">{{ projectsCount }}</p>
        </div>

        <div class="bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-between hover:scale-105 transform transition-all duration-300">
          <h3 class="text-lg font-medium text-gray-700 mb-2">Tareas</h3>
          <p class="text-3xl font-bold text-gray-900">{{ tasksCount }}</p>
        </div>
      </div>

      <div class="mt-10 flex flex-col md:flex-row gap-6">
        <div class="bg-white rounded-2xl shadow-2xl p-6 flex-1 text-center hover:shadow-xl transition-shadow duration-300">
          <h4 class="text-gray-700 font-medium mb-2">Crear nuevo proyecto</h4>
          <button
            @click="goToCreateProject"
            class="bg-slate-700 text-white px-6 py-2 rounded hover:bg-slate-900 transition-colors"
          >
            Nuevo Proyecto
          </button>
        </div>

        <div class="bg-white rounded-2xl shadow-2xl p-6 flex-1 text-center hover:shadow-xl transition-shadow duration-300">
          <h4 class="text-gray-700 font-medium mb-2">Agregar nueva tarea</h4>
          <button
            @click="goToCreateTask"
            class="bg-slate-700 text-white px-6 py-2 rounded hover:bg-slate-900 transition-colors"
          >
            Nueva Tarea
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'
import { useTaskStore } from '@/stores/task'

const router = useRouter()
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

const goToCreateProject = () => {
  router.push('/projects')
}

const goToCreateTask = () => {
  router.push('/tasks')
}
</script>

<style scoped>
</style>
