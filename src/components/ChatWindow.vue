<template>
  <div class="chat-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <el-button type="primary" @click="createNewChat" :disabled="loading">
          <el-icon><Plus /></el-icon> New Chat
        </el-button>
      </div>
      <div class="session-list">
        <div
          v-for="session in chatSessions"
          :key="session.id"
          class="session-item"
          :class="{ active: currentSessionId === session.id }"
          @click="switchSession(session.id)"
        >
          <el-tooltip :content="session.title" placement="right" :show-after="1000">
            <div class="session-title">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ session.title }}</span>
            </div>
          </el-tooltip>
          <div class="session-actions">
            <el-button
              type="text"
              size="small"
              @click.stop="showRenameDialog(session)"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.stop="confirmDeleteSession(session.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <div class="sidebar-footer">
        <el-button type="text" @click="openSettings">
          <el-icon><Setting /></el-icon> Settings
        </el-button>
        <el-button type="text" @click="logout" class="logout-button">
          <el-icon><SwitchButton /></el-icon> Log out
        </el-button>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="chat-main">
      <!-- Chat Messages Area -->
      <div class="chat-messages" ref="messagesContainer">
        <template v-if="currentSession">
          <div
            v-for="message in currentSession.messages.filter(m => m.role !== 'system')"
            :key="message.id"
            class="message"
            :class="message.role"
          >
            <div class="message-avatar">
              <el-avatar :icon="message.role === 'user' ? 'User' : 'ChatDotRound'" />
            </div>
            <div class="message-content">
              <div v-if="message.role === 'user'">{{ message.content }}</div>
              <div v-else class="markdown-body" v-html="renderMarkdown(message.content)"></div>
            </div>
          </div>
        </template>
        <div v-else class="empty-state">
          <el-empty description="Select or create a new conversation" />
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input">
        <el-input
          v-model="userInput"
          type="textarea"
          :rows="3"
          placeholder="Type your message here..."
          resize="none"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <div class="input-actions">
          <el-button type="primary" @click="sendMessage" :loading="loading" :disabled="!userInput.trim()">
            Send <el-icon><Position /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- Rename Dialog -->
    <el-dialog v-model="renameDialogVisible" title="Rename Conversation" width="30%">
      <el-input v-model="newSessionTitle" placeholder="Enter a new title"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="renameDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="renameSession">Save</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Settings Dialog -->
    <el-dialog v-model="settingsDialogVisible" title="Settings" width="50%">
      <el-form label-position="top">
        <el-form-item label="API URL">
          <el-input v-model="apiUrl" placeholder="Enter API URL"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="settingsDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveSettings">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore, type ChatSession } from '../stores/chat'
import { useAuthStore } from '../stores/auth'
import { ElMessageBox } from 'element-plus'
import { marked } from 'marked'
import hljs from 'highlight.js'

// Initialize marked configuration
marked.setOptions({
  breaks: true
});

// Manual highlight handling
const renderMarkdown = (content: string) => {
  try {
    // Replace code blocks with highlighted code
    const processedContent = content.replace(
      /```(\w+)?\n([\s\S]+?)```/g, 
      (_, lang, code) => {
        const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
        const highlightedCode = hljs.highlight(code.trim(), { language }).value;
        return `<pre><code class="hljs language-${language}">${highlightedCode}</code></pre>`;
      }
    );
    return marked.parse(processedContent);
  } catch (e) {
    console.error('Markdown rendering error:', e);
    return content;
  }
}

// Use stores and router
const router = useRouter()
const chatStore = useChatStore()
const authStore = useAuthStore()

// Computed properties
const chatSessions = computed(() => chatStore.chatSessions)
const currentSessionId = computed(() => chatStore.currentSessionId)
const currentSession = computed(() => chatStore.currentSession)
const loading = computed(() => chatStore.loading)

// Reactive states
const userInput = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const renameDialogVisible = ref(false)
const newSessionTitle = ref('')
const editingSession = ref<ChatSession | null>(null)
const settingsDialogVisible = ref(false)
const apiUrl = ref(chatStore.apiUrl)

// Create new chat
const createNewChat = () => {
  chatStore.createNewSession()
}

// Switch conversation
const switchSession = (sessionId: string) => {
  chatStore.switchSession(sessionId)
}

// Send message
const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return
  
  const message = userInput.value
  userInput.value = ''
  
  await chatStore.sendMessage(message)
  scrollToBottom()
}

// Confirm delete conversation
const confirmDeleteSession = (sessionId: string) => {
  ElMessageBox.confirm('Are you sure you want to delete this conversation?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    chatStore.deleteSession(sessionId)
  }).catch(() => {})
}

// Show rename dialog
const showRenameDialog = (session: ChatSession) => {
  editingSession.value = session
  newSessionTitle.value = session.title
  renameDialogVisible.value = true
}

// Rename conversation
const renameSession = () => {
  if (editingSession.value && newSessionTitle.value.trim()) {
    chatStore.updateSessionTitle(editingSession.value.id, newSessionTitle.value.trim())
    renameDialogVisible.value = false
  }
}

// Open settings
const openSettings = () => {
  apiUrl.value = chatStore.apiUrl
  settingsDialogVisible.value = true
}

// Save settings
const saveSettings = () => {
  chatStore.apiUrl = apiUrl.value
  settingsDialogVisible.value = false
}

// Logout handler
const logout = () => {
  ElMessageBox.confirm('Are you sure you want to log out?', 'Logout', {
    confirmButtonText: 'Logout',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    authStore.logout()
    router.push('/') // Redirect to login
  }).catch(() => {})
}

// Scroll to bottom
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch message changes, auto-scroll to bottom
watch(
  () => currentSession.value?.messages.length,
  () => scrollToBottom(),
  { deep: true }
)

// Scroll to bottom on component mount
onMounted(() => {
  scrollToBottom()
})
</script>

<script lang="ts">
export default defineComponent({
  name: 'ChatWindow'
})
</script>

<style scoped lang="scss">
.chat-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background-color: #f5f7fa;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid #e6e6e6;
  
  .el-button {
    width: 100%;
  }
}

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  margin: 0 5px 5px 5px;
  
  &:hover {
    background-color: #ecf5ff;
  }
  
  &.active {
    background-color: #e6f1fc;
  }
  
  .session-title {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .session-actions {
    display: none;
  }
  
  &:hover .session-actions {
    display: flex;
    align-items: center;
  }
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #fff;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message {
  display: flex;
  margin-bottom: 20px;
  
  .message-avatar {
    margin-right: 12px;
    align-self: flex-start;
  }
  
  .message-content {
    background-color: #f5f7fa;
    padding: 12px;
    border-radius: 8px;
    max-width: 80%;
    word-break: break-word;
  }
  
  &.user {
    flex-direction: row-reverse;
    
    .message-avatar {
      margin-right: 0;
      margin-left: 12px;
    }
    
    .message-content {
      background-color: #ecf5ff;
    }
  }
  
  &.assistant .message-content {
    background-color: #f5f7fa;
  }
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #e6e6e6;
  background-color: #fff;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

// Markdown styles
:deep(.markdown-body) {
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  
  pre {
    background-color: #f6f8fa;
    border-radius: 6px;
    padding: 10px;
    overflow-x: auto;
  }
  
  code {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    padding: 0.2em 0.4em;
    font-size: 0.85em;
  }
  
  pre code {
    background-color: transparent;
    padding: 0;
  }
  
  p {
    margin-bottom: 0.5em;
  }
  
  ul, ol {
    padding-left: 1.5em;
    margin-bottom: 0.5em;
  }
}
</style> 