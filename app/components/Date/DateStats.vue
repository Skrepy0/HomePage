<template>
  <div class="stats-container" @mouseenter="flipped = true" @mouseleave="flipped = false">
    <div class="card-inner" :class="{ flipped }">
      <!-- 正面：统计信息 -->
      <div class="card-front">
        <div class="stat-item">
          <div class="stat-label">今日已过</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: todayProgress + '%' }"></div>
          </div>
          <div class="stat-value">{{ todayProgress }}%</div>
        </div>

        <div class="stat-item">
          <div class="stat-label">本月已过</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: thisMonthProgress + '%' }"></div>
          </div>
          <div class="stat-value">{{ thisMonthProgress }}%</div>
        </div>

        <div class="stat-item">
          <div class="stat-label">今年已过</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: yearProgress + '%' }"></div>
          </div>
          <div class="stat-value">{{ yearProgress }}%</div>
        </div>

        <div class="stat-item">
          <div class="stat-label">距离春节</div>
          <div class="stat-value">{{ daysToSpringFestival }} 天</div>
        </div>

        <div class="stat-item">
          <div class="stat-label">主页已运行</div>
          <div class="stat-value">{{ siteRunningDays }} 天</div>
        </div>
      </div>

      <!-- 背面：贪吃蛇动画 -->
      <div class="card-back">
        <!-- 上半部分：统计区域（居中） -->
        <div class="stats-github">
          <div class="stat-item">
            <!-- 图标适当缩小，避免过大 -->
            <svg class="github-icon" viewBox="0 0 1024 1024" width="28" height="28">
              <!-- 这里可以放入您优化后的图标路径，建议移除非标准的 p-id 属性 -->
              <path d="M512 384a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM302.912 469.312a213.376 213.376 0 0 1 418.176 0h260.224v85.376h-260.224a213.44 213.44 0 0 1-418.176 0H42.688V469.312h260.224z" fill="currentColor"/>
            </svg>
            <span class="stat-label"><a class="repository-path" href = "https://github.com/Skrepy0/HomePage" target="_blank">Skrepy's Home Page</a></span>
            <span class="stat-value">{{ commitCount }}</span>
            <span class="stat-label">次提交</span>
          </div>
        </div>
        <!-- 下半部分：蛇形图区域 -->
        <div class="snake-container">
          <!-- 加载中状态 -->
          <div v-if="snakeLoading" class="loading-placeholder">
            <span>正在加载...</span>
          </div>

          <!-- 加载成功显示图片 -->
          <img
              v-else-if="snakeLoaded"
              v-bind:src='props.isDark?snakeUrlDark:snakeUrl'
              alt="GitHub Contribution Snake"
              class="snake-image"
              loading="lazy"
              @load="handleLoad"
              @error="handleError"
          />

          <!-- 加载失败显示提示 -->
          <div v-else class="error-placeholder">
            <span>图片加载失败</span>
          </div>
        </div>
        <div class="snake-caption">GitHub Commit</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getSpringFestivalDate } from '~/utils/springFestival'
import {useGitHubCommits} from "~/utils/composables/useGitHubCommits";
const props = defineProps<{
  size?: 'small' | 'medium'
  startDate?: string
  springFestivalDate?: string
  isDark?: boolean
}>()
const { commitCount, loading, error, fetchCommitCount } = useGitHubCommits('Skrepy0', 'HomePage')
let snakeUrlDark="https://raw.githubusercontent.com/Skrepy0/HomePage/output/github-contribution-grid-snake-dark.svg"
let snakeUrl = "https://raw.githubusercontent.com/Skrepy0/HomePage/output/github-contribution-grid-snake.svg"
let snakeLoading = ref(true)
let snakeLoaded = ref(false)
const handleLoad = () => {
  snakeLoading.value = false
  snakeLoaded.value = true
}
const handleError = () => {
  snakeLoading.value = false
  snakeLoaded.value = false
}

const flipped = ref(false)
const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  fetchCommitCount()
  now.value = new Date()
  timer = setInterval(() => {
    now.value = new Date()
  }, 10000) // 10秒更新一次，可调整
})
onMounted(() => {
  fetchCommitCount()
  now.value = new Date()
  timer = setInterval(() => {
    now.value = new Date()
  }, 10000)

  // 手动检测图片加载状态，防止错过事件
  const img = new Image()
  img.src = snakeUrl
  if (img.complete) {
    // 图片已加载完成（缓存）
    handleLoad()
  } else {
    img.onload = handleLoad
    img.onerror = handleError
  }
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const todayProgress = computed<string>(() => {
  const current = now.value
  if (!current) return '--'
  const startOfDay = new Date(current).setHours(0, 0, 0, 0)
  const endOfDay = new Date(current).setHours(23, 59, 59, 999)
  const totalMs = endOfDay - startOfDay
  const elapsedMs = current.getTime() - startOfDay
  const progress = (elapsedMs / totalMs) * 100
  return progress.toFixed(1)
})

const thisMonthProgress = computed<string>(() => {
  const current = now.value
  if (!current) return '--'
  const year = current.getFullYear()
  const month = current.getMonth()
  const lastDay = new Date(year, month + 1, 0)
  const totalDays = lastDay.getDate()
  const passedDays = current.getDate()
  return ((passedDays / totalDays) * 100).toFixed(1)
})

const yearProgress = computed<string>(() => {
  const current = now.value
  if (!current) return '--'
  const year = current.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999)
  const totalDays = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24) + 1
  const elapsedDays = (current.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  const progress = (elapsedDays / totalDays) * 100
  return Math.min(100, progress).toFixed(1)
})

const daysToSpringFestival = computed<number>(() => {
  const current = now.value
  if (!current) return 0
  const currentYear = current.getFullYear()
  let festival = getSpringFestivalDate(currentYear)
  if (current > festival) {
    festival = getSpringFestivalDate(currentYear + 1)
  }
  const diffMs = festival.getTime() - current.getTime()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return days >= 0 ? days : 0
})

const siteRunningDays = computed<number>(() => {
  const current = now.value
  if (!current) return 0
  const start = new Date(props.startDate || '2025-01-01')
  const diffMs = current.getTime() - start.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return days >= 0 ? days : 0
})
</script>

<style scoped>
@import "../../../assets/css/components/date-stats/github.css";
.stats-container {
  perspective: 1000px;          /* 透视效果，让翻转有立体感 */
  cursor: pointer;
  width: fit-content;
  margin-top: 20px;
  /* 移除之前与翻转冲突的过渡和背景样式，这些由内部元素处理 */
}

.card-inner {
  position: relative;
  width: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  border-radius: 24px;
}

.card-inner.flipped {
  transform: rotateX(180deg);   /* 上下翻转 */
}

.card-front,
.card-back {
  width: 100%;
  backface-visibility: hidden;  /* 隐藏背面，防止正面看到反面 */
  border-radius: 24px;
  padding: 1.2rem;
  box-sizing: border-box;
  background: v-bind('props.isDark ? "rgba(155, 155, 155, 0.3)" : "rgba(0, 0, 0, 0.3)"');
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-back {
  position: absolute;           /* 与正面重叠，通过旋转决定显示哪一面 */
  top: 0;
  left: 0;
  transform: rotateX(180deg);   /* 背面默认旋转180度，使其朝后 */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;            /* 确保背面有足够高度 */
}

/* 正面不需要额外定位，默认 relative 即可 */

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.stat-label {
  flex: 0 0 80px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

.stat-value {
  flex: 0 0 auto;
  font-weight: 500;
  min-width: 60px;
  text-align: right;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 4px;
}

.progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>