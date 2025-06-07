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
        <p class="subtitle">Learn how to get the most out of your AI Assistant</p>
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="Search help topics..."
            :suffix-icon="Search"
            @keyup.enter="handleSearch"
          >
          </el-input>
        </div>
      </div>

      <div class="help-section">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="help-navigation">
              <h3>Topics</h3>
              <el-menu
                default-active="getting-started"
                class="help-menu"
                @select="scrollToSection"
              >
                <el-menu-item index="getting-started">
                  <el-icon><Guide /></el-icon>
                  <span>Getting Started</span>
                </el-menu-item>
                <el-menu-item index="features">
                  <el-icon><Star /></el-icon>
                  <span>Features</span>
                </el-menu-item>
                <el-menu-item index="models">
                  <el-icon><Connection /></el-icon>
                  <span>AI Models</span>
                </el-menu-item>
                <el-menu-item index="deep-thinking">
                  <el-icon><View /></el-icon>
                  <span>Deep Thinking Mode</span>
                </el-menu-item>
                <el-menu-item index="settings">
                  <el-icon><Setting /></el-icon>
                  <span>Customizing UI</span>
                </el-menu-item>
                <el-menu-item index="faq">
                  <el-icon><QuestionFilled /></el-icon>
                  <span>FAQ</span>
                </el-menu-item>
              </el-menu>
              
              <div class="help-contact">
                <h4>Need more help?</h4>
                <el-button type="primary" class="contact-btn">Contact Support</el-button>
              </div>
            </div>
          </el-col>
          
          <el-col :span="18">
            <div class="help-sections">
              <section id="getting-started" class="help-section-content">
                <div class="section-header">
                  <el-icon class="section-icon"><Guide /></el-icon>
                  <h2>Getting Started</h2>
                </div>
                <div class="help-card">
                  <h3>Welcome to AI Assistant</h3>
                  <p>AI Assistant is a powerful tool that leverages DeepSeek's advanced AI models to provide intelligent responses, generate content, and assist with various tasks.</p>
                  
                  <h4 class="card-subtitle">Quick Start Guide</h4>
                  <ol class="numbered-list">
                    <li>
                      <div class="list-number">1</div>
                      <div class="list-content">
                        <strong>Login</strong> - Access the system with your credentials
                      </div>
                    </li>
                    <li>
                      <div class="list-number">2</div>
                      <div class="list-content">
                        <strong>Start a conversation</strong> - Type your message in the input box and press Enter or click Send
                      </div>
                    </li>
                    <li>
                      <div class="list-number">3</div>
                      <div class="list-content">
                        <strong>Choose a model</strong> - Select the AI model that best fits your needs from the dropdown menu
                      </div>
                    </li>
                    <li>
                      <div class="list-number">4</div>
                      <div class="list-content">
                        <strong>Customize settings</strong> - Adjust the interface and model parameters to your preferences
                      </div>
                    </li>
                  </ol>
                </div>
                
                <div class="help-card video-card">
                  <h3>Video Tutorial</h3>
                  <div class="video-placeholder">
                    <div class="play-button">
                      <el-icon size="48"><VideoPlay /></el-icon>
                    </div>
                    <span>Watch the tutorial</span>
                  </div>
                </div>
              </section>
              
              <section id="features" class="help-section-content">
                <div class="section-header">
                  <el-icon class="section-icon"><Star /></el-icon>
                  <h2>Features</h2>
                </div>
                <div class="help-card">
                  <h3>Key Capabilities</h3>
                  <div class="feature-tiles">
                    <div class="feature-tile">
                      <div class="feature-icon">
                        <el-icon><ChatLineRound /></el-icon>
                      </div>
                      <h4>Conversation Management</h4>
                      <p>Create, save, and manage multiple conversations</p>
                    </div>
                    <div class="feature-tile">
                      <div class="feature-icon">
                        <el-icon><Connection /></el-icon>
                      </div>
                      <h4>Model Selection</h4>
                      <p>Choose from different DeepSeek models for various tasks</p>
                    </div>
                    <div class="feature-tile">
                      <div class="feature-icon">
                        <el-icon><View /></el-icon>
                      </div>
                      <h4>Deep Thinking Mode</h4>
                      <p>Activate more thorough analysis for complex questions</p>
                    </div>
                    <div class="feature-tile">
                      <div class="feature-icon">
                        <el-icon><Setting /></el-icon>
                      </div>
                      <h4>Customizable UI</h4>
                      <p>Adjust interface including dark mode and font size</p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section id="models" class="help-section-content">
                <h2>AI Models</h2>
                <div class="help-card">
                  <h3>Available Models</h3>
                  <p>AI Assistant provides access to several specialized DeepSeek models:</p>
                  
                  <el-card class="model-card" shadow="hover">
                    <template #header>
                      <div class="model-header">
                        <h4>DeepSeek Base</h4>
                      </div>
                    </template>
                    <div class="model-content">
                      <p><strong>Best for:</strong> General purpose tasks, answering questions, summarization</p>
                      <p><strong>Description:</strong> A versatile model with broad knowledge and capabilities</p>
                    </div>
                  </el-card>
                  
                  <el-card class="model-card" shadow="hover">
                    <template #header>
                      <div class="model-header">
                        <h4>DeepSeek Coder</h4>
                      </div>
                    </template>
                    <div class="model-content">
                      <p><strong>Best for:</strong> Programming assistance, code generation, debugging</p>
                      <p><strong>Description:</strong> Specialized for software development across multiple programming languages</p>
                    </div>
                  </el-card>
                  
                  <el-card class="model-card" shadow="hover">
                    <template #header>
                      <div class="model-header">
                        <h4>DeepSeek Chat</h4>
                      </div>
                    </template>
                    <div class="model-content">
                      <p><strong>Best for:</strong> Natural conversations, casual interactions</p>
                      <p><strong>Description:</strong> Optimized for engaging and helpful dialogue</p>
                    </div>
                  </el-card>
                </div>
              </section>
              
              <section id="deep-thinking" class="help-section-content">
                <h2>Deep Thinking Mode</h2>
                <div class="help-card">
                  <h3>How It Works</h3>
                  <p>Deep Thinking Mode instructs the AI to spend more time analyzing your query from multiple perspectives before responding. This results in more thorough and comprehensive answers.</p>
                  
                  <h4>When to Use Deep Thinking Mode</h4>
                  <ul>
                    <li>For complex questions requiring nuanced analysis</li>
                    <li>When you need detailed explanations of concepts</li>
                    <li>For creative tasks where you want more thoughtful outputs</li>
                    <li>When comparing multiple options or perspectives</li>
                  </ul>
                  
                  <div class="feature-callout">
                    <el-icon><InfoFilled /></el-icon>
                    <p>Responses in Deep Thinking Mode may take slightly longer but provide more comprehensive information.</p>
                  </div>
                </div>
              </section>
              
              <section id="settings" class="help-section-content">
                <h2>Customizing UI</h2>
                <div class="help-card">
                  <h3>Personalization Options</h3>
                  <p>AI Assistant offers numerous ways to customize your experience:</p>
                  
                  <h4>Appearance</h4>
                  <ul>
                    <li><strong>Dark Mode:</strong> Toggle between light and dark themes</li>
                    <li><strong>Font Size:</strong> Adjust text size for better readability</li>
                    <li><strong>Message Spacing:</strong> Control the density of messages</li>
                    <li><strong>Primary Color:</strong> Change the main accent color</li>
                  </ul>
                  
                  <h4>Model Preferences</h4>
                  <ul>
                    <li><strong>Default Model:</strong> Set your preferred AI model</li>
                    <li><strong>Temperature:</strong> Control response creativity (higher values = more creative)</li>
                    <li><strong>Max Tokens:</strong> Set the maximum length of responses</li>
                  </ul>
                  
                  <h4>Advanced Settings</h4>
                  <ul>
                    <li><strong>Stream Responses:</strong> See responses appear in real-time</li>
                    <li><strong>Code Syntax Highlighting:</strong> Enable/disable for code blocks</li>
                    <li><strong>Save Chat History:</strong> Control whether conversations are saved</li>
                  </ul>
                </div>
              </section>
              
              <section id="faq" class="help-section-content">
                <h2>Frequently Asked Questions</h2>
                <div class="help-card">
                  <el-collapse accordion>
                    <el-collapse-item name="1">
                      <template #title>
                        <h4>How secure is my conversation data?</h4>
                      </template>
                      <div>
                        All conversations are encrypted and stored securely. We do not use your conversations for training our models unless explicitly permitted. You can delete your conversation history at any time.
                      </div>
                    </el-collapse-item>
                    
                    <el-collapse-item name="2">
                      <template #title>
                        <h4>Can I export my conversations?</h4>
                      </template>
                      <div>
                        Yes, you can export conversations in various formats including text and JSON. This feature is available in the conversation menu accessible from the three dots icon.
                      </div>
                    </el-collapse-item>
                    
                    <el-collapse-item name="3">
                      <template #title>
                        <h4>How do I switch between models during a conversation?</h4>
                      </template>
                      <div>
                        You can change models at any time using the model selector dropdown in the chat header. The new model will be used for all subsequent messages in that conversation.
                      </div>
                    </el-collapse-item>
                    
                    <el-collapse-item name="4">
                      <template #title>
                        <h4>Is there a limit to how many messages I can send?</h4>
                      </template>
                      <div>
                        There are no strict limits on the number of messages, but very long conversations may eventually experience context limitations. We recommend starting a new conversation for substantially different topics.
                      </div>
                    </el-collapse-item>
                    
                    <el-collapse-item name="5">
                      <template #title>
                        <h4>Can I use the AI Assistant offline?</h4>
                      </template>
                      <div>
                        The AI Assistant requires an internet connection to function as it processes requests on our servers. We don't currently offer an offline mode.
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </section>
            </div>
          </el-col>
        </el-row>
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
  InfoFilled,
  Star,
  View,
  VideoPlay
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
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
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
      font-size: 42px;
      font-weight: 700;
      background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 16px;
    }
    
    .subtitle {
      font-size: 20px;
      color: #6c757d;
      max-width: 600px;
      margin: 0 auto 30px;
    }
    
    .search-box {
      max-width: 600px;
      margin: 0 auto;
      
      :deep(.el-input__wrapper) {
        border-radius: 50px;
        padding-left: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        height: 50px;
        transition: all 0.3s ease;
      }
      
      :deep(.el-input__wrapper:hover),
      :deep(.el-input__wrapper:focus-within) {
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.12);
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
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
  }
  
  .card-subtitle {
    font-size: 18px;
    font-weight: 600;
    color: #4b6cb7;
    margin: 24px 0 16px;
  }
  
  p {
    color: #555;
    line-height: 1.6;
    font-size: 16px;
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

.help-navigation {
  position: sticky;
  top: 20px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
}

.help-menu {
  border-right: none;
  
  :deep(.el-menu-item) {
    height: 40px;
    line-height: 40px;
    border-radius: 8px;
    margin-bottom: 4px;
  }
  
  :deep(.el-menu-item.is-active) {
    background-color: rgba(75, 108, 183, 0.1);
    color: #4b6cb7;
  }
}

.help-contact {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(75, 108, 183, 0.1) 0%, rgba(75, 108, 183, 0.2) 100%);
  border-radius: 12px;
  text-align: center;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }
  
  .contact-btn {
    width: 100%;
    border-radius: 8px;
    height: 40px;
    background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
    border: none;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(75, 108, 183, 0.3);
    }
  }
}

.help-sections {
  padding: 0 20px 40px;
}

.help-section-content {
  margin-bottom: 40px;
  scroll-margin-top: 20px;
}

.help-section-content h2 {
  font-size: 24px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--el-border-color-light);
}

.help-card {
  background-color: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.help-card h3 {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--el-color-primary);
}

.help-card h4 {
  font-size: 16px;
  margin: 20px 0 10px;
}

.video-placeholder {
  height: 200px;
  background-color: var(--el-fill-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.video-placeholder:hover {
  background-color: var(--el-fill-color-dark);
}

.video-placeholder span {
  margin-top: 12px;
  font-weight: 500;
}

.model-card {
  margin-bottom: 16px;
}

.model-header {
  display: flex;
  align-items: center;
}

.model-header h4 {
  margin: 0;
}

.model-content {
  padding-top: 8px;
}

.model-content p {
  margin: 8px 0;
}

.feature-callout {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  background-color: var(--el-color-info-light-9);
  border-radius: 6px;
}

.feature-callout .el-icon {
  color: var(--el-color-info);
  margin-top: 2px;
}

.feature-callout p {
  margin: 0;
}

// Section headers
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  .section-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
    color: white;
    border-radius: 12px;
    font-size: 20px;
    margin-right: 16px;
  }
  
  h2 {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0;
  }
}

// Numbered list styling
.numbered-list {
  list-style: none;
  padding: 0;
  margin: 24px 0;
  
  li {
    display: flex;
    margin-bottom: 16px;
    
    .list-number {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      margin-right: 16px;
      flex-shrink: 0;
    }
    
    .list-content {
      padding-top: 4px;
    }
  }
}

// Video card styling
.video-card {
  .video-placeholder {
    height: 240px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    
    &:hover {
      .play-button {
        transform: scale(1.1);
      }
    }
    
    .play-button {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }
    
    span {
      font-size: 16px;
      color: #4b6cb7;
      font-weight: 500;
    }
  }
}

// Feature tiles
.feature-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 24px;
  
  .feature-tile {
    background: rgba(245, 247, 250, 0.7);
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      background: white;
      
      .feature-icon {
        transform: scale(1.1);
      }
    }
    
    .feature-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, rgba(75, 108, 183, 0.1) 0%, rgba(75, 108, 183, 0.2) 100%);
      color: #4b6cb7;
      font-size: 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      transition: all 0.3s ease;
    }
    
    h4 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
}
</style> 