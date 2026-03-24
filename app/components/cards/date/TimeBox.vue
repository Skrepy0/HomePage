<template>
  <div
    class="time-box"
    :class="{ flipped }"
    @mouseenter="flipped = true"
    @mouseleave="flipped = false"
  >
    <div class="card-inner">
      <!-- 正面：时间日期 -->
      <div class="card-front">
        <div class="time">{{ time }}</div>
        <div class="date">{{ date }}</div>
      </div>
      <!-- 背面：三体纪年（打字动画） -->
      <div class="card-back">
        <div class="back-content">
          <div class="greeting" :class="{ 'typing-done': isTypingComplete }">
            {{ typedGreeting }}
          </div>
          <div class="message" :class="{ 'typing-done': isTypingComplete }">
            {{ typedMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// 正面时间日期
const time = ref('')
const date = ref('')
let timer = null

const updateDateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  time.value = `${hours}:${minutes}:${seconds}`

  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const weekdays = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ]
  const weekday = weekdays[now.getDay()]
  date.value = `${year}年${month}月${day}日 ${weekday}`
}

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

// 翻转状态
const flipped = ref(false)

// 多纪元计算
const eraInfo = computed(() => {
  const currentYear = new Date().getFullYear()
  // 定义纪元阈值（可自行调整）
  if (currentYear <= 2200) {
    return { name: '危机纪元', year: currentYear - 2007 + 1 }
  } else if (currentYear <= 2300) {
    return { name: '威慑纪元', year: currentYear - 2200 }
  } else if (currentYear <= 2400) {
    return { name: '广播纪元', year: currentYear - 2300 }
  } else if (currentYear <= 2500) {
    return { name: '掩体纪元', year: currentYear - 2400 }
  } else {
    return { name: '银河纪元', year: currentYear - 2500 }
  }
})

// 背面显示的内容（可自定义语录）
const props = defineProps({
  message: {
    type: String,
    default: '给岁月以文明，而不是给文明以岁月',
  },
  isDark: { type: Boolean, default: false },
})

// 目标文本
const targetGreeting = computed(
  () => `${eraInfo.value.name} ${eraInfo.value.year} 年`
)
const targetMessage = computed(() => props.message)

// 打字机显示的文本
const typedGreeting = ref('')
const typedMessage = ref('')
const isTypingComplete = ref(false)

let typingTimer = null

const startTyping = () => {
  if (typingTimer) clearInterval(typingTimer)
  typedGreeting.value = ''
  typedMessage.value = ''
  isTypingComplete.value = false

  const greetingText = targetGreeting.value
  const messageText = targetMessage.value
  let greetingIndex = 0
  let messageIndex = 0
  const greetingLength = greetingText.length
  const messageLength = messageText.length

  typingTimer = setInterval(() => {
    let updated = false
    if (greetingIndex < greetingLength) {
      typedGreeting.value += greetingText[greetingIndex]
      greetingIndex++
      updated = true
    }
    if (messageIndex < messageLength) {
      typedMessage.value += messageText[messageIndex]
      messageIndex++
      updated = true
    }
    if (!updated) {
      clearInterval(typingTimer)
      typingTimer = null
      isTypingComplete.value = true
    }
  }, 120)
}

watch(flipped, (newVal) => {
  if (newVal) {
    startTyping()
  } else {
    if (typingTimer) clearInterval(typingTimer)
    typedGreeting.value = ''
    typedMessage.value = ''
    isTypingComplete.value = false
  }
})

watch([targetGreeting, targetMessage], () => {
  if (flipped.value) {
    startTyping()
  }
})

onUnmounted(() => {
  if (typingTimer) clearInterval(typingTimer)
})
</script>

<style scoped lang="scss">
@import '../../../../assets/css/components/container';

.time-box {
  width: 100%;
  border-radius: 24px;
  perspective: 1000px;
}

/* 正面和背面基础样式 */
.card-front,
.card-back {
  @extend .container-clear;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: v-bind(
    'props.isDark ? "rgba(155, 155, 155, 0.3)":"rgba(0, 0, 0, 0.3)"'
  );
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  color: white;
  padding: 0 0.5rem; /* 桌面端轻微内边距 */
}

.card-inner {
  position: relative;
  width: 100%;
  min-height: 140px;
  height: auto;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  border-radius: 24px;
}

.time-box.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-back {
  transform: rotateY(180deg);
}

.time {
  font-size: 3rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 2px;
  font-family: 'Comic', cursive;
  white-space: nowrap;
  max-width: 100%;
}

.date {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8px;
}

.back-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: center;
  width: 90%;
  padding: 0.5rem 0;
}

.greeting,
.message {
  overflow: hidden;
  white-space: normal;
  word-break: break-word;
  border-right: 2px solid rgba(255, 255, 255, 0.7);
  width: fit-content;
  margin: 0 auto;
  font-family: 'HuaWenKaiTi', 'Comic Sans MS', cursive;
  animation: blink-caret 0.75s step-end infinite;
}

.greeting.typing-done,
.message.typing-done {
  border-right: none;
  animation: none;
}

.greeting {
  font-size: 2rem;
  font-weight: 500;
}

.message {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 100%;
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: rgba(255, 255, 255, 0.7);
  }
}

.time-box:hover .card-front,
.time-box:hover .card-back {
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.3s;
}

/* 平板及以下（≤768px） */
@media (max-width: 768px) {
  .card-inner {
    min-height: 120px;
    // transform-origin: 56%;
  }
  .time {
    font-size: 2.5rem;
  }
  .date {
    font-size: 0.9rem;
  }
  .greeting {
    font-size: 1.6rem;
  }
  .message {
    font-size: 0.9rem;
  }
  /* 调整内边距，与右侧卡片保持一致 */
  .card-front,
  .card-back {
    padding: 0.7rem;
  }
  .card-front,
  .card-back {
    //width: 105%;
    //transform-origin: 51.5%;
  }
}

/* 手机（≤480px） */
@media (max-width: 480px) {
  .card-inner {
    min-height: 110px;
  }
  .time {
    font-size: 1.8rem;
  }
  .date {
    font-size: 0.7rem;
  }
  .greeting {
    font-size: 1.4rem;
  }
  .message {
    font-size: 0.75rem;
  }
  .card-front,
  .card-back {
    //width: 108%;
    padding: 0.6rem;
  }
}

/* 超小屏幕（≤360px） */
@media (max-width: 360px) {
  .time {
    font-size: 1.5rem;
  }
  .date {
    font-size: 0.6rem;
  }
  .card-front,
  .card-back {
    padding: 0.5rem;
  }
}
</style>
