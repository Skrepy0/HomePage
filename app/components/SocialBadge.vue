<!-- components/SocialBadge.vue -->
<script setup lang="ts">
defineProps<{
  bilibiliUrl?: string
  githubUrl?: string
  luoguUrl?: string
}>()
</script>

<template>
  <div class="social-badge">
    <a :href="bilibiliUrl" target="_blank" rel="noopener noreferrer" class="social-link" title="Bilibili">
      <!-- 使用真实图片或字体图标，此处用 SVG 示例，你可替换为本地图片 -->
      <svg class="icon" viewBox="0 0 24 24" width="32" height="32">
        <path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.78 4.854a1.25 1.25 0 0 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.207a1.25 1.25 0 0 1 .198-.257l2.652-2.652a1.25 1.25 0 0 1 1.768 0zm-9.716 7.164a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-.75-.75zm6.75 0a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-.75-.75z"/>
      </svg>
    </a>
    <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="social-link" title="GitHub">
      <svg class="icon" viewBox="0 0 24 24" width="32" height="32">
        <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.099 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    </a>
    <a :href="luoguUrl" target="_blank" rel="noopener noreferrer" class="social-link" title="洛谷">
      <svg class="icon" viewBox="0 0 24 24" width="32" height="32">
        <!-- 洛谷图标简单示意，可替换为实际 Logo 图片 -->
        <text x="2" y="20" font-size="18" fill="currentColor" font-weight="bold">洛</text>
      </svg>
    </a>
  </div>
</template>

<style scoped>
.social-badge {
  display: inline-flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 60px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.social-link {
  color: white;
  transition: transform 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-link:hover {
  transform: scale(1.15);
  color: #00a1d6; /* B站蓝，可根据需要调整 */
}

.icon {
  width: 32px;
  height: 32px;
}

@media (max-width: 480px) {
  .social-badge {
    gap: 1rem;
    padding: 0.8rem 1.5rem;
  }
  .icon {
    width: 28px;
    height: 28px;
  }
}
</style>