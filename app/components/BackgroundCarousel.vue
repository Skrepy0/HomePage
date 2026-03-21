<template>
  <div class="background-carousel" v-if="images.length">
    <!-- 预加载进度条（仅当未加载完成时显示） -->
    <div v-if="!imagesLoaded" class="preload-overlay">
      <div class="preload-card">
        <div class="preload-text">加载背景中...</div>
        <div class="progress-bar-container">
          <div
            class="progress-fill"
            :style="{ width: (loadedCount / totalImages) * 100 + '%' }"
          ></div>
        </div>
        <div class="preload-stats">{{ loadedCount }} / {{ totalImages }}</div>
      </div>
    </div>

    <!-- 轮播背景层（预加载完成后才显示，避免闪烁） -->
    <template v-if="imagesLoaded">
      <div
        class="bg-slide"
        :style="{
          backgroundImage: `url(${images[currentIndex]})`,
          opacity: isAnimating ? 0 : 1,
          transition: `opacity ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }"
      ></div>
      <div
        class="bg-slide"
        :style="{
          backgroundImage: `url(${images[nextIndex]})`,
          opacity: isAnimating ? 1 : 0,
          transition: `opacity ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }"
      ></div>
    </template>
    <div class="overlay"></div>
  </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  images: { type: Array, required: true },
  interval: { type: Number, default: 15000 },
  transitionDuration: { type: Number, default: 2000 },
  isDark: { type: Boolean, default: false },
})

const imagesLoaded = ref(false) // 是否已完成预加载
const loadedCount = ref(0) // 已加载图片数量
const totalImages = computed(() => props.images.length)

// 预加载所有图片
const preloadImages = () => {
  return new Promise((resolve) => {
    if (!props.images.length) {
      resolve()
      return
    }
    let count = 0
    const total = props.images.length
    props.images.forEach((src) => {
      const img = new Image()
      img.onload = img.onerror = () => {
        count++
        loadedCount.value = count
        if (count === total) {
          imagesLoaded.value = true
          resolve()
        }
      }
      img.src = src
    })
  })
}

// 轮播相关逻辑（与之前相同，略）
const currentIndex = ref(0)
const nextIndex = ref(1)
const isAnimating = ref(false)
let timer = null
let transitionTimer = null

const getRandomDifferentIndex = (current, total) => {
  if (total <= 1) return 0
  let next
  do {
    next = Math.floor(Math.random() * total)
  } while (next === current)
  return next
}

const startCarousel = () => {
  if (process.client && props.images.length > 1) {
    stopCarousel()
    timer = setInterval(() => {
      if (isAnimating.value) return
      nextIndex.value = getRandomDifferentIndex(
        currentIndex.value,
        props.images.length
      )
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

const manuallyGoToNext = () => {
  if (!process.client || props.images.length <= 1 || isAnimating.value) return
  stopCarousel()
  nextIndex.value = getRandomDifferentIndex(
    currentIndex.value,
    props.images.length
  )
  isAnimating.value = true
  transitionTimer = setTimeout(() => {
    currentIndex.value = nextIndex.value
    isAnimating.value = false
    startCarousel()
  }, props.transitionDuration)
}

defineExpose({ next: manuallyGoToNext })

watch(
  () => props.images,
  (newImages) => {
    if (newImages.length) {
      if (process.client) {
        currentIndex.value = Math.floor(Math.random() * newImages.length)
        nextIndex.value = getRandomDifferentIndex(
          currentIndex.value,
          newImages.length
        )
      } else {
        currentIndex.value = 0
        nextIndex.value = 1 % newImages.length
      }
      isAnimating.value = false
      stopCarousel()
      startCarousel()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (props.images.length) {
    const randomIndex = Math.floor(Math.random() * props.images.length)
    if (randomIndex !== currentIndex.value) {
      currentIndex.value = randomIndex
      nextIndex.value = getRandomDifferentIndex(
        currentIndex.value,
        props.images.length
      )
    }
    await preloadImages() // 等待预加载完成
    startCarousel() // 预加载完成后启动轮播
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

/* 预加载遮罩层 */
.preload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(231, 180, 191, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preload-card {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 1.5rem 2rem;
  text-align: center;
  color: white;
  border: 1px solid rgba(231, 180, 191, 0.2);
  min-width: 200px;
}

.preload-text {
  font-size: 1rem;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}

.progress-bar-container {
  width: 100%;
  height: 6px;
  background: rgba(231, 180, 191, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.preload-stats {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 0.5rem;
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
  transition: opacity v-bind(transitionDuration + 'ms')
    cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity;
  filter: blur(2px);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: v-bind(
    'props.isDark ? "rgba(0,0,0,0.46)" : "rgba(200,200,200,0.15)"'
  );
  z-index: 2;
  pointer-events: none;
  transition: background-color 0.3s ease;
}
</style>
