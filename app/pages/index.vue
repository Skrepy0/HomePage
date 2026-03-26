<template>
  <div>
    <BackgroundCarousel
      ref="carouselRef"
      :images="bgImages"
      :interval="15000"
      :transition-duration="2000"
      :isDark="isDark"
    />
    <div class="top-right-bar">
      <Weather />
      <FunctionLayouts
        :onSwitch="handleSwitch"
        :switchLightDark="switchLightDark"
        :isDark="isDark"
      />
    </div>
    <div class="main-layout">
      <div class="profile">
        <ProfileCard :isDark="isDark" ref="profileCardRef" />
        <Transition name="fade">
          <GithubCommit
            class="github-commit"
            :isDark="isDark"
            :visible="profileCardRef?.hoverGithub"
          />
        </Transition>
      </div>
      <div class="content-wrapper">
        <div class="content">
          <div class="cards-row">
            <div class="cards-top">
              <div class="left-group">
                <TimeBox :isDark="isDark" />
                <LinkBlocks :cards="blogCards" :isDark="isDark" />
              </div>
              <div class="right-group">
                <GitHubLanguages :isDark="isDark" />
                <TimeStats
                  size="medium"
                  startDate="2026-03-19"
                  :isDark="isDark"
                />
              </div>
            </div>
            <div class="cards-bottom">
              <div class="quote-row">
                <ClientOnly>
                  <Quote :isDark="isDark" />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer :isDark="isDark" />
</template>

<script setup lang="ts">
import BackgroundCarousel from '~/components/BackgroundCarousel.vue'
import { backgroundImageUrls } from '~/utils/background/backgroundImages'
import FunctionLayouts from '~/components/head/FunctionLayouts.vue'
import { ref, onMounted } from 'vue'
import TimeBox from '~/components/cards/date/TimeBox.vue'
import ProfileCard from '~/components/cards/ProfileCard.vue'
import Quote from '~/components/cards/Quote.vue'
import Footer from '~/components/Footer.vue'
import TimeStats from '~/components/cards/date/TimeStats.vue'
import GitHubLanguages from '~/components/cards/github/GitHubLanguages.vue'
import LinkBlocks from '~/components/cards/LinkBlocks.vue'
import Weather from '~/components/head/Weather.vue'
import { config } from '~/config'
import GithubCommit from '~/components/cards/github/GithubCommit.vue'
const isDark = ref(false)
const profileCardRef = ref<InstanceType<typeof ProfileCard>>()
const blogCards = ref(config.blog_cards)
const switchLightDark = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
  }
})

const carouselRef = ref()
const handleSwitch = () => {
  carouselRef.value?.next()
}
const bgImages = backgroundImageUrls
</script>

<style scoped lang="scss">
@import '../../assets/css/page-transition.scss';
.main-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  min-height: 100vh;
  padding: 0 20px;
  box-sizing: border-box;
}
.top-right-bar {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 660px; /* 固定宽度，容纳天气和按钮 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

@media (max-width: 768px) {
  .top-right-bar {
    width: 600px;
    right: 12px;
    top: 12px;
  }
}

/* 确保天气组件不被压缩 */
.top-right-bar .weather-card {
  flex-shrink: 0;
}
.profile {
  position: relative; /* 绝对定位的参考点 */
  flex-shrink: 0;
  width: 300px; /* 与 ProfileCard 宽度一致，确保对齐 */
}

/* 控制 GithubCommit 出现在 ProfileCard 下方 */
.profile .github-commit {
  position: absolute;
  top: 100%; /* 紧贴 ProfileCard 底部 */
  left: 0;
  width: 100%; /* 与 ProfileCard 同宽 */
  z-index: 10;
  margin-top: 8px; /* 可选间距 */
}
.profile,
.content-wrapper {
  margin: 0 !important;
  padding: 0 !important;
}
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  margin: 3rem;
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: 15vh 15px 15px 15px;
}

.cards-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 2rem;
}

.cards-top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1.5rem;
  width: 110%;
}

.left-group,
.right-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.cards-bottom {
  width: 110%;
}

.quote-row {
  margin: 1rem auto 0;
}
@media (min-width: 768px) {
  .cards-row {
    max-width: 600px;
    min-width: 600px;
  }
}
@media (max-width: 768px) {
  .profile .github-commit {
    top: 25%;
  }
  .main-layout {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .cards-bottom,
  .cards-top {
    width: 100%;
  }
  .profile {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  .content-wrapper {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .content {
    width: 100%;
    padding-top: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center; /* 垂直居中内部卡片组 */
    align-items: center;
    min-height: auto;
  }
  .cards-row {
    width: 100%;
    margin-bottom: 0;
  }
  .cards-top {
    flex-direction: column;
    align-items: center; /* 水平居中子元素 */
    gap: 1rem;
  }
  .left-group {
    width: 100%;
    max-width: calc(100% - 20px);
    margin: 0 auto; /* 确保居中（冗余但安全） */
  }
  .right-group {
    max-width: calc(100% - 20px);
    margin: 0 auto; /* 确保居中（冗余但安全） */
  }
  .quote-row {
    max-width: calc(100% - 20px);
    margin: 1rem auto 0;
  }
}
/* 淡入淡出过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
