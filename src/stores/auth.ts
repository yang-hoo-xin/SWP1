import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  username: string;
  token: string;
  rememberMe?: boolean;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  
  // Check if there's a stored token on initialization
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch (e) {
      console.error('Failed to parse stored user data:', e)
      localStorage.removeItem('user')
    }
  }
  
  // Login handler
  const login = (userData: User) => {
    user.value = userData
    
    // Store user data if rememberMe is selected
    if (userData.rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }
  
  // Logout handler
  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }
  
  return {
    user,
    isAuthenticated,
    login,
    logout
  }
}) 