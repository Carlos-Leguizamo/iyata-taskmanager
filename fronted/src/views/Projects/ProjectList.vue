<template>
  <div class="p-6">
    <h2>Proyectos</h2>
    <div class="mb-4">
      <Button
        label="Nuevo proyecto"
        icon="pi pi-plus"
        @click="showDialog = true"
      />
    </div>

    <DataTable :value="projects" :paginator="true" :rows="10">
      <Column field="name" header="Nombre" />
      <Column field="description" header="Descripción" />
      <Column header="Acciones" :body="actions" />
    </DataTable>

    <Dialog v-model:visible="showDialog" header="Crear proyecto" :modal="true">
      <form @submit.prevent="create">
        <InputText v-model="form.name" placeholder="Nombre" />
        <Textarea v-model="form.description" rows="4" autoResize />

        <Button label="Guardar" type="submit" />
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";

import Textarea from "primevue/textarea";

import { useProjectStore } from "@/stores/project";

const projectStore = useProjectStore();
const showDialog = ref(false);
const form = ref({ name: "", description: "" });

onMounted(() => projectStore.fetchProjects());

const create = async () => {
  await projectStore.createProject(form.value);
  form.value = { name: "", description: "" };
  showDialog.value = false;
};

const actions = (row) => {
  return `<button class="p-button p-component p-button-text" onclick="return false">Ver</button>`;
};
</script>
