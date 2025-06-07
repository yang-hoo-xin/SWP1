import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
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
      name: 'signup',
      component: SignupView,
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
  console.log(`路由导航: 从 ${from.path} 到 ${to.path}`);
  
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated;
  console.log('当前认证状态:', isAuthenticated);
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  console.log('目标路由需要认证:', requiresAuth);
  
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page if not authenticated
    console.log('未认证，重定向到登录页面');
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    // Redirect to chat if already authenticated
    console.log('已认证，从登录页重定向到聊天页面');
    next({ name: 'chat' });
  } else {
    console.log('正常导航到:', to.path);
    next();
  }
})

export default router
