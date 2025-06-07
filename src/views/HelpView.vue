<template>
  <div class="help-container">
    <!-- App Header -->
    <div class="app-header">
      <div class="logo" @click="$router.push('/')">
        <div class="logo-icon-wrapper">
          <el-icon size="24"><ChatDotSquare /></el-icon>
        </div>
        <span>AI Assistant</span>
      </div>
      <div class="header-actions">
        <el-button text @click="$router.push('/chat')" v-if="authStore.isAuthenticated">
          <el-icon><ChatLineRound /></el-icon>
          <span class="hidden-xs">Chat</span>
        </el-button>
        <el-button text @click="$router.push('/')" v-else>
          <el-icon><User /></el-icon>
          <span class="hidden-xs">Login</span>
        </el-button>
      </div>
    </div>
    
    <!-- Help Content -->
    <div class="help-content">
      <div class="help-header">
        <h1>Help Center</h1>
        <p class="subtitle">Get started with AI Assistant and discover how to get the most out of it</p>
        
        <div class="search-box">
          <el-input 
            placeholder="Search for help topics..." 
            prefix-icon="Search" 
            size="large"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
      
      <!-- Quick Links -->
      <div class="quick-links">
        <div class="link-card" v-for="(link, index) in quickLinks" :key="index" @click="scrollToSection(link.target)">
          <div class="link-icon">
            <el-icon :size="24">
              <component :is="link.icon" />
            </el-icon>
          </div>
          <div class="link-text">
            <h3>{{ link.title }}</h3>
            <p>{{ link.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Main Help Sections -->
      <div class="help-sections">
        <div class="help-section" id="getting-started">
          <h2><el-icon><Guide /></el-icon> Getting Started</h2>
          <div class="section-content">
            <div class="help-card">
              <h3>Creating Your Account</h3>
              <p>To create a new account, visit the login page and click on "Sign up". Fill out the required information and verify your email address.</p>
              <div class="tips">
                <h4>Quick Tips:</h4>
                <ul>
                  <li>Use a strong, unique password</li>
                  <li>Check your spam folder if you don't see the verification email</li>
                  <li>You can use your Google or Microsoft account for faster sign-up</li>
                </ul>
              </div>
            </div>
            
            <div class="help-card">
              <h3>Navigating the Interface</h3>
              <p>Our intuitive interface is designed to make your experience as smooth as possible. The main sections include:</p>
              <ul>
                <li><strong>Chat:</strong> Where you interact with the AI Assistant</li>
                <li><strong>History:</strong> Access your past conversations</li>
                <li><strong>Settings:</strong> Customize your experience</li>
                <li><strong>Profile:</strong> Manage your account details</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="help-section" id="using-ai">
          <h2><el-icon><Cpu /></el-icon> Using the AI Assistant</h2>
          <div class="section-content">
            <div class="help-card">
              <h3>Asking Questions</h3>
              <p>You can ask our AI Assistant almost anything! Some examples of questions include:</p>
              <ul>
                <li>Factual questions about science, history, math, and more</li>
                <li>Creative help with writing, brainstorming, or problem-solving</li>
                <li>Programming help and code explanations</li>
                <li>Language translations and grammar checking</li>
              </ul>
            </div>
            
            <div class="help-card">
              <h3>Advanced Features</h3>
              <p>Get the most out of your AI Assistant with these advanced features:</p>
              <div class="feature-list">
                <div class="feature">
                  <div class="feature-icon"><el-icon><Document /></el-icon></div>
                  <div class="feature-details">
                    <h4>Document Analysis</h4>
                    <p>Upload documents for the AI to analyze and summarize</p>
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon"><el-icon><Picture /></el-icon></div>
                  <div class="feature-details">
                    <h4>Image Understanding</h4>
                    <p>Share images for the AI to describe or analyze</p>
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon"><el-icon><Microphone /></el-icon></div>
                  <div class="feature-details">
                    <h4>Voice Interaction</h4>
                    <p>Speak to the AI naturally using your microphone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="help-section" id="troubleshooting">
          <h2><el-icon><Warning /></el-icon> Troubleshooting</h2>
          <div class="section-content">
            <div class="help-card">
              <h3>Common Issues</h3>
              <div class="accordion">
                <el-collapse>
                  <el-collapse-item title="I can't log in to my account" name="1">
                    <p>Try these steps:</p>
                    <ol>
                      <li>Make sure you're using the correct email and password</li>
                      <li>Reset your password if you've forgotten it</li>
                      <li>Check if your account has been verified</li>
                      <li>Clear your browser cache and cookies</li>
                    </ol>
                  </el-collapse-item>
                  <el-collapse-item title="The AI isn't responding correctly" name="2">
                    <p>To get better responses:</p>
                    <ul>
                      <li>Try rephrasing your question</li>
                      <li>Be more specific in your request</li>
                      <li>Break complex questions into smaller parts</li>
                      <li>Check your internet connection</li>
                    </ul>
                  </el-collapse-item>
                  <el-collapse-item title="I'm experiencing slow performance" name="3">
                    <p>If the application feels slow:</p>
                    <ul>
                      <li>Check your internet connection</li>
                      <li>Try using a different browser</li>
                      <li>Close unnecessary browser tabs</li>
                      <li>Clear your browser cache</li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            
            <div class="help-card">
              <h3>Contact Support</h3>
              <p>Still having issues? Our support team is here to help!</p>
              <div class="support-options">
                <el-button type="primary" class="support-button">
                  <el-icon><Message /></el-icon> Email Support
                </el-button>
                <el-button class="support-button">
                  <el-icon><ChatLineSquare /></el-icon> Live Chat
                </el-button>
              </div>
              <p class="support-hours">Support hours: Monday to Friday, 9 AM - 6 PM ET</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- App footer -->
    <div class="app-footer">
      <div>© 2025 AI Assistant</div>
      <div class="footer-links">
        <el-link type="info" :underline="false">Privacy</el-link>
        <el-link type="info" :underline="false">Terms</el-link>
        <el-link type="info" :underline="false">Contact</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { 
  ChatDotSquare, 
  ChatLineRound, 
  User, 
  Search, 
  Guide,
  Cpu, 
  Document, 
  Picture, 
  Microphone, 
  Warning, 
  Message, 
  ChatLineSquare,
  QuestionFilled, 
  Connection,
  Setting,
  InfoFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const searchQuery = ref('')

// Quick links for navigation
const quickLinks = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using AI Assistant',
    icon: 'Guide',
    target: 'getting-started'
  },
  {
    title: 'Using the AI',
    description: 'Tips for effective AI interaction',
    icon: 'Cpu',
    target: 'using-ai'
  },
  {
    title: 'Troubleshooting',
    description: 'Solutions for common issues',
    icon: 'Warning',
    target: 'troubleshooting'
  },
  {
    title: 'Advanced Features',
    description: 'Get the most from your assistant',
    icon: 'Setting',
    target: 'using-ai'
  }
]

// Search function
const handleSearch = () => {
  if (!searchQuery.value) return
  // In a real app, this would search through help content
  console.log('Searching for:', searchQuery.value)
  // For demo, just clear the search
  searchQuery.value = ''
}

// Scroll to section
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelpView'
})
</script>

<style scoped lang="scss">
.help-container {
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
  overflow-x: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9edf2 100%);
  box-sizing: border-box;
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
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    font-size: 18px;
    font-weight: 600;
    color: #4b6cb7;
    cursor: pointer;
    
    .logo-icon-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  
  .header-actions {
    color: #4b6cb7;
    
    button {
      color: #4b6cb7;
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
  color: #6c757d;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
  
  .footer-links {
    display: flex;
    gap: 15px;
    
    a {
      color: #6c757d;
      
      &:hover {
        color: #4b6cb7;
      }
    }
  }
}

// Help content styling
.help-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  overflow-y: auto;
  
  .help-header {
    text-align: center;
    margin-bottom: 40px;
    
    h1 {
      font-size: 36px;
      font-weight: 700;
      color: #4b6cb7;
      margin-bottom: 16px;
    }
    
    .subtitle {
      font-size: 18px;
      color: #6c757d;
      max-width: 600px;
      margin: 0 auto 30px;
    }
    
    .search-box {
      max-width: 600px;
      margin: 0 auto;
      
      :deep(.el-input__wrapper) {
        border-radius: 50px;
        padding-left: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

// Quick links section
.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  
  .link-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    gap: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
    
    .link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      background: rgba(75, 108, 183, 0.1);
      border-radius: 12px;
      color: #4b6cb7;
    }
    
    .link-text {
      flex: 1;
      
      h3 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #333;
      }
      
      p {
        font-size: 14px;
        color: #6c757d;
        margin: 0;
      }
    }
  }
}

// Help sections styling
.help-sections {
  .help-section {
    margin-bottom: 50px;
    scroll-margin-top: 70px;
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      color: #4b6cb7;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding-bottom: 10px;
      border-bottom: 2px solid rgba(75, 108, 183, 0.2);
    }
    
    .section-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
  }
}

// Help card styling
.help-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
  }
  
  p, li {
    color: #555;
    line-height: 1.6;
  }
  
  ul, ol {
    padding-left: 20px;
    margin-bottom: 16px;
  }
  
  .tips {
    background: rgba(75, 108, 183, 0.1);
    padding: 16px;
    border-radius: 8px;
    margin-top: 16px;
    
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #4b6cb7;
      margin-bottom: 10px;
    }
  }
}

// Feature list styling
.feature-list {
  margin-top: 20px;
  
  .feature {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    
    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .feature-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(75, 108, 183, 0.1);
      border-radius: 8px;
      color: #4b6cb7;
      flex-shrink: 0;
    }
    
    .feature-details {
      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }
      
      p {
        font-size: 14px;
        color: #6c757d;
        margin: 0;
      }
    }
  }
}

// Accordion styling
.accordion {
  :deep(.el-collapse-item__header) {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
  
  :deep(.el-collapse-item__content) {
    padding-top: 16px;
  }
}

// Contact support styling
.support-options {
  display: flex;
  gap: 12px;
  margin: 16px 0;
  
  .support-button {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.support-hours {
  font-size: 14px;
  color: #6c757d;
  font-style: italic;
}

// Responsive adjustments
@media (max-width: 600px) {
  .hidden-xs {
    display: none;
  }
  
  .help-header h1 {
    font-size: 28px;
  }
  
  .help-header .subtitle {
    font-size: 16px;
  }
  
  .quick-links {
    grid-template-columns: 1fr;
  }
  
  .app-header, .app-footer {
    padding: 0 15px;
  }
}
</style> 