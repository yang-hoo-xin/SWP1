<template>
  <div class="login-container">
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

    <!-- Main Content - Split Layout -->
    <div class="main-content">
      <!-- 粒子动画效果的替代方案 - 使用纯CSS -->
      <div class="particle-container">
        <div v-for="i in 20" :key="`p-${i}`" class="particle" 
             :style="{
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--size': `${Math.random() * 5 + 1}px`,
                '--duration': `${Math.random() * 60 + 20}s`,
                '--delay': `${Math.random() * -30}s`
             }"></div>
      </div>
      
      <!-- 浮动气泡 -->
      <div class="bubbles">
        <div class="bubble" v-for="i in 10" :key="`b-${i}`" :style="{ 
          '--size': `${20 + Math.random() * 60}px`,
          '--distance': `${6 + Math.random() * 4}`,
          '--position': `${-5 + Math.random() * 110}%`,
          '--time': `${2 + Math.random() * 2}s`,
          '--delay': `${-1 * (2 + Math.random() * 2)}s`,
        }"></div>
      </div>

      <!-- Left Column - Login Form -->
      <div class="login-column">
        <div class="login-box">
          <div class="logo-area">
            <div class="logo-animation">
              <span class="logo-icon">
                <el-icon size="36"><ChatDotSquare /></el-icon>
              </span>
            </div>
            <h1 class="animated-text">AI Assistant</h1>
            <p>Your Intelligent Conversation Partner</p>
            <div class="shine-line"></div>
          </div>
          
          <div v-if="authStore.isAuthenticated" class="quick-actions">
            <div class="action-bubbles">
              <div class="action-bubble new-chat" @click="redirectToChat">
                <el-icon><Plus /></el-icon>
                <span>New Chat</span>
              </div>
              <div class="action-bubble continue-chat" @click="redirectToChat">
                <el-icon><ChatLineRound /></el-icon>
                <span>Continue Chat</span>
              </div>
              <div class="action-bubble settings" @click="redirectToChatWithSettings">
                <el-icon><Setting /></el-icon>
                <span>Settings</span>
              </div>
            </div>
          </div>
          
          <el-form v-else :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
            <div class="form-item-animated">
              <el-form-item prop="username">
                <el-input 
                  v-model="loginForm.username" 
                  prefix-icon="User" 
                  placeholder="Username" 
                  size="large"
                  class="animate-input"
                />
              </el-form-item>
            </div>
            
            <div class="form-item-animated" style="animation-delay: 0.1s;">
              <el-form-item prop="password">
                <el-input 
                  v-model="loginForm.password" 
                  prefix-icon="Lock" 
                  type="password" 
                  placeholder="Password" 
                  size="large"
                  class="animate-input" 
                  @keyup.enter="handleLogin"
                />
              </el-form-item>
            </div>
            
            <div class="form-item-animated" style="animation-delay: 0.15s;">
              <el-form-item prop="captcha">
                <div class="captcha-container">
                  <el-input 
                    v-model="loginForm.captcha" 
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
            
            <div class="form-item-animated" style="animation-delay: 0.2s;">
              <el-form-item class="login-options">
                <el-checkbox v-model="loginForm.rememberMe">Remember me</el-checkbox>
                <el-link type="primary" underline="never" class="hover-effect">Forgot password?</el-link>
              </el-form-item>
            </div>
            
            <div class="form-item-animated" style="animation-delay: 0.3s;">
              <el-form-item>
                <el-button 
                  type="primary" 
                  :loading="loading" 
                  class="login-button ripple-effect" 
                  @click="handleLogin"
                >
                  <span class="button-text">Login</span>
                  <span class="button-icon">
                    <el-icon><ArrowRight /></el-icon>
                  </span>
                </el-button>
              </el-form-item>
            </div>
          </el-form>

          <div class="form-item-animated" style="animation-delay: 0.4s;">
            <div class="login-footer">
              <p>Don't have an account? <el-link type="primary" underline="never" class="hover-effect">Sign up</el-link></p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Column - Features -->
      <div class="features-column">
        <div class="features-content">
          <h2>Welcome to AI Assistant</h2>
          <p class="subtitle">The next generation of intelligent conversation</p>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="28"><ChatLineRound /></el-icon>
              </div>
              <h3>Smart Conversations</h3>
              <p>Engage in natural, intelligent conversations with state-of-the-art AI technology.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="28"><Connection /></el-icon>
              </div>
              <h3>Knowledge Integration</h3>
              <p>Access vast knowledge and get accurate information on various topics instantly.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="28"><Histogram /></el-icon>
              </div>
              <h3>Data Analysis</h3>
              <p>Process and analyze complex data with intelligent AI insights.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="28"><Monitor /></el-icon>
              </div>
              <h3>Multi-device Access</h3>
              <p>Access your AI assistant across all your devices seamlessly.</p>
            </div>
          </div>
          
          <div class="testimonials">
            <div class="testimonial">
              <div class="quote">"This AI assistant has revolutionized how I interact with technology."</div>
              <div class="author">- John D., Product Manager</div>
            </div>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../api/auth'

// Router and auth store
const router = useRouter()
const authStore = useAuthStore()

// Form data
const loginFormRef = ref()
const loading = ref(false)
const captchaImage = ref('')
const captchaUuid = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
  captcha: ''
})

// Enhanced form validation rules
const loginRules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
    { min: 3, message: 'Username must be at least 3 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: 'Please enter captcha', trigger: 'blur' },
    { min: 4, max: 6, message: 'Captcha should be 4-6 characters', trigger: 'blur' }
  ]
}

// Fetch captcha on component mount
onMounted(() => {
  // Setup ripple effect for buttons
  document.querySelector('.login-container')?.addEventListener('click', (e) => {
    const mouseEvent = e as MouseEvent; // Type assertion to MouseEvent
    const target = mouseEvent.target as HTMLElement;
    if (target.classList.contains('ripple-effect')) {
      const button = target;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.className = 'ripple';
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
  });
  
  // Load captcha when component mounts
  refreshCaptcha();
});

// Refresh captcha
const refreshCaptcha = async () => {
  try {
    // Clear current captcha while loading
    captchaImage.value = '';
    captchaUuid.value = '';
    
    // Show loading state
    loading.value = true;
    
    console.log('Requesting new captcha...');
    const captchaData = await authApi.getCaptcha();
    console.log('Captcha data received:', captchaData);
    
    if (captchaData && captchaData.img && captchaData.uuid) {
      captchaImage.value = captchaData.img;
      captchaUuid.value = captchaData.uuid;
      console.log('Captcha loaded successfully, uuid:', captchaUuid.value);
    } else {
      throw new Error('Invalid captcha data received');
    }
  } catch (error) {
    console.error('Failed to load captcha:', error);
    
    // Show a user-friendly error message
    ElMessage.error({
      message: 'Failed to load captcha. Please try again later.',
      duration: 5000
    });
  } finally {
    loading.value = false;
  }
};

// Handle login
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  // Clear previous validation errors
  loginFormRef.value.clearValidate();
  
  // Validate form before API call
  try {
    // Validate individual fields to get specific error messages
    await loginFormRef.value.validateField('username');
    await loginFormRef.value.validateField('password');
    await loginFormRef.value.validateField('captcha');
    
    // If no errors thrown, validate the entire form
    const valid = await loginFormRef.value.validate();
    
    if (!valid) {
      console.log('Form validation failed');
      return; // If form validation fails, don't proceed
    }
    
    // Form validation passed, continue login flow
    loading.value = true;
    
    // Show Logo animation
    const logoElement = document.querySelector('.logo-animation');
    if (logoElement) logoElement.classList.add('pulse');
    
    try {
      // Call login API with captcha
      const response = await authApi.login(
        loginForm.username, 
        loginForm.password,
        loginForm.captcha,
        captchaUuid.value
      );
      console.log('Login API call succeeded with response:', response);
      
      // Update authentication state
      authStore.login({
        username: loginForm.username,
        token: response.token,
        user: response.user,
        rememberMe: loginForm.rememberMe
      });
      
      // Show success message
      ElMessage.success('Login successful');
      
      // Navigate to chat page
      router.push('/chat').catch(err => {
        console.error('Navigation error:', err);
      });
    } catch (error: any) {
      console.error('Login API failed:', error);
      
      // Show error message but don't refresh page
      let errorMsg = 'Invalid credentials';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      ElMessage.error({
        message: 'Login failed: ' + errorMsg,
        duration: 5000 // Extended error display time
      });
      
      // Refresh captcha after failed login
      refreshCaptcha();
      
      // Remove Logo animation
      if (logoElement) logoElement.classList.remove('pulse');
    } finally {
      loading.value = false;
    }
  } catch (validationError: any) {
    console.error('Validation threw an error:', validationError);
    
    // Extract specific error message from validation error and display
    let errorMessage = 'Please correct the form errors';
    if (validationError && validationError.password && validationError.password.length > 0) {
      errorMessage = validationError.password[0].message || errorMessage;
    } else if (validationError && validationError.username && validationError.username.length > 0) {
      errorMessage = validationError.username[0].message || errorMessage;
    } else if (validationError && validationError.captcha && validationError.captcha.length > 0) {
      errorMessage = validationError.captcha[0].message || errorMessage;
    }
    
    ElMessage.warning(errorMessage);
  }
};

// Navigation methods
function redirectToChat() {
  router.push({ name: 'chat' })
}

function redirectToChatWithSettings() {
  router.push({ name: 'chat', query: { showSettings: 'true' } })
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginView'
})
</script>

<style scoped lang="scss">
// Base container styles
.login-container {
  width: 100vw;
  height: 100vh;
  margin: 0 !important;
  padding: 0 !important;
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  box-sizing: border-box;
}

// Main content area with split layout
.main-content {
  flex: 1;
  display: flex;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

// Login column (left side)
.login-column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  z-index: 2;
  max-width: 50%;
  min-width: 450px;
  margin-left: 0;
}

// Features column (right side)
.features-column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 2;
  color: white;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  
  h2 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 10px;
    color: white;
  }
  
  .subtitle {
    font-size: 18px;
    margin-bottom: 40px;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 40px;
  }
  
  .feature-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }
    
    .feature-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: rgba(75, 108, 183, 0.7);
      margin-bottom: 16px;
    }
    
    h3 {
      font-size: 18px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      line-height: 1.5;
    }
  }
  
  .testimonials {
    margin-top: 30px;
    
    .testimonial {
      font-style: italic;
      border-left: 3px solid rgba(75, 108, 183, 0.8);
      padding-left: 20px;
      
      .quote {
        font-size: 16px;
        margin-bottom: 10px;
        color: rgba(255, 255, 255, 0.9);
      }
      
      .author {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

.features-content {
  max-width: 700px;
  width: 100%;
}

// App header
.app-header {
  position: relative;
  width: 100%;
  z-index: 10;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
  
  .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    font-size: 18px;
    font-weight: 600;
    color: white;
    
    .logo-icon-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  
  .header-actions {
    color: white;
    
    button {
      color: white;
    }
  }
}

// App footer
.app-footer {
  position: relative;
  width: 100%;
  z-index: 10;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.1);
  
  .footer-links {
    display: flex;
    gap: 15px;
    
    a {
      color: rgba(255, 255, 255, 0.7);
      
      &:hover {
        color: white;
      }
    }
  }
}

// Login box with glass effect
.login-box {
  width: 100%;
  max-width: 440px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transform: translateY(20px);
  animation: slideUp 0.8s ease-out forwards;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 35px 0 rgba(31, 38, 135, 0.5);
  }
}

// CSS Particles animation (more performant than JS)
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.particle {
  position: absolute;
  top: var(--y);
  left: var(--x);
  width: var(--size);
  height: var(--size);
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-float var(--duration) ease-in-out var(--delay) infinite;
  z-index: 0;
}

// Responsive adjustments
@media (max-width: 1200px) {
  .features-column .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }
  
  .login-column, .features-column {
    max-width: 100%;
  }
  
  .features-column {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .features-column {
    display: none; // Hide features on mobile
  }
  
  .login-column {
    flex: 1;
  }
}

@media (max-width: 600px) {
  .hidden-xs {
    display: none;
  }
  
  .app-header, .app-footer {
    padding: 0 15px;
  }
  
  .app-footer {
    flex-direction: column;
    height: auto;
    padding: 10px 15px;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
  }
  
  .logo-area h1 {
    font-size: 24px;
  }
}

// Login box styling with 3D hover effect
.login-box {
  width: 430px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transform: translateY(20px);
  animation: slideUp 0.8s ease-out forwards;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 35px 0 rgba(31, 38, 135, 0.5);
  }
}

// Logo area styling
.logo-area {
  text-align: center;
  margin-bottom: 35px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-top: 16px;
    margin-bottom: 8px;
    color: #1a2743;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    position: relative;
  }
  
  p {
    font-size: 16px;
    color: #506690;
    margin: 0;
  }
  
  .logo-animation {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
    border-radius: 50%;
    margin-bottom: 16px;
    color: white;
    position: relative;
    transition: transform 0.3s ease;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px) scale(1.05);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      border-radius: 50%;
      border: 2px solid transparent;
      background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%) border-box;
      -webkit-mask: 
         linear-gradient(#fff 0 0) padding-box, 
         linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      animation: rotate 4s linear infinite;
    }
    
    .logo-icon {
      animation: pulse 2s infinite;
    }
  }
  
  // Shine line animation
  .shine-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.8) 50%, 
      rgba(255, 255, 255, 0) 100%);
    top: 50%;
    transform: translateX(-100%);
    animation: shine 3s infinite;
  }
}

// Login form styling
.login-form {
  .login-options {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    align-items: center;
  }
  
  .login-button {
    width: 100%;
    height: 48px;
    font-size: 16px;
    background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
    border: none;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
      
      .button-icon {
        transform: translateX(4px);
      }
    }
    
    .button-text {
      display: inline-block;
      margin-right: 8px;
      transition: transform 0.3s ease;
      position: relative;
      z-index: 2;
    }
    
    .button-icon {
      display: inline-block;
      transition: transform 0.3s ease;
      position: relative;
      z-index: 2;
    }
  }
}

// Animated input fields
.animate-input {
  transition: all 0.3s ease;
  
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(31, 38, 135, 0.2);
  }
}

// Ripple effect
.ripple-effect {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  background: rgba(255, 255, 255, 0.4);
  animation: ripple 0.6s linear;
  pointer-events: none;
  width: 100px;
  height: 100px;
  margin-top: -50px;
  margin-left: -50px;
}

// Link hover effect
.hover-effect {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: currentColor;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
}

// Footer styling
.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #506690;
}

// Animated form items
.form-item-animated {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease-out forwards;
}

// Animated text with highlight
.animated-text {
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 8px;
    background: rgba(75, 108, 183, 0.2);
    bottom: 5px;
    left: -4px;
    z-index: -1;
    animation: text-highlight 1s 0.8s ease-out forwards;
  }
}

// Bubbles animation
.bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  top: 0;
  left: 0;
}

.bubble {
  position: absolute;
  bottom: -100px;
  width: var(--size);
  height: var(--size);
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  opacity: 0.5;
  animation: rise var(--time) ease-in infinite;
  animation-delay: var(--delay);
  left: var(--position);
}

// Animation keyframes
@keyframes rise {
  0% {
    bottom: -100px;
    transform: translateX(0);
  }
  50% {
    transform: translate(calc(var(--distance) * 10px), 0);
  }
  100% {
    bottom: calc(100% + 20px);
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  0% { transform: translateY(40px); }
  100% { transform: translateY(0); }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes ripple {
  from { transform: scale(0); opacity: 1; }
  to { transform: scale(4); opacity: 0; }
}

@keyframes text-highlight {
  0% { width: 0; }
  100% { width: 100%; }
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  50%, 100% { transform: translateX(100%); }
}

@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(calc(var(--size) * 10), calc(var(--size) * -10));
  }
  50% {
    transform: translate(calc(var(--size) * -5), calc(var(--size) * 12));
  }
  75% {
    transform: translate(calc(var(--size) * 8), calc(var(--size) * 10));
  }
}

// Pulse animation class
.pulse {
  animation: strongPulse 0.6s ease-in-out infinite !important;
}

@keyframes strongPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(75, 108, 183, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(75, 108, 183, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(75, 108, 183, 0);
  }
}

// Quick actions styling
.quick-actions {
  width: 100%;
  padding: 20px 0;
  animation: fadeIn 0.8s ease forwards;
}

.action-bubbles {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.action-bubble {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.action-bubble::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s;
}

.action-bubble:hover::after {
  opacity: 1;
}

.action-bubble .el-icon {
  font-size: 24px;
}

.new-chat {
  background-color: #95ec69;
  color: #131313;
}

.continue-chat {
  background-color: #64c4ed;
  color: white;
}

.settings {
  background-color: #f5f7fa;
  color: #606266;
}

.action-bubble:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.action-bubble:active {
  transform: translateY(0);
}

// Captcha styles
.captcha-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  height: 40px;
  min-width: 100px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
  
  &:hover {
    border-color: #409EFF;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .captcha-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #909399;
    font-size: 20px;
    animation: rotate 1.5s linear infinite;
  }
}
</style> 