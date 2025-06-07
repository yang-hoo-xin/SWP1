import './assets/main.css'
import 'element-plus/dist/index.css'
import 'highlight.js/styles/github.css'
import 'nprogress/nprogress.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import en from 'element-plus/dist/locale/en.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// Particles.js already loaded in individual components where needed

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: en
})

// Register all icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 添加全局认证错误处理
window.addEventListener('auth-error', (event) => {
  const customEvent = event as CustomEvent;
  console.log('Auth error detected:', customEvent.detail);
  router.push('/login');
});

app.mount('#app')
