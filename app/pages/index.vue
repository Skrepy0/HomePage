<template>
  <div>
    <BackgroundCarousel ref="carouselRef" :images="bgImages" :interval="15000" :transition-duration="2000"
                        :isDark="isDark"/>
    <div class="profile-calendar-stats-wrapper">
      <FunctionLayouts :onSwitch="handleSwitch" :switchLightDark="switchLightDark" :isDark="isDark"></FunctionLayouts>
      <div class="content">
        <div class="cards-row">
          <!-- 左侧组：ProfileCard + Calendar -->
          <div class="left-group">
            <ProfileCard
                avatar-url="/image/avatar.png"
                username="Skrepy"
                profile-link="#"
                modrinth-url="https://modrinth.com/user/Skrepy2233"
                bilibili-url="https://space.bilibili.com/3546594102217461"
                github-url="https://github.com/Skrepy0"
                luogu-url="https://www.luogu.com.cn/user/1862372"
                size="medium"
                :isDark="isDark"
            />
            <ClientOnly>
              <Calendar size="small" :isDark="isDark"/>
            </ClientOnly>
          </div>

          <!-- 右侧组：TimeBox + DateStats -->
          <div class="right-group">
            <TimeBox :isDark="isDark"/>
            <DateStats size="medium" startDate="2026-03-19" :isDark="isDark"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BackgroundCarousel from '~/components/BackgroundCarousel.vue'
import {backgroundImageUrls} from '~/utils/background/backgroundImages'
import FunctionLayouts from '~/components/FunctionLayouts.vue'
import {ref, onMounted} from 'vue'
import TimeBox from "~/components/Date/TimeBox.vue";
import Calendar from "~/components/Date/Calendar.vue";

// 主题状态：true 表示暗色，false 表示亮色
const isDark = ref(false)

// 切换主题的方法
const switchLightDark = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 初始化主题（例如从 localStorage 读取）
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
  }
})

const carouselRef = ref()
const handleSwitch = () => {
  carouselRef.value?.next();
}
const bgImages = backgroundImageUrls
</script>

<style scoped>
.content {
  position: relative;
  z-index: 1;
  min-height: 100vh;                /* 改为 min-height 允许内容撑开 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;      /* 改为顶部对齐，不再垂直居中 */
  box-sizing: border-box;
  padding: 15vh 20px 20px 20px;     /* 增加顶部内边距，整体下移 */
}

.cards-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
}

.left-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center; /* 内部卡片水平居中 */
}

.right-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 360px; /* 与 DateStats medium 宽度一致 */
}

.right-group > * {
  width: 100%; /* 强制 TimeBox 和 DateStats 宽度填满 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .content {
    padding-top: 20px;             /* 手机上适当加大顶部间距 */
  }

  .cards-row {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .left-group,
  .right-group {
    width: 100%;
    max-width: 360px;
  }

  .right-group {
    max-width: 360px;
  }
}
</style>