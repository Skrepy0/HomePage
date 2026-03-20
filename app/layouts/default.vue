<template>
  <div>
    <BackgroundCarousel :images="bgImages" :interval="6000" :transition-duration="1200" />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import {backgroundImageUrls} from "~/utils/background/backgroundImages.ts";
const bgImages = backgroundImageUrls;
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 1;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 12vh;
  box-sizing: border-box;
}

/* 移动端调整 */
@media (max-width: 768px) {
  .content {
    padding-top: 80px;        /* 增大顶部间距，避开状态栏/浏览器栏 */
    /* 或使用安全区域：padding-top: constant(safe-area-inset-top); 适用于现代iOS */
  }
}
@supports (padding-top: env(safe-area-inset-top)) {
  .content {
    padding-top: calc(15vh + env(safe-area-inset-top));
  }
}
</style>