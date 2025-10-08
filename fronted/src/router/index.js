import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProjectsView from '@/views/Projects/ProjectList.vue'
import TasksView from '@/views/Tasks/TaskList.vue'
import { useAuthStore } from '@/stores/auth'


const routes = [
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/", redirect: "/dashboard" }, 
  { path: "/dashboard", component: DashboardView, meta: { requiresAuth: true } },
  { path: "/projects", component: ProjectsView, meta: { requiresAuth: true } },
  { path: "/tasks", component: TasksView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && (!auth.user || !auth.token)) {
    return next("/login");
  }
  if ((to.path === "/login" || to.path === "/register") && auth.user && auth.token) {
    return next("/dashboard");
  }

  next();
});

export default router;