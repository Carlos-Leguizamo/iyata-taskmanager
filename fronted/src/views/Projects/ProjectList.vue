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
          @click="openCreate"
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
        <Column header="Acciones">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-info p-mr-2"
              @click="openEdit(data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-danger"
              @click="confirmDelete(data.id, data.name)"
            />
          </template>
        </Column>
      </DataTable>

      <Dialog
        v-model:visible="showDialog"
        :header="editing ? 'Editar proyecto' : 'Crear proyecto'"
        :modal="true"
        :closable="true"
        class="w-full max-w-md rounded-lg shadow-2xl"
      >
        <form @submit.prevent="saveProject" class="space-y-4">
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
import { ref, computed, onMounted } from "vue";
import { useProjectStore } from "@/stores/project";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Swal from "sweetalert2";

const projectStore = useProjectStore();

const showDialog = ref(false);
const editing = ref(false);
const form = ref({ id: null, name: "", description: "" });

const rowsPerPage = ref(10);
const currentPage = ref(1);

const fetchProjects = async (page = 1) => {
  await projectStore.fetchProjects(page);
  currentPage.value = page;
};

onMounted(() => fetchProjects());

const projects = computed(() => projectStore.projects);
const totalProjects = computed(() => projectStore.projects.length);

const openCreate = () => {
  editing.value = false;
  form.value = { id: null, name: "", description: "" };
  showDialog.value = true;
};

const openEdit = (data) => {
  editing.value = true;
  form.value = { id: data.id, name: data.name, description: data.description };
  showDialog.value = true;
};

const saveProject = async () => {
  try {
    if (editing.value) {
      await projectStore.updateProject(form.value.id, {
        name: form.value.name,
        description: form.value.description,
      });
      Swal.fire("Actualizado", "Proyecto actualizado correctamente", "success");
    } else {
      await projectStore.createProject({
        name: form.value.name,
        description: form.value.description,
      });
      Swal.fire("Creado", "Proyecto creado correctamente", "success");
    }
    showDialog.value = false;
    fetchProjects(currentPage.value);
  } catch (error) {
    Swal.fire("Error", "Ocurrió un error, intenta nuevamente", "error");
  }
};

const confirmDelete = (id, name) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: `Se eliminará el proyecto "${name}"`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#475569",
    cancelButtonColor: "#9CA3AF",
    confirmButtonText: "Sí, eliminar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await projectStore.deleteProject(id);
      Swal.fire("Eliminado", "El proyecto fue eliminado", "success");
      fetchProjects(currentPage.value);
    }
  });
};

const onPageChange = (event) => {
  fetchProjects(event.page + 1);
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
