<template>
  <div class="github-commits">
    <div class="stat-item github-stats-item">
      <svg class="github-icon" viewBox="0 0 1024 1024" width="24" height="24">
        <path
          d="M512 384a128 128 0 1 0 0 256 128 128 0 0 0 0-256zM302.912 469.312a213.376 213.376 0 0 1 418.176 0h260.224v85.376h-260.224a213.44 213.44 0 0 1-418.176 0H42.688V469.312h260.224z"
          fill="currentColor"
        />
      </svg>
      <a
        class="repository-path"
        href="https://github.com/Skrepy0/HomePage"
        target="_blank"
      >
        Skrepy's Home Page
      </a>
      <div class="commit-status">
        <div v-if="commitLoading" class="commit-loading">加载中...</div>
        <div v-else-if="commitError" class="commit-error" @click="retryCommits">
          加载失败，点击重试
        </div>
        <div v-else class="commit-success">
          <span class="stat-value">{{ commitCount }}</span>
          <span class="stat-label">次提交</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGitHubCommits } from '~/utils/composables/useGitHubCommits'

const props = defineProps<{
  isDark?: boolean
}>()

const {
  commitCount,
  loading: commitLoading,
  error: commitError,
  fetchCommitCount,
} = useGitHubCommits('Skrepy0', 'HomePage')

const retryCommits = async () => {
  if (commitLoading.value) return
  commitLoading.value = true
  await fetchCommitCount()
  setTimeout(() => (commitLoading.value = false), 300)
}

// 组件挂载时自动获取提交次数
onMounted(() => {
  fetchCommitCount()
})
</script>

<style scoped lang="scss">
@import '../../../../assets/css/main';
a {
  @extend .cursor-solid;
}
.github-commits {
  width: 100%;
}
.github-stats-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: space-between;
}
.github-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
.repository-path {
  font-size: 0.75rem;
  color: #dd693c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}
.commit-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}
.commit-loading,
.commit-error {
  @extend .cursor-solid;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
}
.commit-error:hover {
  text-decoration: underline;
}
.commit-success {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.commit-success .stat-value {
  font-weight: 600;
  font-size: 0.8rem;
}
.commit-success .stat-label {
  font-size: 0.7rem;
}
</style>
