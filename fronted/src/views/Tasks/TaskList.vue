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
          @click="openCreate"
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
        <Column header="Estado">
          <template #body="{ data }">
            {{ getStatusLabel(data.status) }}
          </template>
        </Column>
        <Column header="Proyecto">
          <template #body="{ data }">
            {{ data.project_name || "N/A" }}
          </template>
        </Column>

        <Column header="Acciones">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-info p-mr-2"
              @click="openEdit(data)"
              tooltip="Editar"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-danger"
              @click="confirmDelete(data.id, data.title)"
              tooltip="Eliminar"
            />
          </template>
        </Column>
      </DataTable>

      <Dialog
        v-model:visible="show"
        :header="editing ? 'Editar tarea' : 'Crear tarea'"
        :modal="true"
        :closable="true"
        class="w-full max-w-md rounded-lg shadow-2xl"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      >
        <form @submit.prevent="saveTask" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Proyecto</label>
            <Dropdown
              :options="projectOptions"
              optionLabel="name"
              v-model="form.project_id"
              placeholder="Selecciona un proyecto"
              class="w-full"
              required
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
              required
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
import Swal from "sweetalert2";
const taskStore = useTaskStore();
const projectStore = useProjectStore();

const show = ref(false);
const editing = ref(false);
const form = ref({
  id: null,
  project_id: null,
  title: "",
  description: "",
  status: "todo",
});

const rowsPerPage = ref(10);
const currentPage = ref(1);

const statusOptions = [
  { label: "Por Hacer", value: "todo" },
  { label: "En Progreso", value: "in_progress" },
  { label: "Hecho", value: "done" },
];

const getStatusLabel = (statusValue) => {
  const status = statusOptions.find((s) => s.value === statusValue);
  return status ? status.label : statusValue;
};

const tasks = computed(() => taskStore.tasks);
const projectOptions = computed(() => projectStore.projects);
const totalTasks = computed(() => taskStore.tasks.length);

onMounted(async () => {
  await projectStore.fetchProjects();
  await taskStore.fetchTasks();
});

const openCreate = () => {
  editing.value = false;
  form.value = {
    id: null,
    project_id: null,
    title: "",
    description: "",
    status: "todo",
  };
  show.value = true;
};

const openEdit = (task) => {
  editing.value = true;
  form.value = {
    id: task.id,
    project_id: task.project_id,
    title: task.title,
    description: task.description,
    status: task.status,
  };
  show.value = true;
};

const saveTask = async () => {
  try {
    const payload = {
      project_id: form.value.project_id?.id || form.value.project_id,
      title: form.value.title,
      description: form.value.description,
      status: form.value.status,
    };

    if (editing.value) {
      await taskStore.updateTask(form.value.id, payload);
      Swal.fire("Actualizado", "Tarea actualizada correctamente", "success");
    } else {
      await taskStore.createTask(payload);
      Swal.fire("Creado", "Tarea creada correctamente", "success");
    }

    show.value = false;
    form.value = {
      id: null,
      project_id: null,
      title: "",
      description: "",
      status: "todo",
    };
    await taskStore.fetchTasks(currentPage.value);
  } catch {
    Swal.fire("Error", "Ocurrió un error, intenta nuevamente", "error");
  }
};

const confirmDelete = (id, title) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: `Se eliminará la tarea "${title}"`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#475569",
    cancelButtonColor: "#9CA3AF",
    confirmButtonText: "Sí, eliminar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await taskStore.deleteTask(id);
      Swal.fire("Eliminado", "La tarea fue eliminada", "success");
      await taskStore.fetchTasks(currentPage.value);
    }
  });
};

const onPageChange = (event) => {
  currentPage.value = event.page + 1;
  taskStore.fetchTasks(currentPage.value);
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
