<template>
  <div class="dynamic-cursor">
    <index/>
  </div>
</template>

<script setup>
import Index from "~/pages/index.vue";
useHead({
  title: 'Skrepyの主页~'
})
</script>

<style scoped>
@import "../assets/css/fonts.css";
.dynamic-cursor {
  cursor: url("../public/image/cursor.cur"), auto;
}
</style>