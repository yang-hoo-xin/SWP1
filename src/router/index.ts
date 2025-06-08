import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/signup',
      redirect: '/register',
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false }
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
  ],
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  console.log(`Navigation: from ${from.path} to ${to.path}`);
  
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated;
  console.log('Current authentication status:', isAuthenticated);
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  console.log('Target route requires authentication:', requiresAuth);
  
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page if not authenticated
    console.log('Not authenticated, redirecting to login page');
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    // Redirect to chat if already authenticated
    console.log('Already authenticated, redirecting from login to chat page');
    next({ name: 'chat' });
  } else {
    console.log('Normal navigation to:', to.path);
    next();
  }
})

export default router
