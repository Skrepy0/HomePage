<template>
  <div class="calendar-container" :class="sizeClass">
    <div class="calendar-header">
      <button class="month-nav" @click="prevMonth">‹</button>
      <span class="current-month">{{ year }}年{{ month + 1 }}月</span>
      <button class="month-nav" @click="nextMonth">›</button>
    </div>

    <div class="weekdays">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <div class="dates-grid">
      <div
          v-for="(date, index) in dates"
          :key="index"
          class="date-cell"
          :class="{
            'other-month': date.otherMonth,
            'today': date.isToday
          }"
      >
        {{ date.day }}
      </div>
    </div>
  </div>
</template>

<script setup lang = "ts">
import { ref, computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'small', // 'small' 或 'medium'
  },
  isDark:{type:Boolean,default:false}
})

const sizeClass = `calendar-${props.size}`

// 当前显示的日期（年、月）
const currentDate = ref(new Date())
const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth()) // 0-11

// 星期缩写
const weekdays = ['一', '二', '三', '四', '五', '六', '日']

// 生成日期网格数据
const dates = computed(() => {
  const firstDayOfMonth = new Date(year.value, month.value, 1)
  const startDayOfWeek = firstDayOfMonth.getDay() // 0 周日, 1 周一 ...
  // 将星期转换为以周一为一周第一天：周日为6，周一为0，以此类推
  const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const prevMonthDays = new Date(year.value, month.value, 0).getDate() // 上月总天数

  const datesArray = []
  // 上月剩余日期
  for (let i = 0; i < startOffset; i++) {
    datesArray.unshift({
      day: prevMonthDays - i,
      otherMonth: true,
      isToday: false
    })
  }
  // 本月日期
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    datesArray.push({
      day: i,
      otherMonth: false,
      isToday: year.value === today.getFullYear() &&
          month.value === today.getMonth() &&
          i === today.getDate()
    })
  }
  // 下月补全（使网格固定为42格，6行）
  const totalCells = 42
  const remaining = totalCells - datesArray.length
  for (let i = 1; i <= remaining; i++) {
    datesArray.push({
      day: i,
      otherMonth: true,
      isToday: false
    })
  }
  return datesArray
})

// 切换到上个月
const prevMonth = () => {
  currentDate.value = new Date(year.value, month.value - 1, 1)
}

// 切换到下个月
const nextMonth = () => {
  currentDate.value = new Date(year.value, month.value + 1, 1)
}
</script>

<style scoped>
.calendar-container {
  background: v-bind('props.isDark ? "rgba(155, 155, 155, 0.3)" : "rgba(0, 0, 0, 0.3)"');
  transition: background 1s ease;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 1rem;
  color: white;
  width: fit-content;
  margin-top: 20px; /* 与上方组件的间距 */
}

/* 尺寸变体 */
.calendar-small {
  width: 280px;
}
.calendar-medium {
  width: 360px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.month-nav {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.month-nav:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.current-month {
  font-weight: 500;
  font-size: 1.1rem;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.dates-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.date-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  border-radius: 50%;
  transition: background 0.2s;
  cursor: default;
}

.date-cell.other-month {
  color: v-bind('props.isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.4)"');
}

.date-cell.today {
  background: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.date-cell:hover:not(.other-month) {
  background: rgba(255, 255, 255, 0.15);
}

/* 响应式 */
@media (max-width: 480px) {
  .calendar-small {
    width: 240px;
  }
  .calendar-medium {
    width: 300px;
  }
  .date-cell {
    font-size: 0.8rem;
  }
}
.calendar-container {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.calendar-container:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 30px v-bind('props.isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"');
}
.calendar-container:active {
  transform: scale(0.97);
  transition: transform 0.1s;
}
</style>