<template>
  <div class="background-carousel" v-if="images.length">
    <div
        class="bg-slide"
        :style="{
        backgroundImage: `url(${images[currentIndex]})`,
        opacity: isAnimating ? 0 : 1,
      }"
    ></div>
    <div
        class="bg-slide"
        :style="{
        backgroundImage: `url(${images[nextIndex]})`,
        opacity: isAnimating ? 1 : 0,
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  images: { type: Array, required: true },
  interval: { type: Number, default: 5000 },
  transitionDuration: { type: Number, default: 1000 } // 新增：过渡时长（毫秒）
})

// 索引初始值固定为0，确保SSR与客户端一致
const currentIndex = ref(0)
const nextIndex = ref(1)
const isAnimating = ref(false) // 是否正在过渡

let timer = null
let transitionTimer = null

const startCarousel = () => {
  // 仅在客户端执行，且至少有两张图片才启动轮播
  if (process.client && props.images.length > 1) {
    stopCarousel()
    timer = setInterval(() => {
      // 如果正在过渡则跳过本次切换
      if (isAnimating.value) return

      // 计算下一张索引（顺序切换，可按需改为随机）
      nextIndex.value = (currentIndex.value + 1) % props.images.length
      isAnimating.value = true

      // 过渡结束后更新当前索引并关闭动画状态
      transitionTimer = setTimeout(() => {
        currentIndex.value = nextIndex.value
        isAnimating.value = false
      }, props.transitionDuration)
    }, props.interval)
  }
}

const stopCarousel = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (transitionTimer) {
    clearTimeout(transitionTimer)
    transitionTimer = null
  }
}

// 监听图片列表变化（例如动态更新图片）
watch(() => props.images, (newImages) => {
  if (newImages.length) {
    // 重置索引，并重新启动轮播
    currentIndex.value = 0
    nextIndex.value = 1 % newImages.length
    isAnimating.value = false
    stopCarousel()
    startCarousel()
  }
}, { immediate: true })

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.background-carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.bg-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity v-bind(transitionDuration + 'ms') ease;
  will-change: opacity;
  filter: blur(5px); /* 保留您之前设置的模糊效果 */
}
</style>