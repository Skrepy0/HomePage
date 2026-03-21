<template>
  <div class="calendar-container" :class="sizeClass">
    <div class="calendar-header">
      <button class="month-nav" @click="prevMonth">‹</button>
      <span class="current-month">{{ year }}年{{ month + 1 }}月</span>
      <button class="month-nav" @click="nextMonth">›</button>
      <button class="half-toggle" @click="toggleHalf">
        {{ halfType === 'first' ? '上半月' : '下半月' }}
      </button>
    </div>

    <div class="weekdays">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <div class="dates-grid">
      <div
        v-for="date in visibleDays"
        :key="date.key"
        class="date-cell"
        :class="{
          today: date.isToday,
          'other-month': date.otherMonth,
        }"
      >
        {{ date.day }}
      </div>
    </div>

    <Quote />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'small',
  },
  isDark: { type: Boolean, default: false },
})

const sizeClass = `calendar-${props.size}`

// 当前显示的日期（年、月）
const currentDate = ref(new Date())
const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth())

// 星期缩写
const weekdays = ['一', '二', '三', '四', '五', '六', '日']

// 显示上半月还是下半月
const halfType = ref<'first' | 'second'>('first')

// 自动选择包含今天的半个月
function updateHalfTypeByToday() {
  const today = new Date()
  if (year.value === today.getFullYear() && month.value === today.getMonth()) {
    halfType.value = today.getDate() <= 15 ? 'first' : 'second'
  } else {
    // 非当前月份时，默认显示上半月
    halfType.value = 'first'
  }
}

// 切换上半月/下半月
const toggleHalf = () => {
  halfType.value = halfType.value === 'first' ? 'second' : 'first'
}

// 生成当前显示的日期列表（仅半个月）
const visibleDays = computed(() => {
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const startDay = halfType.value === 'first' ? 1 : 16
  const endDay = halfType.value === 'first' ? 15 : daysInMonth

  const today = new Date()
  const dates = []

  for (let d = startDay; d <= endDay; d++) {
    dates.push({
      key: `${year.value}-${month.value}-${d}`,
      day: d,
      isToday:
        year.value === today.getFullYear() &&
        month.value === today.getMonth() &&
        d === today.getDate(),
      otherMonth: false,
    })
  }
  return dates
})

// 切换月份
const prevMonth = () => {
  currentDate.value = new Date(year.value, month.value - 1, 1)
  updateHalfTypeByToday() // 切换后重新确定显示半区
}

const nextMonth = () => {
  currentDate.value = new Date(year.value, month.value + 1, 1)
  updateHalfTypeByToday()
}

// 初始化时根据今日日期设置半区
updateHalfTypeByToday()
</script>

<style scoped lang="scss">
@import '../../../assets/css/main.scss';
@import '../../../assets/css/components/container.scss';
@import '../../../assets/css/components/calendar.scss';

button {
  @extend .cursor-solid;
}

.calendar-container {
  background: v-bind(
    'props.isDark ? "rgba(155, 155, 155, 0.3)" : "rgba(0, 0, 0, 0.3)"'
  );
  @extend .container-base;
  color: white;
  width: fit-content;
  margin-top: 0;
}
.calendar-container:hover {
  box-shadow: 0 20px 30px
    v-bind('props.isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"');
  transform: translateY(-3px);
  transition: 0.5s;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.month-nav {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 1.2rem;

  transition: all 0.2s;
}

.month-nav:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.current-month {
  font-weight: 500;
  font-size: 1rem;
}

.half-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;

  transition: all 0.2s;
}

.half-toggle:hover {
  background: rgba(255, 255, 255, 0.4);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.dates-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 0.5rem;
}

.date-cell {
  flex: 0 0 calc((100% - 6 * 4px) / 7); /* 每行7个，间距4px */
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.date-cell.today {
  background: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.date-cell:hover:not(.other-month) {
  background: rgba(255, 255, 255, 0.15);
}

/* 尺寸变体 */
.calendar-small {
  width: 280px;
}
.calendar-medium {
  width: 360px;
}
@media (max-width: 480px) {
  .calendar-small {
    width: 240px;
  }
  .calendar-medium {
    width: 300px;
  }
  .date-cell {
    font-size: 0.75rem;
  }
  .half-toggle {
    font-size: 0.6rem;
    padding: 0.1rem 0.4rem;
  }
}
</style>
