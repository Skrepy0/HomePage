<template>
  <div v-if="visible" class="github-commit">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  isDark?: boolean
  visible?: boolean
}>()

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

onMounted(() => {
  const img = new Image()
  img.src = snakeUrl
  if (img.complete) handleLoad()
  else {
    img.onload = handleLoad
    img.onerror = handleError
  }
})
</script>

<style scoped lang="scss">
.github-commit {
  width: 100%;
}
.snake-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100px;
  background: v-bind(
    'props.isDark ? "rgba(155, 155, 155, 0.3)" : "rgba(0, 0, 0, 0.3)"'
  );
  border-radius: 16px;
  padding: 0.5rem;
}
.loading-placeholder,
.error-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  gap: 0.5rem;
}
.loading-placeholder::before {
  content: '';
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.snake-image {
  max-width: 100%;
  max-height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
.snake-caption {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-top: 0.25rem;
}
</style>
