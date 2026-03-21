<template>
  <div class="words-container">
    <div class="words-wrapper">
      <div class="words">
        「{{ currentQuote.text }}」
      </div>
      <div class="quote-author">
        ——《{{ currentQuote.author }}》
      </div>
    </div>
    <button class="refresh-quote-btn" @click="refreshQuote">
      <svg class="refresh-icon" viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
        <path d="M896 198.4 896 198.4l0 179.2 0 0c0 19.2-6.4 32-19.2 44.8-12.8 12.8-32 19.2-44.8 19.2l0 0-179.2 0 0 0c-19.2 0-32-6.4-44.8-19.2-25.6-25.6-25.6-64 0-89.6C620.8 320 633.6 313.6 652.8 313.6l0 0 25.6 0C627.2 275.2 576 256 518.4 256 441.6 256 377.6 281.6 332.8 332.8l0 0c-25.6 25.6-64 25.6-89.6 0-25.6-25.6-25.6-64 0-89.6l0 0C313.6 172.8 409.6 128 518.4 128c96 0 185.6 38.4 249.6 96L768 198.4l0 0c0-19.2 6.4-32 19.2-44.8 25.6-25.6 64-25.6 89.6 0C889.6 160 896 179.2 896 198.4zM416 691.2c-12.8 12.8-32 19.2-44.8 19.2l0 0L352 710.4C396.8 748.8 448 768 505.6 768c70.4 0 134.4-25.6 179.2-76.8l0 0c25.6-25.6 64-25.6 89.6 0 25.6 25.6 25.6 64 0 89.6l0 0C710.4 851.2 614.4 896 505.6 896c-96 0-185.6-38.4-249.6-96l0 32 0 0c0 19.2-6.4 32-19.2 44.8-25.6 25.6-64 25.6-89.6 0C134.4 864 128 844.8 128 825.6l0 0 0-179.2 0 0c0-19.2 6.4-32 19.2-44.8C160 588.8 172.8 582.4 192 582.4l0 0 179.2 0 0 0c19.2 0 32 6.4 44.8 19.2C441.6 627.2 441.6 665.6 416 691.2z" fill="currentColor"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Quote } from '~/utils/init/initQuote.ts'
const quotes = Quote

const currentQuote = ref(quotes[0])
let timer = null

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  currentQuote.value = quotes[randomIndex]
}

const refreshQuote = () => {
  getRandomQuote()
}
refreshQuote()
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
@import "../../assets/css/components/container.scss";
@import "../../assets/css/main.scss";
.words-container {
  @extend .container-base;
  background: rgba(0, 0, 0, 0.3);
  max-width: 380px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.words-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.words-wrapper {
  flex: 1;
  text-align: center;
}

.words {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #f5f5f5;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-family: 'HuaWenKaiTi','Comic', 'Noto Serif SC', 'Times New Roman', '宋体', serif;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.quote-author {
  font-size: 0.75rem;
  color: #c0c0c0;
  letter-spacing: 0.5px;
  font-family: 'Comic','Noto Sans SC', 'Microsoft YaHei', sans-serif;
  font-weight: 400;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.refresh-quote-btn {
  @extend .cursor-solid;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e0e0e0;
  transition: all 0.25s ease;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.refresh-quote-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: rotate(90deg);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.refresh-quote-btn:active {
  transform: rotate(180deg) scale(0.95);
}

.refresh-icon {
  width: 18px;
  height: 18px;
}

/* 响应式 */
@media (max-width: 480px) {
  .words-container {
    padding: 0.8rem 1rem;
    max-width: 280px;
  }
  .words {
    font-size: 0.85rem;
    line-height: 1.5;
  }
  .quote-author {
    font-size: 0.7rem;
  }
  .refresh-quote-btn {
    @extend .cursor-solid;
    width: 28px;
    height: 28px;
  }
  .refresh-icon {
    width: 16px;
    height: 16px;
  }
}
</style>