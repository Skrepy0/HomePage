<template>
  <div
    class="stats-container"
    @mouseenter="flipped = true"
    @mouseleave="flipped = false"
  >
    <div class="card-inner" :class="{ flipped }">
      <!-- 正面：统计信息 -->
      <div class="card-front">
        <div class="stat-item">
          <div class="stat-label">今日已过</div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: todayProgress + '%' }"
            ></div>
          </div>
          <div class="stat-value">{{ todayProgress }}%</div>
        </div>

        <div class="stat-item">
          <div class="stat-label">本月已过</div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: thisMonthProgress + '%' }"
            ></div>
          </div>
          <div class="stat-value">{{ thisMonthProgress }}%</div>
        </div>

        <div class="stat-item">
          <div class="stat-label">今年已过</div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: yearProgress + '%' }"
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

      <!-- 背面：语言统计 + 贪吃蛇动画 -->
      <div class="card-back">
        <!-- 上半部分：GitHub 统计区域 - 保持在一行 -->
        <div class="stats-github">
          <div class="stat-item github-stats-item">
            <svg
              class="github-icon"
              viewBox="0 0 1024 1024"
              width="28"
              height="28"
            >
              <path
                d="M512 384a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM302.912 469.312a213.376 213.376 0 0 1 418.176 0h260.224v85.376h-260.224a213.44 213.44 0 0 1-418.176 0H42.688V469.312h260.224z"
                fill="currentColor"
              />
            </svg>
            <a
              class="repository-path"
              href="https://github.com/Skrepy0/HomePage"
              target="_blank"
              >Skrepy's Home Page</a
            >
            <div class="commit-status">
              <div v-if="commitLoading" class="commit-loading">加载中...</div>
              <div
                v-else-if="commitError"
                class="commit-error"
                @click="retryCommits"
              >
                加载失败，点击重试
              </div>
              <div v-else class="commit-success">
                <span class="stat-value">{{ commitCount }}</span>
                <span class="stat-label">次提交</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间部分：语言使用进度条（带颜色） -->
        <div class="languages-section" v-if="languages.length">
          <div class="section-title">常用语言</div>
          <div class="language-list">
            <div
              v-for="lang in languages"
              :key="lang.name"
              class="language-item"
            >
              <span
                class="lang-name"
                :style="{ color: getLanguageColor(lang.name) }"
                >{{ lang.name }}</span
              >
              <div class="lang-progress-bar">
                <div
                  class="lang-progress-fill"
                  :style="{
                    width: lang.percent + '%',
                    backgroundColor: getLanguageColor(lang.name),
                  }"
                ></div>
              </div>
              <span class="lang-percent">{{ lang.percent?.toFixed(1) }}%</span>
            </div>
          </div>
        </div>
        <div v-else-if="langLoading" class="languages-loading">
          加载统计中...
        </div>
        <div
          v-else-if="langError"
          class="languages-error"
          @click="retryLanguages"
        >
          统计加载失败，点击重试
        </div>

        <!-- 下半部分：蛇形图区域 -->
        <div class="snake-container">
          <div v-if="snakeLoading" class="loading-placeholder">
            <span>正在加载...</span>
          </div>
          <div v-else-if="snakeLoaded" class="snake-caption">
            GitHub Commit
            <img
              :src="props.isDark ? snakeUrlDark : snakeUrl"
              alt="GitHub Contribution Snake"
              class="snake-image"
              loading="lazy"
              @load="handleLoad"
              @error="handleError"
            />
          </div>
          <div v-else class="error-placeholder" @click="retrySnake">
            <span>图片加载失败，点击重试</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getSpringFestivalDate } from '~/utils/date/springFestival'
import { useGitHubCommits } from '~/utils/composables/useGitHubCommits'
import { useGithubLanguages } from '~/utils/composables/useGithubLanguages'
import { LanguageColors } from '~/utils/init/initLanguageColors'

const props = defineProps<{
  size?: 'small' | 'medium'
  startDate?: string
  springFestivalDate?: string
  isDark?: boolean
}>()

// GitHub 提交统计
const {
  commitCount,
  loading: commitLoading,
  error: commitError,
  fetchCommitCount,
} = useGitHubCommits('Skrepy0', 'HomePage')

// GitHub 语言统计
const {
  languages,
  loading: langLoading,
  error: langError,
  fetchTopLanguages,
} = useGithubLanguages('Skrepy0')

// 蛇形图相关
const snakeUrlDark =
  'https://raw.githubusercontent.com/Skrepy0/HomePage/output/github-contribution-grid-snake-dark.svg'
const snakeUrl =
  'https://raw.githubusercontent.com/Skrepy0/HomePage/output/github-contribution-grid-snake.svg'
const snakeLoading = ref(true)
const snakeLoaded = ref(false)

const handleLoad = () => {
  snakeLoading.value = false
  snakeLoaded.value = true
}

const handleError = () => {
  snakeLoading.value = false
  snakeLoaded.value = false
}

const retryCommits = async () => {
  if (commitLoading.value) return
  commitLoading.value = true
  await fetchCommitCount()
  await new Promise((resolve) => setTimeout(resolve, 300))
  commitLoading.value = false
}

const retryLanguages = () => {
  if (langLoading.value) return
  fetchTopLanguages()
}

const retrySnake = () => {
  if (snakeLoading.value) return
  snakeLoading.value = true
  snakeLoaded.value = false
  const img = new Image()
  img.src = props.isDark ? snakeUrlDark : snakeUrl
  img.onload = () => {
    snakeLoading.value = false
    snakeLoaded.value = true
  }
  img.onerror = () => {
    snakeLoading.value = false
    snakeLoaded.value = false
  }
}
// 翻转状态
const flipped = ref(false)

// 时间相关
const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

// 为不同语言生成稳定的颜色
const getLanguageColor = (language: string): string => {
  const colors: Record<string, string> = LanguageColors

  // 如果预定义颜色不存在，根据语言名称生成一个稳定的 HSL 颜色
  if (!colors[language]) {
    let hash = 0
    for (let i = 0; i < language.length; i++) {
      hash = (hash << 5) - hash + language.charCodeAt(i)
      hash |= 0
    }
    const hue = Math.abs(hash % 360)
    return `hsl(${hue}, 70%, 55%)`
  }

  return colors[language]
}

// 时间进度计算函数（保持不变）
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
  const totalDays =
    (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24) + 1
  const elapsedDays =
    (current.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
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

// 生命周期
onMounted(() => {
  fetchCommitCount()
  fetchTopLanguages()

  now.value = new Date()
  timer = setInterval(() => {
    now.value = new Date()
  }, 10000)

  // 手动检测蛇形图加载状态
  const img = new Image()
  img.src = snakeUrl
  if (img.complete) {
    handleLoad()
  } else {
    img.onload = handleLoad
    img.onerror = handleError
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
@import '../../../assets/css/components/date-stats/github.css';
@import '../../../assets/css/components/container.scss';
@import '../../../assets/css/main.scss';
a {
  @extend .cursor-solid;
}
.languages-error,
.error-placeholder {
  @extend .cursor-solid;
}
.languages-error:hover {
  text-decoration: underline;
}
.stats-container {
  perspective: 1000px;
  width: fit-content;
  margin-top: 10px;
}

.card-inner {
  position: relative;
  width: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  border-radius: 24px;
}

.card-inner.flipped {
  transform: rotateX(180deg);
}

.card-front,
.card-back {
  @extend .container-clear;
  width: 100%;
  backface-visibility: hidden;
  box-sizing: border-box;
  background: v-bind(
    'props.isDark ? "rgba(155, 155, 155, 0.3)" : "rgba(0, 0, 0, 0.3)"'
  );
  color: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-back {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateX(180deg);
  min-height: 200px;
}

/* 语言统计区域 */
.languages-section {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  text-align: center;
  min-height: 110px;
  min-width: 200px;
  padding: 0.75rem;
  margin-left: -12px;
}

.section-title {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: 1px;
}

.language-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.language-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.lang-name {
  flex: 0 0 60px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.lang-progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.lang-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.lang-percent {
  flex: 0 0 45px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
}

.languages-loading,
.languages-error {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 0.5rem 0;
}

/* 其他样式保持原有 */
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

/* 响应式移动端适配 */
@media (max-width: 480px) {
  .stats-container {
    width: 100%;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .card-front,
  .card-back {
    padding: 0.8rem;
  }

  .stat-item {
    font-size: 0.8rem;
    gap: 4px;
  }

  .stat-label {
    flex: 0 0 65px;
    font-size: 0.75rem;
  }

  .stat-value {
    min-width: 45px;
    font-size: 0.75rem;
  }

  .github-stats-item {
    gap: 4px;
  }

  .github-stats-item .stat-value,
  .github-stats-item .stat-label {
    font-size: 0.7rem;
  }

  .repository-path {
    font-size: 0.7rem;
    max-width: 100px;
  }

  .language-item {
    font-size: 0.7rem;
    gap: 4px;
  }

  .lang-name {
    flex: 0 0 50px;
    font-size: 0.7rem;
  }

  .lang-percent {
    flex: 0 0 40px;
    font-size: 0.65rem;
  }

  .section-title {
    font-size: 0.7rem;
  }
}

/* 翻转后背面下移效果 */
.card-inner.flipped .card-back {
  transform: rotateX(180deg) translateY(180px);
  transition: transform 0.6s;
}

.commit-status {
  display: inline-flex;
  align-items: center;
}
.commit-loading,
.commit-error {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}
.commit-error {
  @extend .cursor-solid;
}
.commit-error:hover {
  text-decoration: underline;
}
.commit-success {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
