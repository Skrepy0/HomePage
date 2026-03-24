<template>
  <div class="github-card" :class="sizeClass">
    <!-- 常用语言区域 -->
    <div class="languages-section">
      <div class="section-title">常用语言</div>

      <!-- 加载中：显示动画进度条 + 占位标签 -->
      <div v-if="langLoading" class="loading-placeholder">
        <div class="lang-bar loading"></div>
        <div class="lang-labels placeholder">
          <div class="lang-label" v-for="i in 4" :key="i">
            <span class="lang-color placeholder"></span>
            <span class="lang-name placeholder"></span>
            <span class="lang-percent placeholder"></span>
          </div>
        </div>
      </div>

      <!-- 加载成功且有数据 -->
      <div v-else-if="languages.length">
        <div class="lang-bar">
          <div
            v-for="lang in languages"
            :key="lang.name"
            class="lang-segment"
            :style="{
              width: lang.percent + '%',
              backgroundColor: getLanguageColor(lang.name),
            }"
            :title="`${lang.name}: ${lang.percent?.toFixed(1)}%`"
          ></div>
        </div>
        <div class="lang-labels">
          <div v-for="lang in languages" :key="lang.name" class="lang-label">
            <span
              class="lang-color"
              :style="{ backgroundColor: getLanguageColor(lang.name) }"
            ></span>
            <span class="lang-name">{{ lang.name }}</span>
            <span class="lang-percent">{{ lang.percent?.toFixed(1) }}%</span>
          </div>
        </div>
      </div>

      <!-- 加载失败 -->
      <div
        v-else-if="langError"
        class="languages-error"
        @click="retryLanguages"
      >
        统计加载失败，点击重试
      </div>
    </div>

    <!-- 蛇形图组件（可选） -->
    <GithubCommit :isDark="props.isDark" :visible="showSnake" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGithubLanguages } from '~/utils/composables/useGithubLanguages'
import { LanguageColors } from '~/utils/init/initLanguageColors'
import GithubCommit from './GithubCommit.vue'

const props = defineProps<{
  size?: 'small' | 'medium'
  isDark?: boolean
  showSnake?: boolean
}>()
const sizeClass = `github-card-${props.size || 'medium'}`
const {
  languages,
  loading: langLoading,
  error: langError,
  fetchTopLanguages,
} = useGithubLanguages('Skrepy0')

const retryLanguages = () => {
  if (langLoading.value) return
  fetchTopLanguages()
}

const getLanguageColor = (language: string): string => {
  const colors: Record<string, string> = LanguageColors
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

onMounted(() => {
  fetchTopLanguages()
})
</script>

<style scoped lang="scss">
@import '../../../../assets/css/components/container';
@import '../../../../assets/css/main';
@import '../../../../assets/css/fonts';
.github-card {
  @extend .container-base;
  background: v-bind(
    'props.isDark ? "rgba(155, 155, 155, 0.3)" : "rgba(0, 0, 0, 0.3)"'
  );
  padding: 0.8rem;
  color: white;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 0.8rem;
  font-family: Comic, 'Comic Sans MS', sans-serif;
}

.github-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 30px
    v-bind('props.isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"');
  transition: all 0.5s;
}

/* 语言区域（固定高度，防止跳动） */
.languages-section {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  min-height: 115px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-title {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}

/* 整体进度条容器 */
.lang-bar {
  display: flex;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 0.6rem;
}

/* 进度条加载动画（条纹移动） */
@keyframes loading-stripe {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.lang-bar.loading {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 180% 90%;
  animation: loading-stripe 1.5s infinite linear;
}

/* 每个语言段（宽度过渡动画） */
.lang-segment {
  height: 100%;
  transition: width 0.3s ease;
  cursor: help;
}
.lang-segment:hover {
  filter: brightness(1.1);
}

/* 语言标签列表 */
.lang-labels {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.4rem;
  justify-items: center;
}
.lang-labels.placeholder {
  opacity: 0.6;
}

.lang-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  width: 100%;
  justify-content: flex-start;
}

.lang-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}
.lang-color.placeholder {
  background: rgba(255, 255, 255, 0.2);
}

.lang-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lang-name.placeholder {
  width: 60px;
  height: 0.7rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.lang-percent {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.7);
  margin-left: auto;
}
.lang-percent.placeholder {
  width: 30px;
  height: 0.6rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.languages-error {
  @extend .cursor-solid;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 0.8rem 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  margin-top: 0;
}

/* 尺寸变体 */
.github-card.stats-small {
  width: 260px;
}
.github-card.stats-medium {
  width: 320px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .github-card {
    padding: 0.7rem;
  }
  .github-card.stats-small,
  .github-card.stats-medium {
    //width: 100%;
    //max-width: 260px;
  }
  .lang-labels {
    grid-template-columns: 1fr;
    gap: 0.3rem;
  }
}
</style>
