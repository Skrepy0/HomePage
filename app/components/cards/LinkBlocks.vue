<template>
  <div class="double-card-horizontal" :class="{ 'dark-mode': isDark }">
    <div v-for="card in cards" :key="card.id" class="horizontal-card">
      <div class="card-header">
        <Icon
          v-if="card.icon"
          :icon="card.icon"
          width="20"
          height="20"
          class="card-icon"
        />
        <h4 class="card-title">{{ card.title }}</h4>
      </div>
      <p class="card-description">{{ card.description }}</p>
      <a
        v-if="card.link"
        :href="card.link"
        target="_blank"
        rel="noopener noreferrer"
        class="card-link"
      >
        {{ card.linkText || '查看' }} →
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Card {
  id: string | number
  title: string
  description: string
  link?: string
  linkText?: string
  icon?: string
}

const props = defineProps<{
  cards: Card[]
  isDark?: boolean
}>()
</script>

<style scoped lang="scss">
@import '../../../assets/css/main';
@import '../../../assets/css/components/container';
a {
  @extend .cursor-solid;
}
.double-card-horizontal {
  width: 100%;
  display: flex;
  gap: 0.8rem;
  margin: 0 auto;
  height: 100%;
}

.horizontal-card {
  @extend .container-base;
  flex: 1; /* 各占一半宽度 */
  background: v-bind(
    'props.isDark ? "rgba(155, 155, 155, 0.3)" : "rgba(0, 0, 0, 0.3)"'
  );
  padding: 0.8rem;
  color: white;
  display: flex;
  flex-direction: column;
}
.horizontal-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 30px
    v-bind('props.isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"');
  transition: all 0.5s;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.card-icon {
  flex-shrink: 0;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-description {
  font-size: 0.7rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.6rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-link {
  font-size: 0.7rem;
  color: rgba(112, 255, 104, 0.9);
  text-decoration: none;
  align-self: flex-start;
  transition: color 0.2s;
  &:hover {
    color: white;
    transform: translateX(2px);
  }
}
@media (max-width: 768px) {
  .double-card-horizontal {
    //width: 105%;
  }
  .horizontal-card {
    //width: 108%;
  }
}
/* 移动端：宽度自适应，卡片垂直排列 */
@media (max-width: 480px) {
  .double-card-horizontal {
    //width: 108%;
    flex-direction: row;
    gap: 0.8rem;
  }
  .horizontal-card {
    //width: 100%;
  }
}
</style>
