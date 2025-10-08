<template>
  <div class="p-6">
    <h2>Tareas</h2>
    <Button label="Nueva tarea" icon="pi pi-plus" @click="show = true" />
    <DataTable :value="tasks">
      <Column field="title" header="Título" />
      <Column field="status" header="Estado" />
      <Column header="Proyecto" :body="(row) => row.project?.name" />
    </DataTable>

    <Dialog v-model:visible="show" header="Crear tarea">
      <form @submit.prevent="create">
        <Dropdown
          :options="projectOptions"
          optionLabel="name"
          v-model="form.project_id"
          placeholder="Proyecto"
        />
        <InputText v-model="form.title" placeholder="Título" />
        <Textarea v-model="form.description" rows="3" />
        <Dropdown
          v-model="form.status"
          :options="statusOptions"
          placeholder="Estado"
        />
        <Button label="Guardar" />
      </form>
    </Dialog>
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
import Textarea from 'primevue/textarea'


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
const statusOptions = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

onMounted(async () => {
  await projectStore.fetchProjects();
  await taskStore.fetchTasks();
});

const projectOptions = computed(() => projectStore.projects);
const create = async () => {
  await taskStore.createTask(form.value);
  form.value = { project_id: null, title: "", description: "", status: "todo" };
  show.value = false;
};
</script>
