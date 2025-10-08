<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 p-6"
  >
    <div
      class="flex overflow-hidden rounded-lg shadow-2xl w-full"
      style="max-width: 900px; min-height: 550px"
    >
      <div class="flex-1 bg-white p-12 flex flex-col justify-center">
        <div class="mb-10 text-center">
          <h2 class="text-4xl font-light text-gray-800 mb-2">Crear cuenta</h2>
          <p class="text-sm text-gray-500">Únete a Iyata TaskManager</p>
        </div>

        <Form
          @submit="onSubmit"
          :validation-schema="schema"
          class="space-y-5"
          v-slot="{ handleSubmit }"
        >
          <div>
            <Field name="name" v-slot="{ field }">
              <InputText
                v-bind="field"
                type="text"
                placeholder="Nombre completo"
                class="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 transition-all"
              />
            </Field>
            <ErrorMessage
              name="name"
              class="text-xs text-red-500 mt-1 block ml-1"
            />
          </div>

          <div>
            <Field name="email" v-slot="{ field }">
              <InputText
                v-bind="field"
                type="email"
                placeholder="Correo electrónico"
                class="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 transition-all"
              />
            </Field>
            <ErrorMessage
              name="email"
              class="text-xs text-red-500 mt-1 block ml-1"
            />
          </div>

          <div>
            <Field name="password" v-slot="{ field }">
              <div class="relative">
                <input
                  v-bind="field"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Contraseña"
                  class="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 transition-all"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                >
                  <i
                    :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                    class="text-gray-400 hover:text-gray-600 transition-colors text-sm"
                  ></i>
                </button>
              </div>
            </Field>
            <ErrorMessage
              name="password"
              class="text-xs text-red-500 mt-1 block ml-1"
            />
          </div>

          <div>
            <Field name="password_confirmation" v-slot="{ field }">
              <div class="relative">
                <input
                  v-bind="field"
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  placeholder="Confirmar contraseña"
                  class="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 transition-all"
                />
                <button
                  type="button"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                >
                  <i
                    :class="
                      showPasswordConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'
                    "
                    class="text-gray-400 hover:text-gray-600 transition-colors text-sm"
                  ></i>
                </button>
              </div>
            </Field>
            <ErrorMessage
              name="password_confirmation"
              class="text-xs text-red-500 mt-1 block ml-1"
            />
          </div>

          <div class="w-full flex justify-center mt-5">
            <Button
              @click="handleSubmit(onSubmit)"
              label="Registrarse"
              class="bg-transparent border-2 border-white text-white font-light text-base tracking-widest px-10 py-3 rounded hover:bg-white hover:text-slate-800 transition-all duration-300 cursor-pointer uppercase"
            />
          </div>
        </Form>

        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-xs text-gray-500 text-center">
            ¿Ya tienes cuenta?
            <RouterLink
              to="/login"
              class="text-slate-600 hover:text-slate-800 font-medium ml-1 transition-colors"
            >
              Inicia sesión
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Swal from "sweetalert2";

const router = useRouter();
const auth = useAuthStore();
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const schema = yup.object({
  name: yup.string().required("Campo obligatorio"),
  email: yup.string().email("Correo inválido").required("Campo obligatorio"),
  password: yup
    .string()
    .min(6, "Debe tener al menos 6 caracteres")
    .required("Campo obligatorio"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});

const onSubmit = async (values) => {
  try {
    await auth.register(values);
    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: "Tu cuenta ha sido creada correctamente.",
      confirmButtonText: "Ir a login",
      confirmButtonColor: "#475569",
      background: "#ffffff",
      color: "#1f2937",
    }).then(() => {
      router.push("/login");
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error al registrar",
      text: "Intenta nuevamente con otros datos.",
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#475569",
      background: "#ffffff",
      color: "#1f2937",
    });
  }
};
</script>

<style scoped>
.flex.overflow-hidden {
  animation: fadeInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
