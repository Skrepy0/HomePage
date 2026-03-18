<template>
  <div>
    <!-- 背景轮播组件，传入图片列表 -->
    <BackgroundCarousel :images="bgImages" :interval="6000" :transition-duration="1200" />

    <!-- 页面主要内容，需要放在背景之上，所以设置相对定位和较高的 z-index -->
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
// 图片列表（可以使用本地图片或在线图片）
import {backgroundImageUrls} from "~/utils/background/backgroundImages.ts";

const bgImages = backgroundImageUrls;
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.content {
  position: relative;
  z-index: 1;
  min-height: 100vh;      /* 至少撑满视口高度，让背景完全可见 */
  color: white;           /* 示例文字颜色，可根据你的设计调整 */
  /* 可添加内边距、背景半透明等样式 */
}
</style>