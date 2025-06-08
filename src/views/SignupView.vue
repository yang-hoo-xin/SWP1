<template>
  <div class="signup-container">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="logo">
        <el-icon><ChatDotSquare /></el-icon>
        <span>AI Assistant</span>
      </div>
      <div class="nav-links">
        <el-button text @click="$router.push('/help')">
          <el-icon><QuestionFilled /></el-icon>
          <span>Help</span>
        </el-button>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-container">
      <!-- 动态背景效果 -->
      <div class="animated-bg">
        <div class="gradient-bg"></div>
        <div class="floating-bubbles">
          <div v-for="i in 20" :key="`bubble-${i}`" class="bubble"
            :style="{
              '--size': `${10 + Math.random() * 50}px`,
              '--x': `${Math.random() * 100}vw`,
              '--y': `${Math.random() * 100}vh`,
              '--delay': `${Math.random() * 5}s`,
              '--duration': `${15 + Math.random() * 15}s`,
              '--opacity': `${0.05 + Math.random() * 0.1}`
            }"
          ></div>
        </div>
      </div>

      <!-- 注册表单区域 -->
      <div class="signup-form-container">
        <div class="form-card">
          <div class="form-header">
            <div class="icon-container">
              <el-icon><ChatDotSquare /></el-icon>
            </div>
            <h1>Create an Account</h1>
            <p>Join our AI community today</p>
          </div>

          <el-form :model="signupForm" :rules="signupRules" ref="signupFormRef" class="signup-form">
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input 
                v-model="signupForm.username" 
                prefix-icon="User" 
                placeholder="Username" 
                size="large"
              />
            </el-form-item>
            
            <!-- 电子邮箱 -->
            <el-form-item prop="email">
              <div class="email-input-group">
                <el-input 
                  v-model="signupForm.email" 
                  prefix-icon="Message" 
                  placeholder="QQ Email" 
                  size="large"
                  class="email-input"
                />
                <el-button 
                  type="primary" 
                  class="code-button"
                  :disabled="!isEmailValid || cooldown > 0"
                  :loading="sendingCode"
                  @click="sendVerificationCode"
                >
                  {{ cooldown > 0 ? `${cooldown}s` : 'Get Code' }}
                </el-button>
              </div>
              <div class="input-tip" v-if="signupForm.email">
                <span :class="{ 'valid': isEmailValid, 'invalid': !isEmailValid }">
                  <el-icon v-if="isEmailValid"><Check /></el-icon>
                  <el-icon v-else><Warning /></el-icon>
                  {{ isEmailValid ? 'Valid QQ email' : 'Please enter a valid QQ email' }}
                </span>
              </div>
            </el-form-item>
            
            <!-- 验证码 -->
            <el-form-item prop="emailCode">
              <el-input 
                v-model="signupForm.emailCode" 
                prefix-icon="Key" 
                placeholder="Email Verification Code" 
                size="large"
                maxlength="6"
              >
                <template #append>
                  <el-tooltip content="Enter the 6-digit code sent to your QQ email" placement="top">
                    <el-icon><InfoFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
            
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input 
                v-model="signupForm.password" 
                prefix-icon="Lock" 
                type="password" 
                placeholder="Password" 
                size="large"
                show-password
              />
            </el-form-item>
            
            <!-- 确认密码 -->
            <el-form-item prop="confirmPassword">
              <el-input 
                v-model="signupForm.confirmPassword" 
                prefix-icon="Lock" 
                type="password" 
                placeholder="Confirm Password" 
                size="large"
                show-password
              />
            </el-form-item>
            
            <!-- 验证码 -->
            <el-form-item prop="captcha">
              <div class="captcha-group">
                <el-input 
                  v-model="signupForm.captcha" 
                  prefix-icon="Key" 
                  placeholder="Captcha" 
                  size="large"
                  class="captcha-input"
                />
                <div 
                  class="captcha-image" 
                  @click="refreshCaptcha" 
                  title="Click to refresh"
                >
                  <img v-if="captchaImage" :src="captchaImage" alt="Captcha" />
                  <div v-else class="captcha-loading">
                    <el-icon><Loading /></el-icon>
                  </div>
                </div>
              </div>
            </el-form-item>
            
            <!-- 服务条款 -->
            <el-form-item prop="agreeTerms" class="terms-checkbox">
              <el-checkbox v-model="signupForm.agreeTerms">
                I agree to the <el-link type="primary">Terms of Service</el-link> and <el-link type="primary">Privacy Policy</el-link>
              </el-checkbox>
            </el-form-item>
            
            <!-- 提交按钮 -->
            <el-form-item>
              <el-button 
                type="primary" 
                :loading="loading" 
                class="submit-button" 
                @click="handleSignup"
              >
                Create Account
              </el-button>
            </el-form-item>
          </el-form>

          <div class="form-footer">
            <p>Already have an account? <el-link type="primary" @click="$router.push('/login')">Sign in</el-link></p>
          </div>
        </div>

        <!-- 特性介绍 -->
        <div class="features">
          <div class="feature">
            <div class="feature-icon">
              <el-icon><Lock /></el-icon>
            </div>
            <div class="feature-text">
              <h3>Secure Account</h3>
              <p>Enterprise-grade security and data protection</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <el-icon><Download /></el-icon>
            </div>
            <div class="feature-text">
              <h3>Save Conversations</h3>
              <p>Access your history anytime, anywhere</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <el-icon><Share /></el-icon>
            </div>
            <div class="feature-text">
              <h3>Easy Sharing</h3>
              <p>Share AI conversations with one click</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <span>© 2025 AI Assistant</span>
      <div class="footer-links">
        <el-link type="info">Privacy</el-link>
        <el-link type="info">Terms</el-link>
        <el-link type="info">Contact</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../api/auth'
import type { RegisterParams } from '../types/user'
import { 
  Check, Warning, InfoFilled, 
  ChatDotSquare, QuestionFilled, User, Message, 
  Key, Lock, Loading, ArrowRight, Share, 
  Download, Setting 
} from '@element-plus/icons-vue'

// Router and auth store
const router = useRouter()
const authStore = useAuthStore()

// Form data
const signupFormRef = ref()
const loading = ref(false)
const captchaImage = ref('')
const captchaUuid = ref('')
const sendingCode = ref(false)
const cooldown = ref(0)
const cooldownTimer = ref<number | null>(null)

const signupForm = reactive<RegisterParams & { emailCode: string }>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  emailCode: '',
  captcha: '',
  captchaUuid: '',
  agreeTerms: false
})

// Check if email is a valid QQ email
const isEmailValid = computed(() => {
  const qqEmailRegex = /^[1-9][0-9]{4,}@qq\.com$/
  return qqEmailRegex.test(signupForm.email)
})

// Form validation rules
const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else if (value.length < 6) {
    callback(new Error('Password must be at least 6 characters'))
  } else {
    callback()
  }
}

const validatePassConfirm = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Please confirm your password'))
  } else if (value !== signupForm.password) {
    callback(new Error('Passwords do not match'))
  } else {
    callback()
  }
}

const validateEmail = (rule: any, value: string, callback: any) => {
  const qqEmailRegex = /^[1-9][0-9]{4,}@qq\.com$/
  if (value === '') {
    callback(new Error('Please input email address'))
  } else if (!qqEmailRegex.test(value)) {
    callback(new Error('Please input a valid QQ email address'))
  } else {
    callback()
  }
}

const validateEmailCode = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Please input email verification code'))
  } else if (!/^\d{6}$/.test(value)) {
    callback(new Error('Verification code must be 6 digits'))
  } else {
    callback()
  }
}

const signupRules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
    { min: 3, message: 'Username must be at least 3 characters', trigger: 'blur' }
  ],
  password: [
    { validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validatePassConfirm, trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ],
  emailCode: [
    { validator: validateEmailCode, trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: 'Please enter captcha', trigger: 'blur' }
  ],
  agreeTerms: [
    { 
      validator: (rule: any, value: boolean, callback: any) => {
        if (!value) {
          callback(new Error('You must agree to the terms'))
        } else {
          callback()
        }
      }, 
      trigger: 'change'
    }
  ]
}

// Start cooldown timer
const startCooldown = () => {
  cooldown.value = 60
  if (cooldownTimer.value) {
    clearInterval(cooldownTimer.value)
  }
  cooldownTimer.value = window.setInterval(() => {
    if (cooldown.value > 0) {
      cooldown.value--
    } else {
      if (cooldownTimer.value) {
        clearInterval(cooldownTimer.value)
        cooldownTimer.value = null
      }
    }
  }, 1000)
}

// Send email verification code
const sendVerificationCode = async () => {
  if (!isEmailValid.value || cooldown.value > 0 || sendingCode.value) {
    return
  }
  
  try {
    sendingCode.value = true
    await authApi.sendEmailCode(signupForm.email)
    ElMessage.success('Verification code has been sent to your email')
    startCooldown()
  } catch (error: any) {
    ElMessage.error(error.message || 'Failed to send verification code')
  } finally {
    sendingCode.value = false
  }
}

// Load captcha on component mount
onMounted(() => {
  refreshCaptcha()
})

// Refresh captcha
const refreshCaptcha = async () => {
  try {
    loading.value = true
    captchaImage.value = ''
    
    const { uuid, img } = await authApi.getCaptcha()
    captchaImage.value = img
    captchaUuid.value = uuid
    signupForm.captchaUuid = uuid
  } catch (error) {
    console.error('Failed to load captcha:', error)
    ElMessage.error('Failed to load captcha')
  } finally {
    loading.value = false
  }
}

// Handle signup form submission
const handleSignup = async () => {
  if (!signupFormRef.value) return
  
  await signupFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        loading.value = true
        // 验证邮箱验证码
        await authApi.verifyEmailCode(signupForm.email, signupForm.emailCode)
        await authApi.register(signupForm)
        ElMessage.success('Registration successful! Please log in.')
        router.push('/login')
      } catch (error: any) {
        console.error('Signup failed:', error)
        ElMessage.error(error.message || 'Registration failed')
        // Refresh captcha on failure
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    } else {
      return false
    }
  })
}

// Cleanup on unmount
onUnmounted(() => {
  if (cooldownTimer.value) {
    clearInterval(cooldownTimer.value)
  }
})
</script>

<style scoped>
/* 全局容器 */
.signup-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #333;
  font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 100;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1.2rem;
  color: #335599;
}

.logo .el-icon {
  color: #335599;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

/* 主容器 */
.main-container {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  overflow: hidden;
}

/* 动态背景 */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.gradient-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(125deg, #e8f0ff 0%, #d9e8ff 40%, #cce0ff 80%, #e0f0ff 100%);
}

.floating-bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.bubble {
  position: absolute;
  width: var(--size);
  height: var(--size);
  left: var(--x);
  top: var(--y);
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(121, 159, 225, var(--opacity)));
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.5);
  animation: float var(--duration) infinite ease-in-out;
  animation-delay: var(--delay);
  opacity: var(--opacity);
  transform: scale(0.8);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(0.8);
  }
  50% {
    transform: translateY(-20px) scale(1);
  }
}

/* 注册表单容器 */
.signup-form-container {
  display: flex;
  max-width: 1100px;
  width: 100%;
  z-index: 1;
  gap: 2rem;
  position: relative;
}

/* 表单卡片 */
.form-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(51, 85, 153, 0.1);
  padding: 2rem;
  flex: 1;
  max-width: 480px;
  animation: fadeIn 0.8s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #335599;
  margin: 1rem 0 0.5rem;
}

.form-header p {
  color: #666;
  font-size: 1rem;
}

.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #335599, #5577bb);
  border-radius: 50%;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(51, 85, 153, 0.2);
}

.icon-container .el-icon {
  font-size: 2rem;
  color: white;
}

/* 表单样式 */
.signup-form {
  margin-top: 1.5rem;
}

.el-input {
  --el-input-hover-border: #5577bb;
  --el-input-focus-border: #335599;
}

.el-form-item {
  margin-bottom: 1.2rem;
}

/* 邮箱输入组 */
.email-input-group {
  display: flex;
  gap: 0.5rem;
}

.email-input {
  flex: 1;
}

.code-button {
  background: linear-gradient(135deg, #335599, #5577bb);
  border: none;
  border-radius: 6px;
  height: 40px;
  min-width: 100px;
  transition: all 0.3s;
}

.code-button:hover {
  background: linear-gradient(135deg, #2a4580, #4466aa);
  transform: translateY(-2px);
}

.code-button:disabled {
  background: #a0cfff;
  transform: none;
}

/* 输入提示 */
.input-tip {
  margin-top: 0.3rem;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}

.valid {
  color: #67c23a;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.invalid {
  color: #f56c6c;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* 验证码组 */
.captcha-group {
  display: flex;
  gap: 0.5rem;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 120px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

.captcha-image:hover {
  border-color: #5577bb;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.captcha-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #909399;
}

/* 条款复选框 */
.terms-checkbox {
  margin-top: 0.5rem;
}

.terms-checkbox .el-checkbox {
  display: flex;
  align-items: flex-start;
}

/* 提交按钮 */
.submit-button {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, #335599, #5577bb);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: all 0.3s;
}

.submit-button:hover {
  background: linear-gradient(135deg, #2a4580, #4466aa);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(51, 85, 153, 0.2);
}

/* 表单页脚 */
.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

/* 特性展示 */
.features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  margin-top: 1rem;
}

.feature {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 5px 15px rgba(51, 85, 153, 0.05);
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(51, 85, 153, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #335599, #5577bb);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon .el-icon {
  font-size: 1.5rem;
  color: white;
}

.feature-text {
  flex: 1;
}

.feature-text h3 {
  margin: 0 0 0.3rem;
  font-size: 1.1rem;
  color: #335599;
}

.feature-text p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* 页脚 */
.footer {
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #666;
  font-size: 0.9rem;
  z-index: 100;
  position: relative;
  border-top: 1px solid rgba(51, 85, 153, 0.1);
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links .el-link {
  font-size: 0.9rem;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .signup-form-container {
    flex-direction: column;
    align-items: center;
  }
  
  .form-card {
    max-width: 100%;
  }
  
  .features {
    flex-direction: row;
    max-width: 100%;
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 1rem;
  }
  
  .form-card {
    padding: 1.5rem;
  }
  
  .features {
    flex-direction: column;
  }
  
  .top-nav, .footer {
    padding: 0.8rem 1rem;
  }
}

@media (max-width: 576px) {
  .email-input-group {
    flex-direction: column;
  }
  
  .code-button {
    width: 100%;
  }
  
  .captcha-group {
    flex-direction: column;
  }
  
  .captcha-image {
    width: 100%;
    height: 50px;
  }
  
  .icon-container {
    width: 50px;
    height: 50px;
  }
  
  .form-header h1 {
    font-size: 1.5rem;
  }
}
</style> 