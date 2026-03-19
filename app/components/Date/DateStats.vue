<template>
  <div class="stats-container" :class="sizeClass">
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

    <!-- 网站运行天数 -->
    <div class="stat-item">
      <div class="stat-label">网站已运行</div>
      <div class="stat-value">{{ siteRunningDays }} 天</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'small', // 'small' 或 'medium'
  },
  startDate: {
    type: String,
    default: '2025-01-01', // 网站启动日期，格式 YYYY-MM-DD
  },
  // 可传入自定义春节日期，格式 YYYY-MM-DD，如果不传则使用内部映射
  springFestivalDate: {
    type: String,
    default: '',
  },
  isDark: {
    type: Boolean,
    default: false,
  }
})

const sizeClass = `stats-${props.size}`

// 当前时间
const now = ref(new Date())

// 每分钟更新一次（可选）
onMounted(() => {
  const timer = setInterval(() => {
    now.value = new Date()
  }, 60000) // 每分钟更新，进度条变化平滑
  // 组件卸载时清除定时器
  return () => clearInterval(timer)
})

const todayProgress = computed(() => {
  const current = now.value
  const startOfDay = new Date(current)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(current)
  endOfDay.setHours(23, 59, 59, 999)
  const totalMs = endOfDay - startOfDay
  const elapsedMs = current - startOfDay
  const progress = (elapsedMs / totalMs) * 100
  return progress.toFixed(1)
})

const thisMonthProgress = computed(() => {
  const current = now.value
  const year = current.getFullYear()
  const month = current.getMonth()
  const lastDay = new Date(year, month + 1, 0)
  const totalDays = lastDay.getDate()
  const passedDays = current.getDate()
  const percentage = (passedDays / totalDays) * 100
  return percentage.toFixed(1)
})

const yearProgress = computed(() => {
  const current = now.value
  const year = current.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999)
  const totalDays = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24) + 1 // 包含最后一天
  const elapsedDays = (current - startOfYear) / (1000 * 60 * 60 * 24)
  const progress = (elapsedDays / totalDays) * 100
  return Math.min(100, progress.toFixed(1))
})

// 获取春节日期（若传入则使用，否则使用内部硬编码）
const getSpringFestivalDate = (year) => {
  if (props.springFestivalDate) {
    return new Date(props.springFestivalDate)
  }
  // 硬编码未来几年的春节（公历日期）
  const map = {
    2024: '2024-02-10',
    2025: '2025-01-29',
    2026: '2026-02-17',
    2027: '2027-02-06',
    2028: '2028-01-26',
    2029: '2029-02-13',
    2030: '2030-02-03',
  }
  if (map[year]) return new Date(map[year])
  // 若年份不在映射中，则默认使用当年2月1日（仅为后备）
  return new Date(year, 1, 1)
}

// 距离下一个春节的天数
const daysToSpringFestival = computed(() => {
  const current = now.value
  const currentYear = current.getFullYear()
  // 获取今年春节日期
  let festival = getSpringFestivalDate(currentYear)
  // 如果今年春节已过，则取明年春节
  if (current > festival) {
    festival = getSpringFestivalDate(currentYear + 1)
  }
  const diffMs = festival - current
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return days >= 0 ? days : 0
})

// 网站运行天数
const siteRunningDays = computed(() => {
  const start = new Date(props.startDate)
  const current = now.value
  const diffMs = current - start
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return days >= 0 ? days : 0
})
</script>

<style scoped>
.stats-container {
  background:  v-bind('props.isDark ? "rgba(155, 155, 155, 0.3)":"rgba(0, 0, 0, 0.3)"');
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

/* 响应式 */
@media (max-width: 480px) {
  .stats-small {
    width: 240px;
  }

  .stats-medium {
    width: 300px;
  }

  .stat-item {
    font-size: 0.85rem;
  }

  .stat-label {
    flex-basis: 70px;
  }
}

.stats-container {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-container:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 30px v-bind('props.isDark ? "rgba(255, 255, 255, 0.5)":"rgba(0, 0, 0, 0.3)"');
}

.stats-container:active {
  transform: scale(0.97);
  transition: transform 0.1s;
}
</style>