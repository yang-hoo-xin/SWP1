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
        <el-tooltip content="Settings" placement="right" :disabled="!sidebarCollapsed">
          <el-button class="footer-btn" @click="showSettings = true">
            <el-icon><Setting /></el-icon>
            <span v-if="!sidebarCollapsed">Settings</span>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="Logout" placement="right" :disabled="!sidebarCollapsed">
          <el-button class="footer-btn" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            <span v-if="!sidebarCollapsed">Logout</span>
          </el-button>
        </el-tooltip>
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
            <el-select v-model="selectedModel" size="small" @change="handleModelChange">
              <el-option v-for="model in availableModels" :key="model.id" :label="model.name" :value="model.id">
                <div class="model-option">
                  <img :src="model.avatar" class="model-avatar" alt="Model Avatar" />
                  <div class="model-details">
                    <div class="model-name">{{ model.name }}</div>
                    <div class="model-description">{{ model.description }}</div>
                  </div>
                </div>
              </el-option>
            </el-select>
          </div>
        </div>
        
        <div class="chat-actions">
          <el-button 
            type="primary" 
            :class="{'active': deepThinkingMode}"
            @click="toggleDeepThinking">
            <el-icon><View /></el-icon>
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
            <el-icon size="48"><ChatDotSquare /></el-icon>
            <h3>Start a new conversation</h3>
            <p>Ask me anything, and I'll do my best to assist you.</p>
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
            
            <div class="message-content">
              <div class="message-header">
                <span class="message-author">{{ message.role === 'user' ? 'You' : selectedModelDetails.name }}</span>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
              
              <div class="message-body" v-html="formatMessage(message.content)"></div>
              
              <div class="message-actions" v-if="message.role === 'assistant'">
                <el-button size="small" text @click="copyMessage(message.content)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
                <el-button size="small" text v-if="index === currentConversation?.messages.length - 1 && message.role === 'assistant'">
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
        <div class="input-buttons">
          <el-tooltip content="Upload File" placement="top">
            <el-button circle>
              <el-icon><Upload /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        
        <div class="input-area">
          <el-input
            v-model="userInput"
            type="textarea"
            :rows="2"
            resize="none"
            placeholder="Type your message here..."
            @keydown.enter.prevent="sendMessage"
          />
        </div>
        
        <div class="send-button">
          <el-button 
            type="primary" 
            :loading="isStreaming" 
            :disabled="!userInput.trim()" 
            @click="sendMessage"
          >
            <el-icon><Position /></el-icon>
            Send
          </el-button>
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
      <el-tabs>
        <el-tab-pane label="Interface">
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
import chatService, { ChatRequest } from '../services/chatService'

// Router and auth store
const router = useRouter()
const authStore = useAuthStore()

// UI State
const sidebarCollapsed = ref(false)
const showSettings = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// Chat state
const userInput = ref('')
const isStreaming = ref(false)
const streamingText = ref('')
const deepThinkingMode = ref(false)

// User avatar - can be from auth store in real implementation
const userAvatar = ref('/src/assets/avatars/user-avatar.svg') 

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

// Watchers
watch(() => uiSettings.darkMode, (newValue) => {
  document.documentElement.classList.toggle('dark-theme', newValue)
})

// Lifecycle hooks
onMounted(() => {
  scrollToBottom()
  
  // Apply initial settings
  document.documentElement.classList.toggle('dark-theme', uiSettings.darkMode)
  document.documentElement.style.setProperty('--primary-color', uiSettings.primaryColor)
  document.documentElement.style.setProperty('--font-size', `${uiSettings.fontSize}px`)
  document.documentElement.style.setProperty('--message-spacing', `${uiSettings.messageSpacing}rem`)
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
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: flex-start;
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

.model-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.model-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.model-details {
  display: flex;
  flex-direction: column;
}

.model-name {
  font-weight: 500;
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
  max-width: 400px;
}

.empty-chat-content h3 {
  margin: 16px 0 8px;
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
  padding: 16px;
  border-top: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background-color: var(--el-bg-color);
}

.input-buttons {
  display: flex;
  gap: 8px;
}

.input-area {
  flex: 1;
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
</style> 