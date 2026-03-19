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
    <div class="overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  images: { type: Array, required: true },
  interval: { type: Number, default: 15000 },
  transitionDuration: { type: Number, default: 2000 },
  isDark: { type: Boolean, default: false }
})

// 索引初始值在服务端设为0，客户端挂载后再随机化（避免SSR闪烁）
const currentIndex = ref(0)
const nextIndex = ref(1)
const isAnimating = ref(false)

let timer = null
let transitionTimer = null

// 生成与当前索引不同的随机索引
const getRandomDifferentIndex = (current, total) => {
  if (total <= 1) return 0
  let next
  do {
    next = Math.floor(Math.random() * total)
  } while (next === current)
  return next
}

// 启动自动轮播（仅在客户端执行）
const startCarousel = () => {
  if (process.client && props.images.length > 1) {
    stopCarousel()
    timer = setInterval(() => {
      if (isAnimating.value) return
      nextIndex.value = getRandomDifferentIndex(currentIndex.value, props.images.length)
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

// 手动切换到下一张（对外暴露）
const manuallyGoToNext = () => {
  if (!process.client || props.images.length <= 1 || isAnimating.value) return
  stopCarousel() // 清除所有定时器，手动切换后重新计时
  nextIndex.value = getRandomDifferentIndex(currentIndex.value, props.images.length)
  isAnimating.value = true
  transitionTimer = setTimeout(() => {
    currentIndex.value = nextIndex.value
    isAnimating.value = false
    startCarousel() // 重新启动自动轮播
  }, props.transitionDuration)
}

// 暴露方法给父组件
defineExpose({
  next: manuallyGoToNext
})

// 监听图片列表变化
watch(() => props.images, (newImages) => {
  if (newImages.length) {
    if (process.client) {
      currentIndex.value = Math.floor(Math.random() * newImages.length)
      nextIndex.value = getRandomDifferentIndex(currentIndex.value, newImages.length)
    } else {
      currentIndex.value = 0
      nextIndex.value = 1 % newImages.length
    }
    isAnimating.value = false
    stopCarousel()
    startCarousel()
  }
}, { immediate: true })

onMounted(() => {
  if (props.images.length) {
    const randomIndex = Math.floor(Math.random() * props.images.length)
    if (randomIndex !== currentIndex.value) {
      currentIndex.value = randomIndex
      nextIndex.value = getRandomDifferentIndex(currentIndex.value, props.images.length)
    }
    startCarousel()
  }
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
  /* 使用更自然的缓动曲线 */
  transition: opacity v-bind(transitionDuration + 'ms') cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity;
  filter: blur(2px);
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: v-bind('props.isDark ? "rgba(0,0,0,0.46)" : "rgba(200,200,200,0.15)"');
  z-index: 2;
  pointer-events: none;
  transition: background-color 0.3s ease;
}
</style>