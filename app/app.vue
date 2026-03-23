<template>
  <div class="dynamic-cursor">
    <index />
  </div>
</template>

<script setup>
import Index from '~/pages/index.vue'
import { config } from '~/config.ts'
useHead({
  title: config['title'],
})
</script>

<style scoped lang="scss">
@import '../assets/css/fonts.scss';
@import '../assets/css/main.scss';
.dynamic-cursor {
  @extend .cursor-normal;
  margin: 0;
  padding: 0;
}

::selection {
  background-color: #728e9c;
  color: #fff;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}
</style>
