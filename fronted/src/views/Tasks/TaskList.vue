<template>
  <div
    class="min-h-screen p-6 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 flex justify-center"
  >
    <div
      class="w-full max-w-5xl bg-white rounded-lg shadow-2xl p-8 flex flex-col"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-light text-gray-800">Tareas</h2>
        <Button
          label="Nueva tarea"
          icon="pi pi-plus"
          class="bg-slate-700 text-white hover:bg-slate-900 transition-colors"
          @click="show = true"
        />
      </div>

      <DataTable
        :value="tasks"
        :paginator="true"
        :rows="rowsPerPage"
        :totalRecords="totalTasks"
        :lazy="true"
        @page="onPageChange"
        class="rounded-lg shadow-md overflow-hidden"
        :rowsPerPageOptions="[5, 10, 20]"
      >
        <Column field="title" header="Título" />
        <Column field="status" header="Estado" />
        <Column header="Proyecto" :body="(row) => row.project?.name" />
        <Column header="Acciones" :body="actions" />
      </DataTable>

      <Dialog
        v-model:visible="show"
        header="Crear tarea"
        :modal="true"
        :closable="true"
        class="w-full max-w-md rounded-lg shadow-2xl"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      >
        <form @submit.prevent="create" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Proyecto</label>
            <Dropdown
              :options="projectOptions"
              optionLabel="name"
              v-model="form.project_id"
              placeholder="Selecciona un proyecto"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Título</label>
            <InputText
              v-model="form.title"
              placeholder="Título de la tarea"
              class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
              required
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Descripción</label>
            <Textarea
              v-model="form.description"
              rows="3"
              placeholder="Descripción de la tarea"
              class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Estado</label>
            <Dropdown
              v-model="form.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona un estado"
              class="w-full"
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
import { useTaskStore } from "@/stores/task";
import { useProjectStore } from "@/stores/project";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";

const taskStore = useTaskStore();
const projectStore = useProjectStore();

const show = ref(false);
const form = ref({
  project_id: null,
  title: "",
  description: "",
  status: "todo",
});
const rowsPerPage = ref(10);
const currentPage = ref(1);

const statusOptions = [
  { label: "Por Hacer", value: "todo" },
  { label: "En Progeso", value: "in_progress" },
  { label: "Hecho", value: "done" },
];

onMounted(async () => {
  await projectStore.fetchProjects();
  await taskStore.fetchTasks();
});

const tasks = computed(() => taskStore.tasks);
const projectOptions = computed(() => projectStore.projects);
const totalTasks = computed(() => taskStore.tasks.length);

const create = async () => {
  await taskStore.createTask({
    project_id: form.value.project_id?.id || form.value.project_id,
    title: form.value.title,
    description: form.value.description,
    status: form.value.status?.value || form.value.status,
  });

  form.value = { project_id: null, title: "", description: "", status: "todo" };
  show.value = false;
  await taskStore.fetchTasks();
};

const onPageChange = (event) => {
  currentPage.value = event.page + 1;
  taskStore.fetchTasks(currentPage.value);
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
