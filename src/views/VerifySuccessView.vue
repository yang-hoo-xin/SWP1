<template>
  <div class="verify-success-container">
    <div class="success-card">
      <div class="success-icon">
        <el-icon size="64" color="#67C23A"><CircleCheckFilled /></el-icon>
      </div>
      <h1>Email Verification Successful!</h1>
      <p>Your email has been successfully verified.</p>
      <div class="action-buttons">
        <el-button type="primary" @click="$router.push('/login')">Go to Login</el-button>
        <el-button @click="$router.push('/register')" plain>Register</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';

onMounted(() => {
  ElMessage.success('Email verified successfully!');
});
</script>

<style scoped>
.verify-success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.success-card {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.success-icon {
  margin-bottom: 20px;
}

h1 {
  color: #409EFF;
  margin-bottom: 16px;
  font-size: 24px;
}

p {
  color: #606266;
  margin-bottom: 30px;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style> 