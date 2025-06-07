<template>
  <div class="signup-container">
    <!-- App Header -->
    <div class="app-header">
      <div class="logo">
        <div class="logo-icon-wrapper">
          <el-icon size="24"><ChatDotSquare /></el-icon>
        </div>
        <span>AI Assistant</span>
      </div>
      <div class="header-actions">
        <el-button text @click="$router.push('/help')">
          <el-icon><QuestionFilled /></el-icon>
          <span class="hidden-xs">Help</span>
        </el-button>
      </div>
    </div>

    <!-- Main Content - New Design -->
    <div class="main-content">
      <!-- 背景装饰 -->
      <div class="bg-decoration"></div>
      <div class="bg-circles">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-4"></div>
      </div>

      <!-- Centered Form -->
      <div class="signup-area">
        <div class="signup-box">
          <div class="logo-area">
            <div class="logo-animation">
              <span class="logo-icon">
                <el-icon size="36"><ChatDotSquare /></el-icon>
              </span>
            </div>
            <h1 class="animated-text">Create an Account</h1>
            <p>Join our AI community today</p>
            <div class="shine-line"></div>
          </div>
          
          <el-form :model="signupForm" :rules="signupRules" ref="signupFormRef" class="signup-form">
            <div class="form-item-animated">
              <el-form-item prop="username">
                <el-input 
                  v-model="signupForm.username" 
                  prefix-icon="User" 
                  placeholder="Username" 
                  size="large"
                  class="animate-input"
                />
              </el-form-item>
            </div>
            
            <div class="form-item-animated" style="animation-delay: 0.1s;">
              <el-form-item prop="email">
                <div class="email-container">
                  <el-input 
                    v-model="signupForm.email" 
                    prefix-icon="Message" 
                    placeholder="QQ Email" 
                    size="large"
                    class="animate-input email-input" 
                  />
                  <el-button 
                    type="primary" 
                    class="email-code-button"
                    :disabled="!isEmailValid || cooldown > 0"
                    :loading="sendingCode"
                    @click="sendVerificationCode"
                  >
                    {{ cooldown > 0 ? `${cooldown}s` : 'Get Code' }}
                  </el-button>
                </div>
                <div class="email-tips" v-if="signupForm.email">
                  <span :class="{ 'valid': isEmailValid, 'invalid': !isEmailValid && signupForm.email }">
                    <el-icon v-if="isEmailValid" size="12"><Check /></el-icon>
                    <el-icon v-else size="12"><Warning /></el-icon>
                    {{ isEmailValid ? 'Valid QQ email' : 'Please enter a valid QQ email' }}
                  </span>
                </div>
              </el-form-item>
            </div>
            
            <div class="form-item-animated" style="animation-delay: 0.12s;">
              <el-form-item prop="emailCode">
                <el-input 
                  v-model="signupForm.emailCode" 
                  prefix-icon="Key" 
                  placeholder="Email Verification Code" 
                  size="large"
                  class="animate-input"
                  maxlength="6"
                >
                  <template #append>
                    <div class="code-info-icon">
                      <el-tooltip
                        content="Enter the 6-digit code sent to your QQ email"
                        placement="top"
                      >
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            
            <div class="form-item-animated" style="animation-delay: 0.15s;">
              <el-form-item prop="password">
                <el-input 
                  v-model="signupForm.password" 
                  prefix-icon="Lock" 
                  type="password" 
                  placeholder="Password" 
                  size="large"
                  class="animate-input"
                />
              </el-form-item>
            </div>
            
            <div class="form-item-animated" style="animation-delay: 0.2s;">
              <el-form-item prop="confirmPassword">
                <el-input 
                  v-model="signupForm.confirmPassword" 
                  prefix-icon="Lock" 
                  type="password" 
                  placeholder="Confirm Password" 
                  size="large"
                  class="animate-input"
                />
              </el-form-item>
            </div>
            
            <div class="form-item-animated" style="animation-delay: 0.25s;">
              <el-form-item prop="captcha">
                <div class="captcha-container">
                  <el-input 
                    v-model="signupForm.captcha" 
                    prefix-icon="Key" 
                    placeholder="Captcha" 
                    size="large"
                    class="animate-input captcha-input" 
                  />
                  <div class="captcha-image" @click="refreshCaptcha" title="Click to refresh">
                    <img v-if="captchaImage" :src="captchaImage" alt="Captcha" />
                    <div v-else class="captcha-loading">
                      <el-icon><Loading /></el-icon>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
            
            <div class="form-item-animated" style="animation-delay: 0.3s;">
              <el-form-item prop="agreeTerms">
                <el-checkbox v-model="signupForm.agreeTerms">
                  I agree to the <el-link type="primary" underline="never" class="hover-effect">Terms of Service</el-link> and <el-link type="primary" underline="never" class="hover-effect">Privacy Policy</el-link>
                </el-checkbox>
              </el-form-item>
            </div>
            
            <div class="form-item-animated" style="animation-delay: 0.35s;">
              <el-form-item>
                <el-button 
                  type="primary" 
                  :loading="loading" 
                  class="signup-button ripple-effect" 
                  @click="handleSignup"
                >
                  <span class="button-text">Create Account</span>
                  <span class="button-icon">
                    <el-icon><ArrowRight /></el-icon>
                  </span>
                </el-button>
              </el-form-item>
            </div>
          </el-form>

          <div class="form-item-animated" style="animation-delay: 0.4s;">
            <div class="signup-footer">
              <p>Already have an account? <el-link type="primary" @click="$router.push('/login')" underline="never" class="hover-effect">Sign in</el-link></p>
            </div>
          </div>
        </div>
        
        <!-- Feature highlights in card format -->
        <div class="feature-highlights">
          <div class="feature-card">
            <el-icon size="24"><Lock /></el-icon>
            <span>Secure Account</span>
          </div>
          <div class="feature-card">
            <el-icon size="24"><Download /></el-icon>
            <span>Save Conversations</span>
          </div>
          <div class="feature-card">
            <el-icon size="24"><Share /></el-icon>
            <span>Easy Sharing</span>
          </div>
          <div class="feature-card">
            <el-icon size="24"><Setting /></el-icon>
            <span>Personalization</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- App footer -->
    <div class="app-footer">
      <div>© 2025 AI Assistant</div>
      <div class="footer-links">
        <el-link type="info" underline="never">Privacy</el-link>
        <el-link type="info" underline="never">Terms</el-link>
        <el-link type="info" underline="never">Contact</el-link>
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
.signup-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
  position: relative;
  overflow: hidden;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 100;
  border-bottom: 1px solid rgba(46, 83, 145, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 18px;
  color: #2e5391;
}

.logo-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2e5391;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  color: white;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.main-content {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f0f4fc 0%, #e9f0ff 100%);
}

/* Background decorations */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 15% 15%, rgba(46, 83, 145, 0.03) 0%, transparent 40%),
    radial-gradient(circle at 85% 85%, rgba(46, 83, 145, 0.03) 0%, transparent 40%);
  z-index: 0;
}

.bg-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(46, 83, 145, 0.03) 0%, rgba(70, 117, 196, 0.03) 100%);
  box-shadow: 0 4px 20px rgba(46, 83, 145, 0.05);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -100px;
}

.circle-2 {
  width: 500px;
  height: 500px;
  bottom: -250px;
  right: -200px;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
}

.circle-4 {
  width: 150px;
  height: 150px;
  top: 30%;
  left: 5%;
}

.signup-area {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.signup-box {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 15px 50px rgba(46, 83, 145, 0.08);
  padding: 40px;
  position: relative;
  animation: fadeInUp 0.8s ease-out;
  border: 1px solid rgba(46, 83, 145, 0.08);
}

.feature-highlights {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 500;
  color: #2e5391;
  box-shadow: 0 4px 12px rgba(46, 83, 145, 0.05);
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(46, 83, 145, 0.08);
}

.logo-area {
  text-align: center;
  margin-bottom: 30px;
}

.logo-animation {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2e5391;
  border-radius: 12px;
  width: 60px;
  height: 60px;
  color: white;
  animation: pulse 2s infinite;
}

.animated-text {
  margin: 10px 0;
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  animation: fadeIn 1.5s ease-out;
}

.shine-line {
  height: 2px;
  width: 40px;
  background: linear-gradient(90deg, transparent, #2e5391, transparent);
  margin: 16px auto;
  animation: shine 3s infinite;
}

.signup-form {
  margin-top: 20px;
}

.captcha-container {
  display: flex;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 130px;
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
  border-color: #c6e2ff;
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

.signup-button {
  width: 100%;
  margin-top: 10px;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background: linear-gradient(90deg, #2e5391, #4373c5);
  border: none;
}

.button-text {
  display: inline-block;
  transition: transform 0.3s;
}

.button-icon {
  position: absolute;
  right: 20px;
  opacity: 0;
  transition: all 0.3s;
}

.signup-button:hover .button-text {
  transform: translateX(-10px);
}

.signup-button:hover .button-icon {
  opacity: 1;
}

.signup-footer {
  margin-top: 30px;
  text-align: center;
  color: #606266;
}

/* Form animation */
.form-item-animated {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.animate-input {
  transition: all 0.3s;
}

.animate-input:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.app-footer {
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #606266;
  font-size: 14px;
  position: relative;
  z-index: 100;
  border-top: 1px solid rgba(46, 83, 145, 0.1);
}

.footer-links {
  display: flex;
  gap: 20px;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
  }
}

@keyframes shine {
  0% {
    background-position: -100px;
  }
  40%, 60% {
    background-position: 200px;
  }
  100% {
    background-position: 500px;
  }
}

/* Ripple effect for buttons */
.ripple-effect {
  position: relative;
  overflow: hidden;
}

.ripple-effect::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.5s;
}

.ripple-effect:active::after {
  transform: scale(2);
  opacity: 0;
  transition: 0s;
}

/* Hover effect for links */
.hover-effect {
  position: relative;
}

.hover-effect::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: currentColor;
  transform: scaleX(0);
  transition: transform 0.3s;
}

.hover-effect:hover::after {
  transform: scaleX(1);
}

.email-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.email-input {
  flex: 1;
}

.email-code-button {
  min-width: 100px;
  height: 40px;
  transition: all 0.3s;
  font-size: 14px;
  white-space: nowrap;
  background: linear-gradient(90deg, #2e5391, #4373c5);
  border: none;
  position: relative;
  overflow: hidden;
}

.email-code-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s;
}

.email-code-button:hover::before {
  left: 100%;
}

.email-code-button:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.email-tips {
  font-size: 12px;
  margin-top: 5px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.valid {
  color: #67c23a;
  display: flex;
  align-items: center;
  gap: 4px;
}

.invalid {
  color: #f56c6c;
  display: flex;
  align-items: center;
  gap: 4px;
}

.code-info-icon {
  color: #909399;
  cursor: pointer;
  transition: all 0.3s;
}

.code-info-icon:hover {
  color: #2e5391;
}

/* Responsive styles */
@media (max-width: 768px) {
  .feature-highlights {
    flex-direction: column;
    max-width: 450px;
    width: 100%;
  }
  
  .feature-card {
    width: 100%;
    justify-content: center;
  }
  
  .captcha-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .captcha-image {
    width: 100%;
    height: 50px;
  }
  
  .email-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .email-code-button {
    height: 36px;
    width: 100%;
  }
  
  .signup-box {
    padding: 30px 20px;
  }
  
  .app-header, .app-footer {
    padding: 12px 15px;
  }
}

@media (max-width: 576px) {
  .hidden-xs {
    display: none;
  }
  
  .signup-area {
    padding: 10px 0;
  }
  
  .animated-text {
    font-size: 22px;
  }
}
</style> 