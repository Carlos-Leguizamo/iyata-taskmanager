<template>
  <div
    class="min-h-screen p-6 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 flex justify-center"
  >
    <div
      class="w-full max-w-5xl bg-white rounded-lg shadow-2xl p-8 flex flex-col"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-light text-gray-800">Proyectos</h2>
        <Button
          label="Nuevo proyecto"
          icon="pi pi-plus"
          class="bg-slate-700 text-white hover:bg-slate-900 transition-colors"
          @click="show = true"
        />
      </div>

      <DataTable
        :value="projects"
        :paginator="true"
        :rows="rowsPerPage"
        :totalRecords="totalProjects"
        :lazy="true"
        @page="onPageChange"
        class="rounded-lg shadow-md overflow-hidden"
        :rowsPerPageOptions="[5, 10, 20]"
      >
        <Column field="name" header="Nombre" />
        <Column field="description" header="Descripción" />
        <Column field="tasks_count" header="Tareas" />
        <Column header="Acciones" :body="actions" />
      </DataTable>

      <Dialog
        v-model:visible="show"
        header="Crear proyecto"
        :modal="true"
        :closable="true"
        class="w-full max-w-md rounded-lg shadow-2xl"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      >
        <form @submit.prevent="create" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nombre</label>
            <InputText
              v-model="form.name"
              placeholder="Nombre del proyecto"
              class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
              required
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Descripción</label>
            <Textarea
              v-model="form.description"
              placeholder="Descripción del proyecto"
              rows="4"
              autoResize
              class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
            />
          </div>
          <div class="flex justify-end">
            <Button
              label="Guardar"
              type="submit"
              class="bg-slate-700 text-white hover:bg-slate-900 transition-colors"
            />
          </div>
        </form>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useProjectStore } from "@/stores/project";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";

const projectStore = useProjectStore();
const show = ref(false);
const form = ref({ name: "", description: "" });
const rowsPerPage = ref(10);
const currentPage = ref(1);
const fetchProjects = async (page = 1) => {
  await projectStore.fetchProjects(page);
  currentPage.value = page;
};

onMounted(() => fetchProjects());

const projects = computed(() => projectStore.projects);
const totalProjects = computed(() => projectStore.projects.length);

const create = async () => {
  await projectStore.createProject(form.value);
  form.value = { name: "", description: "" };
  show.value = false;
  fetchProjects(currentPage.value);
};

const onPageChange = (event) => {
  fetchProjects(event.page + 1);
};

const actions = (row) => {
  return `<button class="p-button p-component p-button-text" onclick="return false">Ver</button>`;
};
</script>

<style scoped>
.p-datatable {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

:deep(.p-dialog) {
  border-radius: 0.75rem;
  z-index: 1000;
}

:deep(.p-button) {
  transition: all 0.3s ease;
}
</style>
