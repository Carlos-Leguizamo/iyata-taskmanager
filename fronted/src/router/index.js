import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProjectsView from '@/views/Projects/ProjectList.vue'
import TasksView from '@/views/Tasks/TaskList.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/login', component: LoginView, name: 'login' },
  { path: '/register', component: RegisterView, name: 'register' },
  { path: '/', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/projects', component: ProjectsView, meta: { requiresAuth: true } },
  { path: '/tasks', component: TasksView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) return next('/login');
  next();
});

export default router;
