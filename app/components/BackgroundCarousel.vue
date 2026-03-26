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
        <div class="preload-stats">
          {{ Math.floor((loadedCount * 100) / totalImages) }}%
        </div>
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

const imagesLoaded = ref(false)
const loadedCount = ref(0)
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

// 轮播相关变量
const currentIndex = ref(0)
const nextIndex = ref(1)
const isAnimating = ref(false)
let timer = null
let transitionTimer = null

// 假随机顺序列表
let shuffledOrder = [] // 存储打乱后的索引顺序
let orderPointer = 0 // 当前取到的位置（下一个要取的索引）

// Fisher-Yates 洗牌
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 重新生成顺序列表（全部索引的随机排列）
const regenerateOrder = () => {
  const order = Array.from({ length: totalImages.value }, (_, i) => i)
  shuffledOrder = shuffleArray(order)
  orderPointer = 0
}

// 初始化顺序列表，并根据当前索引设置指针位置（保证下一个取的不会重复）
const initOrderAndSetPointer = () => {
  regenerateOrder()
  // 找到当前索引在顺序列表中的位置
  const pos = shuffledOrder.indexOf(currentIndex.value)
  if (pos !== -1) {
    // 指针指向下一个位置（如果当前是最后一个，则取第一个，即重新洗牌？但我们希望取完后重新洗牌，所以指针指向下一个，当超出长度时 regenerateOrder）
    orderPointer = (pos + 1) % shuffledOrder.length
  } else {
    // 理论不会发生，但万一发生则重置指针
    orderPointer = 0
  }
}

// 获取下一张图片的索引（按顺序列表，若已到末尾则重新洗牌）
const getNextOrderedIndex = () => {
  if (!shuffledOrder.length || orderPointer >= shuffledOrder.length) {
    regenerateOrder()
  }
  const next = shuffledOrder[orderPointer]
  orderPointer++
  return next
}

// 启动自动轮播（使用顺序列表）
const startCarousel = () => {
  if (process.client && props.images.length > 1) {
    stopCarousel()
    timer = setInterval(() => {
      if (isAnimating.value) return
      // 获取下一张（顺序列表，保证一轮内不重复且与当前不重复）
      nextIndex.value = getNextOrderedIndex()
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
  stopCarousel()
  nextIndex.value = getNextOrderedIndex()
  isAnimating.value = true
  transitionTimer = setTimeout(() => {
    currentIndex.value = nextIndex.value
    isAnimating.value = false
    startCarousel()
  }, props.transitionDuration)
}

defineExpose({ next: manuallyGoToNext })

// 监听图片列表变化
watch(
  () => props.images,
  (newImages) => {
    if (newImages.length) {
      if (process.client) {
        // 随机选择初始索引
        currentIndex.value = Math.floor(Math.random() * newImages.length)
        // 初始化顺序列表并设置指针
        initOrderAndSetPointer()
        // 下一张从顺序列表中取第一个（避免与当前相同）
        nextIndex.value = getNextOrderedIndex()
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
    }
    // 初始化顺序列表并设置指针（必须在 currentIndex 确定后）
    initOrderAndSetPointer()
    // 下一张从顺序列表中取（不一定是原 nextIndex，重新设置）
    nextIndex.value = getNextOrderedIndex()
    await preloadImages()
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
  margin: 0;
  padding: 0;
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
  backdrop-filter: blur(3px);
}
</style>
