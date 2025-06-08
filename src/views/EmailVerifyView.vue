<template>
  <div class="email-verify-container">
    <div class="email-verify-form">
      <h2>Email Verification</h2>
      <el-form :model="formState" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="Email" prop="email">
          <el-input v-model="formState.email" placeholder="Enter QQ email address">
            <template #append>
              <el-button 
                type="primary" 
                size="small"
                :disabled="countDown > 0" 
                :loading="sendingCode" 
                @click="sendVerificationCode"
              >
                {{ countDown > 0 ? `Resend in ${countDown}s` : 'Send Code' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="Verification Code" prop="code">
          <el-input v-model="formState.code" placeholder="Enter 6-digit code" maxlength="6" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit" style="width: 100%">Verify Email</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { sendEmailCode, verifyEmailCode } from '@/api/auth';

const router = useRouter();
const formRef = ref();
const loading = ref(false);
const sendingCode = ref(false);
const countDown = ref(0);

const formState = reactive({
  email: '',
  code: ''
});

const rules = {
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' },
    { pattern: /^[1-9]\d{4,}@qq\.com$/, message: 'Please enter a valid QQ email address', trigger: 'blur' },
  ],
  code: [
    { required: true, message: 'Please enter verification code', trigger: 'blur' },
    { len: 6, message: 'Verification code must be 6 digits', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: 'Verification code must be 6 digits', trigger: 'blur' },
  ]
};

async function sendVerificationCode() {
  try {
    // Validate email format first
    const emailPattern = /^[1-9]\d{4,}@qq\.com$/;
    if (!formState.email || !emailPattern.test(formState.email)) {
      ElMessage.error('Please enter a valid QQ email address');
      return;
    }
    
    sendingCode.value = true;
    const res = await sendEmailCode({
      email: formState.email,
      type: 'verify'
    });
    
    if (res && res.code === 200) {
      ElMessage.success('Verification code has been sent to your email');
      // Start countdown
      countDown.value = 60;
      const timer = setInterval(() => {
        countDown.value--;
        if (countDown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } else {
      ElMessage.error(res?.message || 'Failed to send verification code');
    }
  } catch (error) {
    console.error('Failed to send verification code:', error);
    ElMessage.error('Failed to send verification code, please try again later');
  } finally {
    sendingCode.value = false;
  }
}

async function handleSubmit() {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    
    loading.value = true;
    const res = await verifyEmailCode({
      email: formState.email,
      code: formState.code
    });
    
    if (res && res.code === 200) {
      ElMessage.success('Email verified successfully');
      setTimeout(() => {
        router.push('/verify-success');
      }, 1000);
    } else {
      ElMessage.error(res?.message || 'Email verification failed');
    }
  } catch (error) {
    console.error('Email verification failed:', error);
    if (error?.fields) {
      ElMessage.error('Please check if the form is filled out correctly');
    } else {
      ElMessage.error('Email verification failed, please try again later');
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.email-verify-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.email-verify-form {
  width: 100%;
  max-width: 450px;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #409EFF;
}
</style> 