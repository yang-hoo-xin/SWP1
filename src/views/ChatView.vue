<template>
  <div class="chat-container" :class="{ 'dark-mode': uiSettings.darkMode }">
    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <el-icon size="24"><ChatDotSquare /></el-icon>
          <span v-if="!sidebarCollapsed">AI Assistant</span>
        </div>
        <el-button type="text" @click="sidebarCollapsed = !sidebarCollapsed">
          <el-icon><Fold v-if="!sidebarCollapsed" /><Expand v-else /></el-icon>
        </el-button>
      </div>

      <div class="sidebar-content" v-if="!sidebarCollapsed">
        <!-- Conversation history -->
        <div class="conversation-list">
          <div class="section-title">
            <span>Conversations</span>
            <el-button type="primary" size="small" @click="startNewConversation">
              <el-icon><Plus /></el-icon> New
            </el-button>
          </div>
          
          <div 
            v-for="(conv, index) in conversations" 
            :key="index" 
            class="conversation-item" 
            :class="{ 'active': currentConversationIndex === index }"
            @click="selectConversation(index)"
          >
            <div class="conversation-title">
              <el-icon><ChatLineRound /></el-icon>
              <span>{{ conv.title || `Conversation ${index + 1}` }}</span>
            </div>
            <div class="conversation-actions">
              <el-dropdown trigger="click" @command="handleConvAction($event, index)">
                <el-icon><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="rename">Rename</el-dropdown-item>
                    <el-dropdown-item command="delete" divided>Delete</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <!-- 新增：用户资料区域 -->
        <div class="user-profile" v-if="!sidebarCollapsed">
          <div class="user-avatar-container" @click="showSettings = true; activeSettingsTab = 'profile'">
            <img :src="userAvatar" alt="User Avatar" class="user-avatar" />
            <div class="avatar-edit-overlay">
              <el-icon><EditPen /></el-icon>
            </div>
          </div>
          <div class="user-info">
            <div class="user-name">{{ userInfo?.nickname || userInfo?.username || 'User' }}</div>
            <div class="user-email">{{ userInfo?.email || '' }}</div>
          </div>
        </div>
        <div class="user-profile-collapsed" v-else>
          <div class="user-avatar-container" @click="showSettings = true; activeSettingsTab = 'profile'">
            <img :src="userAvatar" alt="User Avatar" class="user-avatar" />
            <div class="avatar-edit-overlay">
              <el-icon><EditPen /></el-icon>
            </div>
          </div>
        </div>
        
        <div class="footer-buttons">
          <el-tooltip content="Settings" placement="right" :disabled="!sidebarCollapsed">
            <el-button class="footer-btn" @click="showSettings = true; activeSettingsTab = 'interface'">
              <div class="btn-icon-wrapper">
                <el-icon class="footer-icon"><Setting /></el-icon>
              </div>
              <span v-if="!sidebarCollapsed" class="btn-text">Settings</span>
            </el-button>
          </el-tooltip>
          
          <el-tooltip content="Logout" placement="right" :disabled="!sidebarCollapsed">
            <el-button class="footer-btn" @click="handleLogout">
              <div class="btn-icon-wrapper">
                <el-icon class="footer-icon"><SwitchButton /></el-icon>
              </div>
              <span v-if="!sidebarCollapsed" class="btn-text">Logout</span>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="chat-main">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="chat-info">
          <h2>{{ currentConversation?.title || 'New Conversation' }}</h2>
          <div class="model-selector">
            <span class="model-label">Model:</span>
            <div class="model-dropdown">
              <div class="selected-model" @click="showModelDropdown = !showModelDropdown">
                <img :src="selectedModelDetails.avatar" class="model-avatar" alt="Model Avatar" />
                <div class="model-name">{{ selectedModelDetails.name }}</div>
                <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
              </div>
              <div class="model-options" v-if="showModelDropdown">
                <div 
                  v-for="model in availableModels" 
                  :key="model.id" 
                  class="model-option" 
                  :class="{ 'active': selectedModel === model.id }"
                  @click="selectModelAndClose(model.id)"
                >
                  <img :src="model.avatar" class="model-avatar" alt="Model Avatar" />
                  <div class="model-details">
                    <div class="model-name">{{ model.name }}</div>
                    <div class="model-description">{{ model.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chat-actions">
          <el-button 
            type="primary" 
            :class="{'active': deepThinkingMode}"
            @click="toggleDeepThinking">
            <el-icon><Lightbulb /></el-icon>
            <span>Deep Thinking {{ deepThinkingMode ? 'ON' : 'OFF' }}</span>
          </el-button>
          
          <el-button @click="clearChat">
            <el-icon><Delete /></el-icon>
            <span>Clear</span>
          </el-button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="chat-messages" ref="messagesContainer">
        <div v-if="currentConversation?.messages.length === 0" class="empty-chat">
          <div class="empty-chat-content">
            <div class="welcome-avatar">
              <img :src="selectedModelDetails.avatar" alt="AI" />
            </div>
            <h3>Welcome to {{ selectedModelDetails.name }}</h3>
            <p>How can I assist you today?</p>
            
            <div class="suggestion-bubbles">
              <div class="suggestion-bubble" @click="applyTemplate('intro')">
                <span>👋 Introduce yourself</span>
              </div>
              <div class="suggestion-bubble" @click="applyTemplate('help')">
                <span>💡 What can you do?</span>
              </div>
              <div class="suggestion-bubble" @click="applyTemplate('code')">
                <span>💻 Write some code</span>
              </div>
              <div class="suggestion-bubble" @click="applyTemplate('creative')">
                <span>✨ Creative ideas</span>
              </div>
              <div class="suggestion-bubble" @click="applyTemplate('translate')">
                <span>🌐 Translate text</span>
              </div>
              <div class="suggestion-bubble" @click="applyTemplate('analyze')">
                <span>📊 Data analysis</span>
              </div>
            </div>
          </div>
        </div>
        
        <template v-else>
          <div 
            v-for="(message, index) in currentConversation?.messages" 
            :key="index" 
            class="message-container"
            :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' }"
          >
            <div class="message-avatar">
              <img :src="message.role === 'user' ? userAvatar : selectedModelDetails.avatar" :alt="message.role" />
            </div>
            
            <div class="message-content" :class="{ 'user-bubble': message.role === 'user', 'ai-bubble': message.role === 'assistant' }">
              <div class="message-header">
                <span class="message-author">{{ message.role === 'user' ? 'You' : selectedModelDetails.name }}</span>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
              
              <div class="message-body" v-html="formatMessage(message.content)"></div>
              
              <div class="message-actions" v-if="message.role === 'assistant'">
                <el-button size="small" text @click="copyMessage(message.content)" class="action-btn">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
                <el-button size="small" text v-if="index === currentConversation?.messages.length - 1 && message.role === 'assistant'" class="action-btn">
                  <el-icon><RefreshLeft /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
          
          <div v-if="isStreaming" class="message-container ai-message">
            <div class="message-avatar">
              <img :src="selectedModelDetails.avatar" alt="AI" />
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-author">{{ selectedModelDetails.name }}</span>
                <span class="message-time">now</span>
              </div>
              <div class="message-body">
                <span v-html="streamingText"></span>
                <span class="typing-indicator"></span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Input Area -->
      <div class="chat-input-container">
        <div class="input-wrapper">
          <el-input
            v-model="userInput"
            type="textarea"
            :rows="1"
            resize="none"
            placeholder="Type your message here..."
            @keydown.enter.prevent="sendMessage"
            class="message-input"
          />
          
          <div class="input-actions">
            <el-tooltip content="Upload File" placement="top">
              <el-button class="action-icon-btn">
                <el-icon><Upload /></el-icon>
              </el-button>
            </el-tooltip>
            
            <el-tooltip content="Insert Image" placement="top">
              <el-button class="action-icon-btn">
                <el-icon><Picture /></el-icon>
              </el-button>
            </el-tooltip>
            
            <el-button 
              type="primary" 
              circle
              :loading="isStreaming" 
              :disabled="!userInput.trim()" 
              @click="sendMessage"
              class="send-btn"
            >
              <el-icon><Position /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Settings Dialog -->
    <el-dialog
      v-model="showSettings"
      title="Settings"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeSettingsTab">
        <!-- 新增：用户资料选项卡 -->
        <el-tab-pane label="Profile" name="profile">
          <div class="profile-settings">
            <div class="avatar-upload-section">
              <h4>Profile Picture</h4>
              <div class="avatar-preview">
                <img :src="userAvatar" alt="User Avatar" class="user-avatar-large" />
                <div class="avatar-actions">
                  <el-upload
                    class="avatar-uploader"
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="handleAvatarChange"
                    accept="image/*"
                  >
                    <el-button type="primary">Change Avatar</el-button>
                  </el-upload>
                  <el-button v-if="avatarFile" type="success" @click="uploadAvatar">
                    <el-icon><Upload /></el-icon> Upload
                  </el-button>
                </div>
              </div>
            </div>
            
            <div class="profile-info">
              <h4>Profile Information</h4>
              <el-form label-position="left" label-width="120px">
                <el-form-item label="Username">
                  <el-input v-model="userInfo.username" disabled />
                </el-form-item>
                <el-form-item label="Nickname">
                  <el-input v-model="profileForm.nickname" placeholder="Enter your nickname" />
                </el-form-item>
                <el-form-item label="Email">
                  <el-input v-model="userInfo.email" disabled />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updateProfile">Save Profile</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="Interface" name="interface">
          <h4>Appearance</h4>
          <el-form label-position="left" label-width="120px">
            <el-form-item label="Dark Mode">
              <el-switch v-model="uiSettings.darkMode" />
            </el-form-item>
            <el-form-item label="Font Size">
              <el-slider v-model="uiSettings.fontSize" :min="12" :max="20" show-input />
            </el-form-item>
            <el-form-item label="Message Spacing">
              <el-slider v-model="uiSettings.messageSpacing" :min="1" :max="3" :step="0.5" show-input />
            </el-form-item>
            <el-form-item label="Primary Color">
              <el-color-picker v-model="uiSettings.primaryColor" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="AI Models">
          <h4>Model Preferences</h4>
          <el-form label-position="left" label-width="120px">
            <el-form-item label="Default Model">
              <el-select v-model="uiSettings.defaultModel">
                <el-option 
                  v-for="model in availableModels" 
                  :key="model.id" 
                  :label="model.name" 
                  :value="model.id" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Temperature">
              <el-slider v-model="uiSettings.temperature" :min="0" :max="1" :step="0.1" show-input />
            </el-form-item>
            <el-form-item label="Max Tokens">
              <el-input-number v-model="uiSettings.maxTokens" :min="100" :max="4000" :step="100" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="Advanced">
          <h4>Advanced Settings</h4>
          <el-form label-position="left" label-width="160px">
            <el-form-item label="Stream Responses">
              <el-switch v-model="uiSettings.streamResponses" />
            </el-form-item>
            <el-form-item label="Code Syntax Highlighting">
              <el-switch v-model="uiSettings.syntaxHighlighting" />
            </el-form-item>
            <el-form-item label="Save Chat History">
              <el-switch v-model="uiSettings.saveChatHistory" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSettings = false">Cancel</el-button>
          <el-button type="primary" @click="saveSettings">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import hljs from 'highlight.js'
import { marked } from 'marked'
import chatService from '../services/chatService'
import type { ChatRequest } from '../services/chatService'
import { authApi } from '../api/auth'
import { userApi } from '../api/user'
import type { UserInfo } from '../types/user'

// Router and auth store
const router = useRouter()
const authStore = useAuthStore()

// UI State
const sidebarCollapsed = ref(false)
const showSettings = ref(false)
const showModelDropdown = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const activeSettingsTab = ref('interface')

// User profile
const userInfo = ref<UserInfo>({ 
  id: 0, 
  username: '', 
  nickname: '', 
  email: '', 
  avatar: '',
  roles: []
})

const profileForm = reactive({
  nickname: ''
})
const avatarFile = ref<File | null>(null)
const avatarPreview = ref('')

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const userData = await authApi.getCurrentUser()
    if (userData) {
      userInfo.value = userData
      profileForm.nickname = userData.nickname || ''
      if (userData.avatar) {
        userAvatar.value = userData.avatar
      }
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
  }
}

// 处理头像更改
const handleAvatarChange = (file: any) => {
  const isImage = file.raw.type.startsWith('image/')
  const isLt2M = file.raw.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('Avatar must be an image file!')
    return
  }
  
  if (!isLt2M) {
    ElMessage.error('Avatar size can not exceed 2MB!')
    return
  }
  
  avatarFile.value = file.raw
  
  // 创建图片预览
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
    userAvatar.value = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
}

// 上传头像
const uploadAvatar = async () => {
  if (!avatarFile.value) {
    ElMessage.warning('Please select a file first')
    return
  }
  
  try {
    ElMessage.info('Uploading avatar...')
    console.log('Avatar file to upload:', avatarFile.value)
    
    const formData = new FormData()
    formData.append('file', avatarFile.value)
    
    // 输出FormData内容用于调试 (仅支持较新的浏览器)
    try {
      // @ts-ignore - FormData.entries() 在某些TS版本中可能没有正确的类型定义
      for (let pair of formData.entries()) {
        console.log('FormData content:', pair[0], pair[1])
      }
    } catch (e) {
      console.log('Cannot log FormData entries:', e)
    }
    
    // 调用上传API
    const response = await userApi.uploadAvatar(formData)
    console.log('Upload response:', response)
    
    if (response && response.avatarUrl) {
      userInfo.value.avatar = response.avatarUrl
      userAvatar.value = response.avatarUrl
      ElMessage.success('Avatar uploaded successfully')
      avatarFile.value = null
    } else {
      ElMessage.error('Upload failed: Invalid response format')
      console.error('Invalid response format:', response)
    }
  } catch (error: any) {
    console.error('Failed to upload avatar:', error)
    const errorMessage = error.message || 'Unknown error'
    ElMessage.error(`Failed to upload avatar: ${errorMessage}`)
  }
}

// 更新用户资料
const updateProfile = async () => {
  try {
    const response = await userApi.updateUserInfo({
      nickname: profileForm.nickname
    })
    
    if (response) {
      userInfo.value = response
      ElMessage.success('Profile updated successfully')
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
    ElMessage.error('Failed to update profile')
  }
}

// Chat state
const userInput = ref('')
const isStreaming = ref(false)
const streamingText = ref('')
const deepThinkingMode = ref(false)

// User avatar - can be from auth store in real implementation
const userAvatar = ref(userInfo.value?.avatar || '/src/assets/avatars/user-avatar.svg')

// Available models
const availableModels = ref([
  { 
    id: 'deepseek-base', 
    name: 'DeepSeek Base', 
    description: 'Powerful general-purpose language model',
    avatar: '/src/assets/avatars/deepseek-avatar.svg'
  },
  { 
    id: 'deepseek-coder', 
    name: 'DeepSeek Coder', 
    description: 'Specialized for programming tasks',
    avatar: '/src/assets/avatars/deepseek-coder-avatar.svg'
  },
  { 
    id: 'deepseek-chat', 
    name: 'DeepSeek Chat', 
    description: 'Optimized for conversational interactions',
    avatar: '/src/assets/avatars/deepseek-chat-avatar.svg'
  }
])

// Selected model
const selectedModel = ref('deepseek-base')
const selectedModelDetails = computed(() => {
  return availableModels.value.find(model => model.id === selectedModel.value) || availableModels.value[0]
})

// UI settings
const uiSettings = reactive({
  darkMode: false,
  fontSize: 14,
  messageSpacing: 1.5,
  primaryColor: '#409EFF',
  defaultModel: 'deepseek-base',
  temperature: 0.7,
  maxTokens: 2000,
  streamResponses: true,
  syntaxHighlighting: true,
  saveChatHistory: true
})

// Conversations
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
}

const conversations = ref<Conversation[]>([
  {
    id: '1',
    title: 'New Conversation',
    messages: [],
    model: 'deepseek-base'
  }
])

const currentConversationIndex = ref(0)
const currentConversation = computed(() => conversations.value[currentConversationIndex.value])

// Methods
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatMessage(content: string): string {
  if (!content) return ''
  
  // Use marked to parse markdown
  const parsed = marked.parse(content, { breaks: true }) as string
  
  // If syntax highlighting is enabled
  if (uiSettings.syntaxHighlighting) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = parsed
    
    // Find all code blocks and apply syntax highlighting
    const codeBlocks = tempDiv.querySelectorAll('pre code')
    codeBlocks.forEach(block => {
      hljs.highlightElement(block as HTMLElement)
    })
    
    return tempDiv.innerHTML
  }
  
  return parsed
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function startNewConversation() {
  const newConversation: Conversation = {
    id: Date.now().toString(),
    title: 'New Conversation',
    messages: [],
    model: selectedModel.value
  }
  
  conversations.value.push(newConversation)
  currentConversationIndex.value = conversations.value.length - 1
}

function selectConversation(index: number) {
  currentConversationIndex.value = index
  selectedModel.value = conversations.value[index].model
}

function handleConvAction(command: string, index: number) {
  if (command === 'rename') {
    // Implement rename logic (could show a dialog)
    ElMessage.info('Rename functionality to be implemented')
  } else if (command === 'delete') {
    if (conversations.value.length > 1) {
      conversations.value.splice(index, 1)
      if (currentConversationIndex.value >= conversations.value.length) {
        currentConversationIndex.value = conversations.value.length - 1
      }
    } else {
      ElMessage.warning('Cannot delete the last conversation')
    }
  }
}

function handleModelChange() {
  if (currentConversation.value) {
    currentConversation.value.model = selectedModel.value
    
    // Optionally add a system message about model change
    if (currentConversation.value.messages.length > 0) {
      ElMessage.info(`Switched to ${selectedModelDetails.value.name}`)
    }
  }
}

function toggleDeepThinking() {
  deepThinkingMode.value = !deepThinkingMode.value
  ElMessage.success(`Deep thinking mode ${deepThinkingMode.value ? 'enabled' : 'disabled'}`)
}

function clearChat() {
  if (currentConversation.value) {
    currentConversation.value.messages = []
    ElMessage.success('Conversation cleared')
  }
}

async function sendMessage() {
  const trimmedInput = userInput.value.trim()
  if (!trimmedInput || isStreaming.value) return
  
  // Add user message
  currentConversation.value.messages.push({
    role: 'user',
    content: trimmedInput,
    timestamp: Date.now()
  })
  
  userInput.value = ''
  scrollToBottom()
  
  // Prepare for streaming response
  isStreaming.value = true
  streamingText.value = ''
  scrollToBottom()
  
  try {
    // Prepare the request
    const request: ChatRequest = {
      messages: currentConversation.value.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      })),
      model: selectedModel.value,
      temperature: uiSettings.temperature,
      max_tokens: uiSettings.maxTokens,
      deep_thinking: deepThinkingMode.value
    }
    
    if (uiSettings.streamResponses) {
      // Stream the response
      await chatService.streamChatCompletion(request, {
        onStart: () => {
          isStreaming.value = true
          streamingText.value = ''
          scrollToBottom()
        },
        onToken: (token) => {
          streamingText.value += token
          scrollToBottom()
        },
        onComplete: (fullResponse) => {
          // Add the complete message to the conversation
          currentConversation.value.messages.push({
            role: 'assistant',
            content: fullResponse,
            timestamp: Date.now()
          })
          isStreaming.value = false
          scrollToBottom()
        },
        onError: (error) => {
          console.error('Error in streaming response:', error)
          ElMessage.error('Failed to get response from AI. Please try again.')
          isStreaming.value = false
        }
      })
    } else {
      // Non-streaming response
      const response = await chatService.chatCompletion(request)
      
      // Add the complete message to the conversation
      currentConversation.value.messages.push({
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      })
      
      isStreaming.value = false
      scrollToBottom()
    }
  } catch (error) {
    console.error('Error sending message:', error)
    ElMessage.error('Failed to get response from AI. Please try again.')
    isStreaming.value = false
  }
}

function copyMessage(text: string) {
  navigator.clipboard.writeText(text)
    .then(() => ElMessage.success('Copied to clipboard'))
    .catch(() => ElMessage.error('Failed to copy text'))
}

function saveSettings() {
  // In a real app, you would save these to storage/backend
  showSettings.value = false
  ElMessage.success('Settings saved')
  
  // Apply the selected model as default
  if (uiSettings.defaultModel !== selectedModel.value) {
    selectedModel.value = uiSettings.defaultModel
    handleModelChange()
  }
  
  // Apply any CSS variables based on settings
  document.documentElement.style.setProperty('--primary-color', uiSettings.primaryColor)
  document.documentElement.style.setProperty('--font-size', `${uiSettings.fontSize}px`)
  document.documentElement.style.setProperty('--message-spacing', `${uiSettings.messageSpacing}rem`)
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}

function selectModelAndClose(modelId: string) {
  selectedModel.value = modelId
  showModelDropdown.value = false
  handleModelChange()
}

// Apply suggestion template
function applyTemplate(type: string) {
  let prompt = '';
  
  switch(type) {
    case 'intro':
      prompt = 'Please introduce yourself. What are your capabilities and features?';
      break;
    case 'help':
      prompt = 'What can you help me with? What are some common use cases?';
      break;
    case 'code':
      prompt = 'Please write a simple TodoList application using JavaScript';
      break;
    case 'creative':
      prompt = 'Give me some creative ideas for a new product';
      break;
    case 'translate':
      prompt = 'Please translate this text to Spanish: Artificial intelligence is changing the way we live';
      break;
    case 'analyze':
      prompt = 'How can I use AI to analyze and visualize large datasets?';
      break;
    default:
      prompt = 'Hello, can you help me with some questions?';
  }
  
  userInput.value = prompt;
}

// Watchers
watch(() => uiSettings.darkMode, (newValue) => {
  document.documentElement.classList.toggle('dark-theme', newValue)
})

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.model-dropdown') && showModelDropdown.value) {
      showModelDropdown.value = false
    }
  })
  
  scrollToBottom()
  
  // Apply initial settings
  document.documentElement.classList.toggle('dark-theme', uiSettings.darkMode)
  document.documentElement.style.setProperty('--primary-color', uiSettings.primaryColor)
  document.documentElement.style.setProperty('--font-size', `${uiSettings.fontSize}px`)
  document.documentElement.style.setProperty('--message-spacing', `${uiSettings.messageSpacing}rem`)
  
  // Check if showSettings query parameter is present
  const route = router.currentRoute.value
  if (route.query.showSettings === 'true') {
    showSettings.value = true
  }
  
  // 其他已有的onMounted逻辑
  fetchUserInfo()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
}

/* Sidebar */
.sidebar {
  width: 280px;
  min-width: 280px;
  height: 100%;
  border-right: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  background-color: var(--el-bg-color-page);
}

.sidebar.collapsed {
  width: 60px;
  min-width: 60px;
}

.sidebar-header {
  padding: 16px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-border-color-light);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 18px;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.section-title {
  padding: 0 16px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
}

.conversation-list {
  margin-bottom: 20px;
}

.conversation-item {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  margin: 0 8px 4px;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background-color: var(--el-fill-color-light);
}

.conversation-item.active {
  background-color: var(--el-color-primary-light-9);
}

.conversation-title {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.conversation-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.conversation-item:hover .conversation-actions {
  opacity: 1;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color-page);
}

.footer-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-btn {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  padding: 0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  font-weight: 500;
  border: none;
  height: 48px;
  margin: 0;
  overflow: hidden;
}

.footer-btn:hover {
  background-color: var(--el-color-primary-light-9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.footer-btn:active {
  transform: translateY(0);
}

.btn-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  flex-shrink: 0;
}

.footer-icon {
  font-size: 18px;
  color: var(--el-color-primary);
}

.btn-text {
  font-size: 14px;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 4px;
}

.dark-mode .footer-btn {
  background-color: #2c2c2c;
}

.dark-mode .footer-btn:hover {
  background-color: #363636;
}

/* Main Chat Area */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-header {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color);
}

.chat-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.chat-info h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.model-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.model-dropdown {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.selected-model {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: var(--el-fill-color-light);
  transition: background-color 0.2s;
}

.selected-model:hover {
  background-color: var(--el-fill-color);
}

.dropdown-arrow {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.model-options {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background-color: var(--el-bg-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  width: 280px;
}

.model-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  transition: background-color 0.2s;
}

.model-option:hover, .model-option.active {
  background-color: var(--el-fill-color-light);
}

.model-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.model-details {
  display: flex;
  flex-direction: column;
}

.model-name {
  font-weight: 500;
  font-size: 14px;
}

.model-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-actions .active {
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
}

/* Messages Area */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: var(--el-fill-color-lighter);
}

.empty-chat {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--el-text-color-secondary);
}

.empty-chat-content {
  text-align: center;
  max-width: 600px;
  animation: fadeIn 0.5s ease;
}

.welcome-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 16px;
  padding: 5px;
  background: linear-gradient(135deg, var(--el-color-primary-light-5), var(--el-color-primary));
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: pulse 2s infinite;
}

.welcome-avatar img {
  width: 90%;
  height: 90%;
  border-radius: 50%;
  object-fit: cover;
  background-color: white;
}

.empty-chat-content h3 {
  margin: 16px 0 8px;
  font-size: 24px;
  color: var(--el-text-color-primary);
}

.empty-chat-content p {
  font-size: 16px;
  margin-bottom: 30px;
}

.suggestion-bubbles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.suggestion-bubble {
  background-color: #f5f7fa;
  border-radius: 20px;
  padding: 10px 18px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.5s ease both;
  border: 1px solid #e4e7ed;
}

.suggestion-bubble:nth-child(1) { animation-delay: 0.1s; }
.suggestion-bubble:nth-child(2) { animation-delay: 0.2s; }
.suggestion-bubble:nth-child(3) { animation-delay: 0.3s; }
.suggestion-bubble:nth-child(4) { animation-delay: 0.4s; }
.suggestion-bubble:nth-child(5) { animation-delay: 0.5s; }
.suggestion-bubble:nth-child(6) { animation-delay: 0.6s; }

.suggestion-bubble:hover {
  background-color: #ecf5ff;
  color: var(--el-color-primary);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark-mode .suggestion-bubble {
  background-color: #2c2c2c;
  color: #dcdfe6;
  border-color: #434343;
}

.dark-mode .suggestion-bubble:hover {
  background-color: #363636;
  color: var(--el-color-primary);
}

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

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.message-container {
  display: flex;
  margin-bottom: calc(var(--message-spacing, 1.5rem));
  animation: fadeIn 0.3s ease;
}

.user-message {
  justify-content: flex-end;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}

.user-message .message-avatar {
  order: 2;
  margin-right: 0;
  margin-left: 12px;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  max-width: 70%;
  border-radius: 8px;
  padding: 12px 16px;
  background-color: var(--el-bg-color);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ai-message .message-content {
  background-color: var(--el-color-primary-light-9);
}

.user-message .message-content {
  background-color: var(--el-color-success-light-9);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
}

.message-author {
  font-weight: 600;
}

.message-time {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.message-body {
  font-size: var(--font-size, 14px);
  line-height: 1.5;
  white-space: pre-wrap;
}

.message-body p:first-child {
  margin-top: 0;
}

.message-body p:last-child {
  margin-bottom: 0;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 8px;
}

/* Code blocks styling */
.message-body pre {
  background-color: var(--el-fill-color);
  border-radius: 4px;
  padding: 12px;
  overflow-x: auto;
  margin: 12px 0;
}

.message-body code {
  font-family: monospace;
}

/* Typing indicator */
.typing-indicator {
  display: inline-block;
  width: 12px;
  height: 16px;
  position: relative;
  margin-left: 6px;
}

.typing-indicator::after {
  content: "";
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--el-text-color-secondary);
  animation: blink 1s infinite;
  top: 50%;
  transform: translateY(-50%);
}

/* Chat Input */
.chat-input-container {
  padding: 16px 20px;
  border-top: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color);
  position: relative;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  border: 1px solid #e4e7ed;
  background-color: #fff;
  padding: 10px 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.message-input {
  flex: 1;
}

.message-input :deep(.el-textarea__inner) {
  border: none;
  padding: 8px 0;
  resize: none;
  line-height: 1.5;
  box-shadow: none;
  background: transparent;
  min-height: 24px !important;
}

.message-input :deep(.el-textarea__inner:focus) {
  box-shadow: none;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}

.action-icon-btn {
  border: none;
  background: transparent;
  padding: 6px;
  border-radius: 50%;
  color: #909399;
}

.action-icon-btn:hover {
  background-color: #f5f7fa;
  color: #409EFF;
}

.action-icon-btn .el-icon {
  font-size: 18px;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #95ec69, #5ad025);
  border: none;
  box-shadow: 0 4px 12px rgba(90, 208, 37, 0.3);
  transition: all 0.3s ease;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(90, 208, 37, 0.4);
}

.send-btn:active {
  transform: translateY(0);
}

.send-btn .el-icon {
  font-size: 18px;
}

.dark-mode .input-wrapper {
  background-color: #2c2c2c;
  border-color: #444;
}

.dark-mode .input-actions {
  border-top-color: #444;
}

.dark-mode .message-input :deep(.el-textarea__inner) {
  background-color: transparent;
  color: #eee;
}

.dark-mode .action-icon-btn {
  color: #aaa;
}

.dark-mode .action-icon-btn:hover {
  background-color: #3c3c3c;
}

.dark-mode .send-btn {
  background: linear-gradient(135deg, #7fd750, #4ea320);
}

/* Dark Mode Specific Styles */
.dark-mode {
  --el-bg-color: #1a1a1a;
  --el-bg-color-page: #121212;
  --el-fill-color-lighter: #1d1d1d;
  --el-text-color-primary: #e0e0e0;
  --el-border-color-light: #333;
  --el-fill-color-light: #2c2c2c;
  --el-color-primary-light-9: #283142;
  --el-color-success-light-9: #283828;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

/* Message bubbles styling */
.user-bubble {
  background-color: #95ec69 !important;
  border-radius: 18px 4px 18px 18px !important;
  color: #000 !important;
}

.ai-bubble {
  background-color: #ffffff !important;
  border-radius: 4px 18px 18px 18px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
}

.user-message .message-time, 
.user-message .message-author {
  color: rgba(0, 0, 0, 0.6) !important;
}

.message-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.message-content:hover .message-actions {
  opacity: 1;
}

.action-btn {
  color: var(--el-text-color-secondary);
  padding: 4px !important;
  height: 24px !important;
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--el-color-primary);
}

/* User Profile in Sidebar */
.user-profile {
  display: flex;
  align-items: center;
  padding: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.03);
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-profile:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.user-profile-collapsed {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.user-avatar-container {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.user-avatar-container:hover .avatar-edit-overlay {
  opacity: 1;
}

.user-info {
  margin-left: 15px;
  flex-grow: 1;
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Profile Settings Tab */
.profile-settings {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.user-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
}

.avatar-actions {
  display: flex;
  gap: 10px;
}

.profile-info {
  margin-top: 10px;
}

.dark-mode .user-profile {
  border-top-color: rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
}

.dark-mode .user-profile:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.dark-mode .user-email {
  color: #bbb;
}
</style> 