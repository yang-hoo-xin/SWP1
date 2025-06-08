<template>
  <div class="register-container">
    <div class="background-animation">
      <div class="shape-1"></div>
      <div class="shape-2"></div>
      <div class="shape-3"></div>
      <div class="shape-4"></div>
    </div>
    
    <div class="register-content">
      <div class="register-left">
        <div class="branding">
          <h1 class="logo">HD Chat</h1>
          <p class="tagline">Connect, Collaborate, Create</p>
        </div>
        <div class="illustration">
          <img src="../assets/register-illustration.svg" alt="Illustration" class="illustration-img" />
        </div>
        <div class="features">
          <div class="feature">
            <el-icon><ChatLineRound /></el-icon>
            <span>Real-time messaging</span>
          </div>
          <div class="feature">
            <el-icon><Lock /></el-icon>
            <span>Secure encryption</span>
          </div>
          <div class="feature">
            <el-icon><Connection /></el-icon>
            <span>Seamless integration</span>
          </div>
        </div>
      </div>
      
      <div class="register-form">
        <h2>Create Account</h2>
        <el-form :model="formState" :rules="rules" ref="formRef" label-position="top" size="default">
          <el-form-item label="Username" prop="username">
            <el-input v-model="formState.username" placeholder="Enter 4-20 characters" />
          </el-form-item>
          
          <div class="form-group">
            <div class="form-group-title">Email Verification</div>
            <el-form-item label="Email" prop="email">
              <div class="email-container">
                <el-input v-model="formState.email" placeholder="Enter email address" />
                <el-button 
                  type="primary" 
                  :disabled="emailCodeSending || emailCodeCountdown > 0" 
                  @click="sendEmailVerificationCode"
                  class="email-code-btn"
                >
                  <span v-if="emailCodeCountdown > 0">{{ emailCodeCountdown }}s</span>
                  <span v-else>Get Code</span>
                </el-button>
              </div>
            </el-form-item>
            
            <el-form-item label="Email Code" prop="emailCode">
              <el-input v-model="formState.emailCode" placeholder="Enter verification code" />
            </el-form-item>
          </div>
          
          <div class="form-group">
            <div class="form-group-title">Set Password</div>
            <el-form-item label="Password" prop="password">
              <el-input type="password" v-model="formState.password" placeholder="Enter 6-20 characters" show-password />
            </el-form-item>
            
            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input type="password" v-model="formState.confirmPassword" placeholder="Enter password again" show-password />
            </el-form-item>
          </div>
          
          <el-form-item label="Captcha" prop="captcha">
            <div class="captcha-container">
              <el-input v-model="formState.captcha" placeholder="Enter captcha" />
              <div class="captcha-wrapper">
                <div class="captcha-img" @click="refreshCaptcha">
                  <img v-if="captchaImg" :src="captchaImg" alt="Captcha" />
                  <div v-else class="captcha-loading">
                    <el-icon class="loading-icon"><Loading /></el-icon>
                    <span>Loading...</span>
                  </div>
                </div>
                <el-button class="refresh-btn" type="primary" :icon="Refresh" circle size="small" @click="refreshCaptcha" title="Refresh captcha"></el-button>
              </div>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleSubmit" style="width: 100%">Register</el-button>
          </el-form-item>
          
          <div class="login-link">
            Already have an account? <el-link type="primary" @click="$router.push('/login')">Login now</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Loading, Refresh, ChatLineRound, Lock, Connection } from '@element-plus/icons-vue';
import { getCaptcha, register, sendEmailCode } from '@/api/auth';

const router = useRouter();
const formRef = ref();
const loading = ref(false);
const captchaImg = ref('');
const captchaUuid = ref('');
const emailCodeSending = ref(false);
const emailCodeTimer = ref(null);
const emailCodeCountdown = ref(0);

const formState = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  emailCode: '',
});

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please confirm password'));
  } else if (value !== formState.password) {
    callback(new Error('Two passwords entered are inconsistent'));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
    { min: 4, max: 20, message: 'Username length must be between 4-20', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Username can only contain letters, numbers, underscores, or hyphens', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, max: 20, message: 'Password length must be between 6-20', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm password', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: 'Please enter captcha', trigger: 'blur' },
  ],
  emailCode: [
    { required: true, message: 'Please enter email verification code', trigger: 'blur' },
  ],
};

onMounted(() => {
  refreshCaptcha();
});

async function refreshCaptcha() {
  try {
    const res = await getCaptcha();
    if (res && res.imageBase64 && res.uuid) {
      captchaImg.value = res.imageBase64;
      captchaUuid.value = res.uuid;
    } else {
      ElMessage.error('Failed to get captcha');
    }
  } catch (error) {
    console.error('Failed to get captcha:', error);
    ElMessage.error('Failed to get captcha, please try again later');
  }
}

async function sendEmailVerificationCode() {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!formState.email) {
    ElMessage.warning('Please enter email address');
    return;
  }
  if (!emailPattern.test(formState.email)) {
    ElMessage.warning('Please enter valid email address');
    return;
  }

  try {
    emailCodeSending.value = true;
    const res = await sendEmailCode({
      email: formState.email,
      type: 'register'
    });
    
    ElMessage.success('Verification code sent, please check your email');
    
    emailCodeCountdown.value = 60;
    emailCodeTimer.value = setInterval(() => {
      emailCodeCountdown.value--;
      if (emailCodeCountdown.value <= 0) {
        clearInterval(emailCodeTimer.value);
        emailCodeTimer.value = null;
      }
    }, 1000);
  } catch (error) {
    console.error('Failed to send email code:', error);
    ElMessage.error('Failed to send verification code, please try again later');
  } finally {
    emailCodeSending.value = false;
  }
}

onUnmounted(() => {
  if (emailCodeTimer.value) {
    clearInterval(emailCodeTimer.value);
  }
});

async function handleSubmit() {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    
    loading.value = true;
    const registerData = {
      username: formState.username,
      password: formState.password,
      confirmPassword: formState.confirmPassword,
      email: formState.email,
      captcha: formState.captcha,
      captchaUuid: captchaUuid.value,
      emailCode: formState.emailCode,
      agreeTerms: true
    };
    
    try {
      const res = await register(registerData);
      
      if (res && res.success) {
        ElMessage.success('Registration successful, redirecting to login page');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        ElMessage.error(res?.message || 'Registration failed');
        refreshCaptcha();
      }
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof Error) {
        ElMessage.error(error.message || 'Registration failed');
      } else {
        ElMessage.error('Registration failed, please try again later');
      }
      refreshCaptcha();
    }
  } catch (error) {
    console.error('Form validation failed:', error);
    if (error?.fields) {
      ElMessage.error('Please check if the form is filled out correctly');
    } else {
      ElMessage.error('Registration failed, please try again');
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 10px;
  overflow: hidden;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.shape-1, .shape-2, .shape-3, .shape-4 {
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
}

.shape-1 {
  top: -150px;
  left: -100px;
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, #4e9bfa, #65b6ff);
  animation: float1 20s infinite ease-in-out;
}

.shape-2 {
  bottom: -100px;
  right: -50px;
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #5e66fa, #8c94ff);
  animation: float2 15s infinite ease-in-out;
}

.shape-3 {
  top: 60%;
  left: 5%;
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #63a4ff, #83eaff);
  animation: float3 18s infinite ease-in-out;
}

.shape-4 {
  top: 10%;
  right: 10%;
  width: 180px;
  height: 180px;
  background: linear-gradient(45deg, #7c7fff, #b699ff);
  animation: float4 12s infinite ease-in-out;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(40px, 40px) rotate(5deg); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-30px, -20px) rotate(-7deg); }
}

@keyframes float3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(25px, -25px) rotate(3deg); }
}

@keyframes float4 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-20px, 20px) rotate(-5deg); }
}

.register-content {
  display: flex;
  width: 100%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.register-left {
  flex: 1;
  background: linear-gradient(135deg, #3a7bd5, #3a6073);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.register-form {
  flex: 1;
  padding: 20px;
  background: white;
  max-width: 420px;
  overflow-y: auto;
}

.branding {
  margin-bottom: 10px;
}

.logo {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 5px 0;
  background: linear-gradient(45deg, #ffffff, #e0e0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tagline {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.illustration {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.illustration-img {
  max-width: 70%;
  height: auto;
  animation: levitate 5s infinite ease-in-out;
}

@keyframes levitate {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.features {
  margin-top: 10px;
}

.feature {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  animation: slideIn 0.5s ease-out;
}

.feature:nth-child(1) { animation-delay: 0.1s; }
.feature:nth-child(2) { animation-delay: 0.3s; }
.feature:nth-child(3) { animation-delay: 0.5s; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.feature i {
  margin-right: 10px;
  font-size: 18px;
}

.feature span {
  font-size: 15px;
}

h2 {
  text-align: center;
  margin-bottom: 15px;
  color: #409EFF;
  font-size: 22px;
  font-weight: 600;
  position: relative;
  padding-bottom: 6px;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #409EFF, #79bbff);
  border-radius: 3px;
}

.form-group {
  margin-bottom: 12px;
  padding: 12px;
  background-color: #f9fafc;
  border-radius: 8px;
  border-left: 3px solid #409EFF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.form-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

.form-group-title {
  font-size: 15px;
  font-weight: 600;
  color: #409EFF;
  margin-bottom: 10px;
  position: relative;
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.captcha-img {
  width: 100px;
  height: 36px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.captcha-img:hover {
  border-color: #409EFF;
  transform: scale(1.03);
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);
}

.captcha-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.captcha-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
}

.loading-icon {
  animation: rotate 1s linear infinite;
  margin-right: 4px;
}

.refresh-btn {
  margin-left: 4px;
  transition: all 0.3s;
}

.refresh-btn:hover {
  transform: rotate(180deg);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

:deep(.el-form-item.is-error .captcha-img) {
  border-color: #f56c6c;
}

:deep(.el-form-item:has(.captcha-container) .el-form-item__content) {
  display: flex;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 1px 10px;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409EFF;
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}

:deep(.el-form-item__label) {
  padding-bottom: 3px;
  font-size: 13px;
}

:deep(.el-button) {
  height: 38px;
  font-weight: 500;
  transition: all 0.3s;
  border-radius: 6px;
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.login-link {
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  animation: fadeIn 0.8s ease-out;
  animation-delay: 0.5s;
  animation-fill-mode: both;
}

.email-container {
  display: flex;
  gap: 8px;
}

.email-code-btn {
  flex-shrink: 0;
  width: 90px;
  border-radius: 6px;
}

@media (max-width: 960px) {
  .register-content {
    flex-direction: column;
    max-width: 480px;
  }
  
  .register-left {
    padding: 20px;
  }
  
  .register-form {
    max-width: none;
    padding: 20px;
  }
}

@media (max-width: 640px) {
  .form-group {
    padding: 14px;
  }
  
  .register-left {
    padding: 20px;
  }
  
  .register-form {
    padding: 20px;
  }
}
</style> 