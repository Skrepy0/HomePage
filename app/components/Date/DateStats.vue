<template>
  <div class="stats-container">
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

    <!-- 距离春节 -->
    <div class="stat-item">
      <div class="stat-label">距离春节</div>
      <div class="stat-value">{{ daysToSpringFestival }} 天</div>
    </div>

    <!-- 运行天数 -->
    <div class="stat-item">
      <div class="stat-label">主页已运行</div>
      <div class="stat-value">{{ siteRunningDays }} 天</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  size?: 'small' | 'medium'
  startDate?: string
  springFestivalDate?: string
  isDark?: boolean
}>()

// 当前时间（客户端），服务端为 null
const now = ref<Date | null>(null)

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  now.value = new Date() // 仅在客户端初始化
  timer = setInterval(() => {
    now.value = new Date()
  }, 10000) // 每分钟更新
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 今日进度（如果未挂载则显示 '--'）
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

// 本月进度（类似）
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

// 今年进度
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

// 网站运行天数
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
.stats-container {
  background: v-bind('props.isDark ? "rgba(155, 155, 155, 0.3)" : "rgba(0, 0, 0, 0.3)"');
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 1.2rem;
  color: white;
  width: fit-content;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  transition: background 0.5s ease;
  gap: 12px;
}

/* 尺寸变体 */
.stats-small {
  width: 280px;
}

.stats-medium {
  width: 360px;
}

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

/* 中等尺寸微调 */
.stats-medium .stat-label {
  flex-basis: 100px;
}

.stats-medium .stat-value {
  min-width: 70px;
}

/* 响应式调整 - 优化移动端显示 */
@media (max-width: 480px) {
  /* 所有卡片通用：限制最大宽度，左右留边距 */
  .profile-card {
    max-width: calc(100vw - 30px);
    margin-left: auto;
    margin-right: auto;
  }

  /* 小尺寸（默认） */
  .size-small {
    padding: 0.4rem 0.8rem 0.4rem 0.6rem;
    gap: 0.5rem;
  }
  .size-small .avatar {
    width: 48px;   /* 原60px，调小 */
    height: 48px;
  }
  .size-small .username {
    font-size: 1.2rem; /* 原1.8rem，调小 */
  }
  .size-small .icon {
    width: 26px;
    height: 26px;
  }

  /* 中等尺寸移动端适配 */
  .size-medium {
    padding: 0.5rem 1rem 0.5rem 0.75rem;
    gap: 0.75rem;
  }
  .size-medium .avatar {
    width: 56px;
    height: 56px;
  }
  .size-medium .username {
    font-size: 1.4rem;
  }
  .size-medium .icon {
    width: 30px;
    height: 30px;
  }

  /* 社交链接间距 */
  .social-links {
    gap: 0.4rem;
    padding-right: 0.25rem;
  }

  /* tooltip 移动端优化：避免超出屏幕，自动换行 */
  .profile-info::after,
  .social-link::after {
    font-size: 11px;
    padding: 3px 6px;
    white-space: normal;      /* 允许换行 */
    max-width: 150px;
    text-align: center;
    bottom: 130%;             /* 适当调整位置 */
  }
  .profile-info::before,
  .social-link::before {
    bottom: 120%;
    border-width: 4px;
  }
}

.stats-container {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-container:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 30px v-bind('props.isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)"');
}

.stats-container:active {
  transform: scale(0.97);
  transition: transform 0.1s;
}
</style>