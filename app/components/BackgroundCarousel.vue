<template>
  <div class="background-carousel" v-if="images.length">
    <!-- 当前背景层 -->
    <div
        class="bg-slide"
        :style="{
        backgroundImage: `url(${images[currentIndex]})`,
        opacity: isAnimating ? 0 : 1,
      }"
    ></div>
    <!-- 下一张背景层（过渡时显示） -->
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
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  interval: {
    type: Number,
    default: 5000
  },
  transitionDuration: {
    type: Number,
    default: 1000
  }
})

const currentIndex = ref(0)
const nextIndex = ref(1)
const isAnimating = ref(false)

let timer = null
let transitionTimer = null

// 启动轮播（仅在客户端执行）
const startCarousel = () => {
  // 确保只在客户端执行
  if (process.client) {
    stopCarousel() // 清除之前的定时器
    timer = setInterval(() => {
      if (isAnimating.value) return

      nextIndex.value = (currentIndex.value + 1) % props.images.length
      isAnimating.value = true

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

// 监听图片列表变化，仅当列表非空且不在服务器时重启轮播
watch(() => props.images, (newImages) => {
  if (newImages.length && process.client) {
    currentIndex.value = 0
    nextIndex.value = 1 % newImages.length
    stopCarousel()
    startCarousel()
  }
}, { immediate: true })

// 组件挂载后启动轮播（确保客户端）
onMounted(() => {
  if (props.images.length > 1) {
    startCarousel()
  }
})

// 组件卸载前清理定时器
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
}
</style>