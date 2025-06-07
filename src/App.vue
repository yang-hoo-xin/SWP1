<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

body {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
