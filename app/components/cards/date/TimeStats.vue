<template>
  <div class="stats-card stats-medium">
    <div class="stat-item">
      <div class="stat-label">今日已过</div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width: displayWidths.today + '%',
            backgroundColor: todayColor,
          }"
        ></div>
      </div>
      <div class="stat-value">{{ todayProgress }}%</div>
    </div>

    <div class="stat-item">
      <div class="stat-label">本月已过</div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width: displayWidths.month + '%',
            backgroundColor: monthColor,
          }"
        ></div>
      </div>
      <div class="stat-value">{{ thisMonthProgress }}%</div>
    </div>

    <div class="stat-item">
      <div class="stat-label">今年已过</div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width: displayWidths.year + '%',
            backgroundColor: yearColor,
          }"
        ></div>
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
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  reactive,
  nextTick,
} from 'vue'
import { getSpringFestivalDate } from '~/utils/date/springFestival'

const props = defineProps<{
  startDate?: string
  springFestivalDate?: string
  isDark?: boolean
}>()

const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

// 显示宽度（用于入场动画）
const displayWidths = reactive({
  today: 0,
  month: 0,
  year: 0,
})

// 真实进度值
const todayProgress = computed<string>(() => {
  const current = now.value
  if (!current) return '0'
  const startOfDay = new Date(current).setHours(0, 0, 0, 0)
  const endOfDay = new Date(current).setHours(23, 59, 59, 999)
  const totalMs = endOfDay - startOfDay
  const elapsedMs = current.getTime() - startOfDay
  const progress = (elapsedMs / totalMs) * 100
  return progress.toFixed(1)
})

const thisMonthProgress = computed<string>(() => {
  const current = now.value
  if (!current) return '0'
  const year = current.getFullYear()
  const month = current.getMonth()
  const lastDay = new Date(year, month + 1, 0)
  const totalDays = lastDay.getDate()
  const passedDays = current.getDate()
  return ((passedDays / totalDays) * 100).toFixed(1)
})

const yearProgress = computed<string>(() => {
  const current = now.value
  if (!current) return '0'
  const year = current.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999)
  const totalDays =
    (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24) + 1
  const elapsedDays =
    (current.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  const progress = (elapsedDays / totalDays) * 100
  return Math.min(100, progress).toFixed(1)
})

// 颜色定义
const todayColor = '#f39c12'
const monthColor = '#2ecc71'
const yearColor = '#3498db'

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

// 入场动画标志
let animationStarted = false

// 更新显示宽度（触发过渡）
const updateDisplayWidths = () => {
  if (!now.value) return
  displayWidths.today = parseFloat(todayProgress.value)
  displayWidths.month = parseFloat(thisMonthProgress.value)
  displayWidths.year = parseFloat(yearProgress.value)
}

// 监听真实进度值变化，在动画完成后同步显示宽度
watch([todayProgress, thisMonthProgress, yearProgress], () => {
  if (animationStarted) {
    updateDisplayWidths()
  }
})

onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => {
    now.value = new Date()
  }, 10000)

  // 入场动画：先让所有显示宽度为0，下一帧再设置为真实值，触发过渡
  displayWidths.today = 0
  displayWidths.month = 0
  displayWidths.year = 0

  nextTick(() => {
    updateDisplayWidths()
    animationStarted = true
  })
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
@import '../../../../assets/css/components/container';

.stats-card {
  @extend .container-base;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  min-height: 100px; /* 降低最小高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: v-bind(
    'props.isDark ? "rgba(155, 155, 155, 0.3)" : "rgba(0, 0, 0, 0.3)"'
  );
  padding: 0.8rem; /* 内边距减小 */
  color: white;
  gap: 8px; /* 项目间距减小 */
  font-family: Comic, 'Comic Sans MS', sans-serif;
}

.stats-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 30px
    v-bind('props.isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"');
  transition: all 0.5s;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px; /* 内部间距减小 */
  font-size: 0.85rem; /* 字体稍小 */
}

.stat-label {
  flex: 0 0 70px; /* 标签宽度减小 */
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  font-size: 0.75rem;
}

.stat-value {
  flex: 0 0 auto;
  font-weight: 500;
  min-width: 50px; /* 数值宽度减小 */
  text-align: right;
  font-size: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 6px; /* 进度条高度减小 */
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin: 0 4px;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

/* 固定尺寸（小巧版） */
.stats-medium {
  width: 300px; /* 桌面宽度缩小 */
}

@media (max-width: 480px) {
  .stats-medium {
    width: 100%;
    max-width: 240px; /* 移动端最大宽度缩小 */
  }
  .stat-item {
    font-size: 0.75rem;
  }
  .stat-label {
    flex-basis: 60px;
  }
}
</style>
