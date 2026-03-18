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
  height: 100vh;
  overflow: hidden;
  color: white;
}
</style>