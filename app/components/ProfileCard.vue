<!-- components/ProfileCard.vue -->
<script setup lang="ts">
interface Props {
  avatarUrl: string
  username: string
  bilibiliUrl?: string
  githubUrl?: string
  luoguUrl?: string
  profileLink?: string
  size?: 'small' | 'medium'
}

const props = withDefaults(defineProps<Props>(), {
  bilibiliUrl: 'https://www.bilibili.com',
  githubUrl: 'https://github.com',
  luoguUrl: 'https://www.luogu.com.cn',
  profileLink: '',
  size: 'small',
})

const sizeClass = `size-${props.size}`
</script>

<template>
  <div class="profile-card" :class="sizeClass">
    <!-- 左侧：头像+用户名，如果profileLink存在则包裹为链接 -->
    <component
        :is="profileLink ? 'a' : 'div'"
        :href="profileLink"
        target="_blank"
        rel="noopener noreferrer"
        class="profile-info"
        :class="{ clickable: profileLink }"
    >
      <img class="avatar" :src="avatarUrl" :alt="username" loading="lazy" />
      <span class="username">{{ username }}</span>
    </component>

    <!-- 右侧：社交图标 -->
    <div class="social-links">
      <a
          v-if="bilibiliUrl"
          :href="bilibiliUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
          data-tooltip="bilibili"
      >
        <!-- 使用简单 SVG 图标，你可以替换为图片 -->
        <svg class="icon" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.78 4.854a1.25 1.25 0 0 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.207a1.25 1.25 0 0 1 .198-.257l2.652-2.652a1.25 1.25 0 0 1 1.768 0zm-9.716 7.164a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-.75-.75zm6.75 0a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-.75-.75z"/>
        </svg>
      </a>
      <a
          v-if="githubUrl"
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
          data-tooltip="GitHub"
      >
        <svg class="icon" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.099 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      </a>
      <a
          v-if="luoguUrl"
          :href="luoguUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
          data-tooltip="洛谷"
      >
        <!-- 洛谷图标简单用文字代替，或使用图片 -->
        <svg class="icon" viewBox="0 0 1024 1024" width="24" height="24" fill="currentColor">
          <path d="M524.95 44.17c19.173-2.304 42.723-1.936 56.18 14.241 15.762 20.094 16.5 48.161 9.586 71.85-8.618 29.818-21.66 58.254-37.607 84.847-18.435 31.2-44.152 57.102-68.716 83.417-21.385 23.367-47.101 42.078-72.219 61.112-10 7.558-19.218 16.868-24.196 28.574-2.673 12.03 3.365 23.873 10.186 33.367 22.306 16.776 51.203 23.827 70.56 44.659 17.605 17.882 29.08 41.202 36.5 64.937 8.48 23.919-13.78 44.244-32.998 54.245-24.749 9.816-52.217 4.977-77.657.737-13.734-2.028-25.394-10.093-35.441-19.218-29.035-26.408-57.148-53.876-84.524-82.035-23.735-26.685-50.281-58.485-43.645-96.968 8.066-35.902 27.56-69.73 55.95-93.465 22.583-18.85 44.06-39.128 63.278-61.434 39.358-48.438 72.126-101.991 113.651-148.724 16.315-18.342 36.455-35.072 61.112-40.141zM492.966 328.344c-.599-16.453 14.84-27.975 30.372-27.606 44.704-2.12 89.086 9.448 133.837 6.452 14.517-.276 30.003-1.336 43.184 5.9 30.417 15.9 53.784 42.262 71.804 71.02 12.95 18.665 30.602 39.45 23.919 63.877-12.029 37.93-45.81 62.264-71.988 90.147-48.945 45.396-93.142 95.493-139.276 143.608 11.983.599 23.965 1.475 35.856 3.272-23.689-.046-49.636-3.272-71.159 8.803-14.425 6.82-10.738 24.61-10.784 37.607-35.58 36.501-69.915 74.154-104.48 111.623-20.74 25.394-45.811 47.608-61.435 76.874-7.927 12.95-14.61 28.251-28.85 35.487-19.772 10.923-43.368 8.111-65.075 8.157-25.487-1.428-56.964-2.212-72.496-26.085 1.337-24.058 16.5-43.46 29.266-62.679 27.468-39.589 58.853-76.182 90.423-112.453 27.238-28.159 58.67-51.848 86.368-79.546 25.21-25.44 51.064-50.282 75.26-76.69 42.492-45.165 87.796-87.934 126.187-136.786 6.775-7.328 3.871-17.698 3.917-26.639-34.98-15.623-66.55-37.976-97.474-60.374-17.605-11.614-30.418-32.307-27.376-53.968zM549.515 693.816c21.523-12.075 47.47-8.849 71.159-8.803 32.537 4.332 63.416 21.292 83.325 47.562 22.445 29.404 40.741 61.665 59.73 93.327 20.97 33.275 54.337 57.47 71.527 93.28 4.793 8.066 3.318 17.606 3.595 26.547-7.743 6.96-15.07 16.591-26.454 16.637-27.192 2.305-54.752 1.567-81.851-1.751-30.74-4.24-50.972-31.385-64.522-56.964-22.214-42.953-58.024-76.228-88.211-113.328-14.656-18.343-32.445-35.764-39.082-58.9.046-12.996-3.641-30.786 10.785-37.607z"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 60px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  color: white;
  transition: background 0.2s;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  transition: transform 0.2s;
}

.profile-info.clickable:hover {
  transform: scale(1.02);
}

.avatar {
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.username {
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-right: 0.5rem;
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
  color: #00a1d6; /* B站蓝，也可统一用品牌色，这里简单示例 */
}

.icon {
  width: 24px;
  height: 24px;
}

.icon-text {
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
}

/* 小尺寸 */
.size-small {
  padding: 0.5rem 1rem 0.5rem 0.75rem;
}
.size-small .avatar {
  width: 36px;
  height: 36px;
}
.size-small .username {
  font-size: 1rem;
}
.size-small .icon {
  width: 22px;
  height: 22px;
}
.size-small .icon-text {
  font-size: 18px;
}

/* 中等尺寸 */
.size-medium {
  padding: 0.75rem 1.5rem 0.75rem 1rem;
}
.size-medium .avatar {
  width: 48px;
  height: 48px;
}
.size-medium .username {
  font-size: 1.2rem;
}
.size-medium .icon {
  width: 28px;
  height: 28px;
}
.size-medium .icon-text {
  font-size: 24px;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .size-small {
    padding: 0.4rem 0.8rem 0.4rem 0.6rem;
    gap: 0.5rem;
  }
  .size-small .avatar {
    width: 60px;
    height: 60px;
  }
  .size-small .username {
    font-size: 1.8rem;
  }
  .size-small .icon {
    width: 40px;
    height: 40px;
  }
  .size-small .icon-text {
    font-size: 32px;
  }
}
.social-link {
  position: relative;
  /* 保留原有样式 */
}

.social-link::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 150%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.5); /* 浅色半透明背景 */
  color: #333; /* 深色文字 */
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  pointer-events: none;
  z-index: 10;
}

/* 如果使用了箭头，也需改为浅色 */
.social-link::before {
  content: '';
  position: absolute;
  bottom: 140%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.9) transparent transparent transparent; /* 箭头颜色与背景一致 */
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  pointer-events: none;
  z-index: 10;
}

.social-link:hover::after {
  opacity: 1;
  visibility: visible;
}

.social-link:hover::before {
  opacity: 1;
  visibility: visible;
}

/* 尺寸微调 */
.size-small .social-link::after {
  bottom: 130%;
  font-size: 10px;
  padding: 2px 6px;
}
.size-small .social-link::before {
  bottom: 120%;
  border-width: 4px;
}
</style>