<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
html, body {
  margin: 0 !important;
  padding: 0 !important;
  height: 100% !important;
  width: 100% !important;
  overflow: hidden !important;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

body {
  position: fixed !important;
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
  inset: 0 !important;
}

#app {
  position: fixed !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  margin: 0 !important;
  padding: 0 !important;
  left: 0 !important;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
