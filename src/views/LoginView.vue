<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-area">
        <h1>AI Assistant</h1>
        <p>Your intelligent conversation partner</p>
      </div>
      
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            prefix-icon="User" 
            placeholder="Username" 
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            prefix-icon="Lock" 
            type="password" 
            placeholder="Password" 
            size="large" 
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item class="login-options">
          <el-checkbox v-model="loginForm.rememberMe">Remember me</el-checkbox>
          <el-link type="primary" :underline="false">Forgot password?</el-link>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading" 
            class="login-button" 
            @click="handleLogin"
          >
            Login
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'

// Router and auth store
const router = useRouter()
const authStore = useAuthStore()

// Form data
const loginFormRef = ref()
const loading = ref(false)
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// Form validation rules
const loginRules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
  ]
}

// Handle login
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        // For demo purposes, accept any username/password
        // In a real app, you would call an API endpoint
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Store authentication info
        authStore.login({
          username: loginForm.username,
          token: 'demo-token-' + Date.now(),
          rememberMe: loginForm.rememberMe
        })
        
        ElMessage.success('Login successful')
        router.push('/chat')
      } catch (error) {
        ElMessage.error('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginView'
})
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.logo-area {
  text-align: center;
  margin-bottom: 35px;
  
  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #303133;
  }
  
  p {
    font-size: 16px;
    color: #909399;
    margin: 0;
  }
}

.login-form {
  .login-options {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    align-items: center;
  }
  
  .login-button {
    width: 100%;
    height: 46px;
    font-size: 16px;
  }
}
</style> 