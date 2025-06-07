import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '../types/user'

interface User {
  username: string;
  token: string;
  rememberMe?: boolean;
  user?: UserInfo; // 使用导入的UserInfo类型
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => {
    const hasUser = !!user.value;
    const hasToken = !!localStorage.getItem('token');
    console.log('Auth check - hasUser:', hasUser, 'hasToken:', hasToken);
    return hasUser || hasToken;  // 只要有一个为true，就认为已认证
  })
  
  // Check if there's a stored token on initialization
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
      console.log('Loaded stored user from localStorage:', user.value?.username);
    } catch (e) {
      console.error('Failed to parse stored user data:', e)
      localStorage.removeItem('user')
    }
  } else if (localStorage.getItem('token')) {
    // 如果有token但没有用户数据，尝试创建一个最小用户对象
    user.value = {
      username: 'user',  // 默认用户名
      token: localStorage.getItem('token') || ''
    };
    console.log('Created user object from token only');
  }
  
  // Login handler
  const login = (userData: User) => {
    console.log('Login called with userData:', userData);
    user.value = userData
    
    // 无论如何都存储token
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    // Store user data if rememberMe is selected
    if (userData.rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }
  
  // Logout handler
  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
  
  return {
    user,
    isAuthenticated,
    login,
    logout
  }
}) 