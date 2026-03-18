<template>
  <div>
    <NuxtLayout class="layout"></NuxtLayout>
    <!-- 背景轮播组件，传入图片列表 -->
    <BackgroundCarousel :images="backgroundImages" :interval="6000" :transition-duration="1200" />

    <!-- 页面内容容器，保证在背景之上 -->
    <div class="page-content">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入通过 glob 生成的图片路径数组
import { backgroundImageUrls } from './utils/background/backgroundImages.ts'

// 可直接使用
const backgroundImages = backgroundImageUrls
</script>

<style>
/* 全局重置，确保背景覆盖全屏 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

/* 页面内容样式：相对定位并提高层级 */
.page-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;      /* 至少撑满视口高度 */
  color: white;           /* 示例文字颜色，可根据需要修改 */
  /* 可添加内边距、背景半透明等 */
}
</style>