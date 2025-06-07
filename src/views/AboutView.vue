<template>
  <div class="about-container">
    <div class="about-header">
      <h1>About AI Assistant</h1>
      <p class="subtitle">Powered by DeepSeek technology</p>
    </div>

    <div class="about-content">
      <el-row :gutter="30">
        <el-col :md="12" :lg="8">
          <div class="about-card">
            <div class="card-icon">
              <el-icon size="48"><Cpu /></el-icon>
            </div>
            <h2>Our Technology</h2>
            <p>AI Assistant is built on DeepSeek's state-of-the-art language models, designed to understand and generate human-like text with remarkable accuracy. Our models are trained on diverse datasets to provide helpful, accurate, and contextually relevant responses.</p>
          </div>
        </el-col>
        
        <el-col :md="12" :lg="8">
          <div class="about-card">
            <div class="card-icon">
              <el-icon size="48"><Aim /></el-icon>
            </div>
            <h2>Our Mission</h2>
            <p>We're committed to making advanced AI accessible and beneficial to everyone. Our mission is to enhance human productivity and creativity by providing intelligent assistance that adapts to your needs, respects your privacy, and delivers reliable information.</p>
          </div>
        </el-col>
        
        <el-col :md="12" :lg="8">
          <div class="about-card">
            <div class="card-icon">
              <el-icon size="48"><User /></el-icon>
            </div>
            <h2>Our Team</h2>
            <p>Behind AI Assistant is a team of dedicated AI researchers, engineers, and designers passionate about advancing the capabilities of artificial intelligence while ensuring it remains ethical, safe, and user-focused.</p>
          </div>
        </el-col>
      </el-row>
      
      <div class="about-section">
        <h2>AI Capabilities</h2>
        <p>Discover what our advanced models can do for you:</p>
        
        <el-row :gutter="20" class="capabilities">
          <el-col :sm="12" :md="8" :lg="6" v-for="capability in capabilities" :key="capability.title">
            <div class="capability-item">
              <el-icon><component :is="capability.icon" /></el-icon>
              <h3>{{ capability.title }}</h3>
              <p>{{ capability.description }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <div class="about-section">
        <h2>Our Values</h2>
        
        <div class="values-container">
          <div class="value-item" v-for="(value, index) in values" :key="index">
            <div class="value-number">{{ index + 1 }}</div>
            <div class="value-content">
              <h3>{{ value.title }}</h3>
              <p>{{ value.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="version-info">
        <p>Version: 1.0.0</p>
        <p>Last Updated: {{ new Date().toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Cpu } from '@element-plus/icons-vue'
import { Aim } from '@element-plus/icons-vue'
import { User } from '@element-plus/icons-vue'
import { ChatLineSquare } from '@element-plus/icons-vue'
import { Document } from '@element-plus/icons-vue'
import { Connection } from '@element-plus/icons-vue'
import { Histogram } from '@element-plus/icons-vue'
import { DataAnalysis } from '@element-plus/icons-vue'
import { Monitor } from '@element-plus/icons-vue'
import { Reading } from '@element-plus/icons-vue'
import { Headset } from '@element-plus/icons-vue'
import { School } from '@element-plus/icons-vue'

const capabilities = ref([
  {
    icon: 'ChatLineSquare',
    title: 'Natural Conversations',
    description: 'Engage in fluid, contextual dialogue on a wide range of topics.'
  },
  {
    icon: 'Document',
    title: 'Content Creation',
    description: 'Generate creative text formats like poems, stories, emails, and more.'
  },
  {
    icon: 'Connection',
    title: 'Knowledge Integration',
    description: 'Access comprehensive information across various domains.'
  },
  {
    icon: 'DataAnalysis',
    title: 'Data Processing',
    description: 'Analyze and extract insights from complex information.'
  },
  {
    icon: 'Histogram',
    title: 'Code Generation',
    description: 'Create and explain code in multiple programming languages.'
  },
  {
    icon: 'Monitor',
    title: 'Multi-device Access',
    description: 'Use AI Assistant across all your devices seamlessly.'
  },
  {
    icon: 'Reading',
    title: 'Document Analysis',
    description: 'Summarize and extract key points from lengthy documents.'
  },
  {
    icon: 'School',
    title: 'Educational Support',
    description: 'Get help with learning concepts across various subjects.'
  }
])

const values = ref([
  {
    title: 'User-Centric Design',
    description: 'We prioritize intuitive experiences that adapt to your needs and preferences.'
  },
  {
    title: 'Transparency',
    description: 'We're open about our capabilities and limitations, providing clear information about how our technology works.'
  },
  {
    title: 'Continuous Improvement',
    description: 'We're committed to ongoing research and development to enhance our AI's capabilities.'
  },
  {
    title: 'Privacy & Security',
    description: 'We implement robust measures to protect your data and ensure confidential interactions.'
  },
  {
    title: 'Accessibility',
    description: 'We strive to make our technology available and usable for everyone, regardless of ability.'
  }
])
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

.about-header {
  text-align: center;
  margin-bottom: 60px;
}

.about-header h1 {
  font-size: 36px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--el-color-primary), #8c55f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 18px;
  color: var(--el-text-color-secondary);
}

.about-content {
  padding: 20px 0;
}

.about-card {
  background-color: var(--el-bg-color);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.about-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.card-icon {
  color: var(--el-color-primary);
  margin-bottom: 20px;
}

.about-card h2 {
  font-size: 22px;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
}

.about-card p {
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.about-section {
  margin: 60px 0;
}

.about-section h2 {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
}

.about-section h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--el-color-primary);
  border-radius: 3px;
}

.capabilities {
  margin-top: 30px;
}

.capability-item {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  padding: 24px 20px;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.capability-item:hover {
  transform: translateY(-3px);
}

.capability-item .el-icon {
  font-size: 32px;
  color: var(--el-color-primary);
  margin-bottom: 16px;
}

.capability-item h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--el-text-color-primary);
}

.capability-item p {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.values-container {
  margin-top: 30px;
}

.value-item {
  display: flex;
  margin-bottom: 30px;
  align-items: flex-start;
}

.value-number {
  width: 40px;
  height: 40px;
  background: var(--el-color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 20px;
  flex-shrink: 0;
}

.value-content h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.value-content p {
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.version-info {
  margin-top: 60px;
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.version-info p {
  margin: 5px 0;
}

@media (max-width: 768px) {
  .about-header h1 {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .about-section h2 {
    font-size: 24px;
  }
  
  .value-item {
    flex-direction: column;
  }
  
  .value-number {
    margin-bottom: 10px;
  }
}
</style>
