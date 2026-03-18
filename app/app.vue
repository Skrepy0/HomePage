<template>
  <div>
    <BackgroundCarousel :images="bgImages" :interval="6000" :transition-duration="1200" />
    <div class="content">
      <!-- 将头像和社交卡片组合在一起，垂直排列 -->
      <div class="profile-section">
        <ProfileCard
            avatar-url="/image/avatar.png"
            username="Skrepy"
            profile-link="https://your-website.com"
            bilibili-url="https://space.bilibili.com/你的uid"
            github-url="https://github.com/Skrepy0"
            luogu-url="https://www.luogu.com.cn/user/1862372"
            size="medium"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import BackgroundCarousel from '~/components/BackgroundCarousel.vue'
import AvatarId from '~/components/AvatarId.vue'
import SocialBadge from '~/components/SocialBadge.vue'
import { backgroundImageUrls } from '~/utils/background/backgroundImages'

const bgImages = backgroundImageUrls
</script>

<style scoped>
.content {
  position: relative;
  z-index: 1;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 15vh; /* 偏上位置 */
  box-sizing: border-box;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem; /* 头像与社交卡片之间的间距 */
}
</style>