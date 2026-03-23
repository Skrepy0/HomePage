<!-- components/AvatarId.vue -->
<script setup lang="ts">
interface Props {
  /** 头像图片地址 */
  avatarUrl: string
  /** 用户名（ID） */
  username: string
  /** 可选：点击卡片跳转的链接（若提供则整个卡片可点击） */
  link?: string
  /** 尺寸：small / medium（默认 small 以保持小巧） */
  size?: 'small' | 'medium'
}

const props = withDefaults(defineProps<Props>(), {
  link: '',
  size: 'small',
})

// 根据尺寸计算类名
const sizeClass = `size-${props.size}`
</script>

<template>
  <component
    :is="link ? 'a' : 'div'"
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
    class="avatar-id-card"
    :class="[sizeClass, { clickable: link }]"
  >
    <img class="avatar" :src="avatarUrl" :alt="username" loading="lazy" />
    <span class="username">{{ username }}</span>
  </component>
</template>

<style scoped lang="scss">
.avatar-id-card {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 60px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.2s,
    background 0.2s;
  text-decoration: none;
  color: white;
}

.avatar-id-card.clickable:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.25);
  transition: 1s;
}

.avatar {
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.username {
  @extend .cursor-solid;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  font-family: Blueaka, sans-serif;
}

/* 小尺寸 */
.size-small {
  padding: 0.5rem 1rem;
}
.size-small .avatar {
  width: 36px;
  height: 36px;
}
.size-small .username {
  font-size: 1.6rem;
}

/* 中等尺寸 */
.size-medium {
  padding: 0.75rem 1.5rem;
}
.size-medium .avatar {
  width: 48px;
  height: 48px;
}
.size-medium .username {
  font-size: 1.2rem;
}

/* 移动端适配：小屏进一步缩小 */
@media (max-width: 480px) {
  .size-small {
    padding: 0.4rem 0.8rem;
    gap: 0.5rem;
  }
  .size-small .avatar {
    width: 30px;
    height: 30px;
  }
  .size-small .username {
    font-size: 1.6rem;
  }
}
</style>
