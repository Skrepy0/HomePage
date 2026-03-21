<template>
  <div class="dynamic-cursor">
    <index />
  </div>
</template>

<script setup>
import Index from '~/pages/index.vue'
useHead({
  title: 'Skrepyの主页~',
})
</script>

<style scoped lang="scss">
@import '../assets/css/fonts';
@import '../assets/css/main.scss';
.dynamic-cursor {
  @extend .cursor-normal;
}
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
