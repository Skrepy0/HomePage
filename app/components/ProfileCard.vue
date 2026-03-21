<script setup lang="ts">
import { ref } from 'vue'
import { config } from '~/config'
let links = config.links
interface Props {
  profileLink?: string
  isDark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  profileLink: '',
})

const sizeClass = `size-${config.profile_card_size}`
const showBack = ref(false)

// 切换卡片正反面（不使用翻转，而是内容替换动画）
const toggleCard = () => {
  showBack.value = !showBack.value
}
</script>

<template>
  <div class="profile-card" :class="sizeClass">
    <Transition name="card-switch" mode="out-in">
      <div v-if="!showBack" key="front" class="card-content">
        <div
          class="profile-info"
          :class="{ clickable: profileLink }"
          :data-tooltip="config.tooltip"
          @click="toggleCard"
        >
          <img
            class="avatar"
            :src="config.avatar"
            :alt="config.username"
            loading="lazy"
          />
          <span class="username" style="font-family: 'Comic', sans-serif">{{
            config.username
          }}</span>
        </div>
        <div class="social-links">
          <a
            v-if="links.modrinth.url"
            :href="links.modrinth.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            :data-tooltip="links.modrinth.title"
          >
            <svg
              class="icon"
              viewBox="0 0 512 514"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M503.16 323.56c11.39-42.09 12.16-87.65.04-132.8C466.57 54.23 326.04-26.8 189.33 9.78 83.81 38.02 11.39 128.07.69 230.47h43.3c10.3-83.14 69.75-155.74 155.76-178.76 106.3-28.45 215.38 28.96 253.42 129.67l-42.14 11.27c-19.39-46.85-58.46-81.2-104.73-95.83l-7.74 43.84c36.53 13.47 66.16 43.84 77 84.25 15.8 58.89-13.62 119.23-67 144.26l11.53 42.99c70.16-28.95 112.31-101.86 102.34-177.02l41.98-11.23a210.2 210.2 0 0 1-3.86 84.16z"
                clip-rule="evenodd"
              ></path>
              <path
                fill="currentColor"
                d="M321.99 504.22C185.27 540.8 44.75 459.77 8.11 323.24A257.6 257.6 0 0 1 0 275.46h43.27c1.09 11.91 3.2 23.89 6.41 35.83 3.36 12.51 7.77 24.46 13.11 35.78l38.59-23.15c-3.25-7.5-5.99-15.32-8.17-23.45-24.04-89.6 29.2-181.7 118.92-205.71 17-4.55 34.1-6.32 50.8-5.61L255.19 133c-10.46.05-21.08 1.42-31.66 4.25-66.22 17.73-105.52 85.7-87.78 151.84 1.1 4.07 2.38 8.04 3.84 11.9l49.35-29.61-14.87-39.43 46.6-47.87 58.9-12.69 17.05 20.99-27.15 27.5-23.68 7.45-16.92 17.39 8.29 23.07s16.79 17.84 16.82 17.85l23.72-6.31 16.88-18.54 36.86-11.67 10.98 24.7-38.03 46.63-63.73 20.18-28.58-31.82-49.82 29.89c25.54 29.08 63.94 45.23 103.75 41.86l11.53 42.99c-59.41 7.86-117.44-16.73-153.49-61.91l-38.41 23.04c50.61 66.49 138.2 99.43 223.97 76.48 61.74-16.52 109.79-58.6 135.81-111.78l42.64 15.5c-30.89 66.28-89.84 118.94-166.07 139.34"
              ></path>
            </svg>
          </a>
          <a
            v-if="links.bilibili.url"
            :href="links.bilibili.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            :data-tooltip="links.bilibili.title"
          >
            <svg class="icon" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.78 4.854a1.25 1.25 0 0 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.207a1.25 1.25 0 0 1 .198-.257l2.652-2.652a1.25 1.25 0 0 1 1.768 0zm-9.716 7.164a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-.75-.75zm6.75 0a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-.75-.75z"
              />
            </svg>
          </a>
          <a
            v-if="links.github.url"
            :href="links.github.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            :data-tooltip="links.github.title"
          >
            <svg class="icon" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.099 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
          </a>
          <a
            v-if="links.luogu.url"
            :href="links.luogu.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            :data-tooltip="links.luogu.title"
          >
            <svg
              class="icon"
              viewBox="0 0 1024 1024"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path
                d="M524.95 44.17c19.173-2.304 42.723-1.936 56.18 14.241 15.762 20.094 16.5 48.161 9.586 71.85-8.618 29.818-21.66 58.254-37.607 84.847-18.435 31.2-44.152 57.102-68.716 83.417-21.385 23.367-47.101 42.078-72.219 61.112-10 7.558-19.218 16.868-24.196 28.574-2.673 12.03 3.365 23.873 10.186 33.367 22.306 16.776 51.203 23.827 70.56 44.659 17.605 17.882 29.08 41.202 36.5 64.937 8.48 23.919-13.78 44.244-32.998 54.245-24.749 9.816-52.217 4.977-77.657.737-13.734-2.028-25.394-10.093-35.441-19.218-29.035-26.408-57.148-53.876-84.524-82.035-23.735-26.685-50.281-58.485-43.645-96.968 8.066-35.902 27.56-69.73 55.95-93.465 22.583-18.85 44.06-39.128 63.278-61.434 39.358-48.438 72.126-101.991 113.651-148.724 16.315-18.342 36.455-35.072 61.112-40.141zM492.966 328.344c-.599-16.453 14.84-27.975 30.372-27.606 44.704-2.12 89.086 9.448 133.837 6.452 14.517-.276 30.003-1.336 43.184 5.9 30.417 15.9 53.784 42.262 71.804 71.02 12.95 18.665 30.602 39.45 23.919 63.877-12.029 37.93-45.81 62.264-71.988 90.147-48.945 45.396-93.142 95.493-139.276 143.608 11.983.599 23.965 1.475 35.856 3.272-23.689-.046-49.636-3.272-71.159 8.803-14.425 6.82-10.738 24.61-10.784 37.607-35.58 36.501-69.915 74.154-104.48 111.623-20.74 25.394-45.811 47.608-61.435 76.874-7.927 12.95-14.61 28.251-28.85 35.487-19.772 10.923-43.368 8.111-65.075 8.157-25.487-1.428-56.964-2.212-72.496-26.085 1.337-24.058 16.5-43.46 29.266-62.679 27.468-39.589 58.853-76.182 90.423-112.453 27.238-28.159 58.67-51.848 86.368-79.546 25.21-25.44 51.064-50.282 75.26-76.69 42.492-45.165 87.796-87.934 126.187-136.786 6.775-7.328 3.871-17.698 3.917-26.639-34.98-15.623-66.55-37.976-97.474-60.374-17.605-11.614-30.418-32.307-27.376-53.968zM549.515 693.816c21.523-12.075 47.47-8.849 71.159-8.803 32.537 4.332 63.416 21.292 83.325 47.562 22.445 29.404 40.741 61.665 59.73 93.327 20.97 33.275 54.337 57.47 71.527 93.28 4.793 8.066 3.318 17.606 3.595 26.547-7.743 6.96-15.07 16.591-26.454 16.637-27.192 2.305-54.752 1.567-81.851-1.751-30.74-4.24-50.972-31.385-64.522-56.964-22.214-42.953-58.024-76.228-88.211-113.328-14.656-18.343-32.445-35.764-39.082-58.9.046-12.996-3.641-30.786 10.785-37.607z"
              />
            </svg>
          </a>
        </div>
      </div>

      <div v-else key="back" class="card-content back-content">
        <div class="profile-info" data-tooltip="来找咱呀~" @click="toggleCard">
          <img
            class="avatar"
            :src="config.avatar"
            :alt="config.username"
            loading="lazy"
          />
          <span class="username" style="font-family: 'Comic', sans-serif">{{
            config.username
          }}</span>
        </div>
        <div class="back-details">
          <p class="bio">✨ Home Page ✨</p>
          <div class="social-links" style="justify-content: center">
            <a
              v-if="links.minecraft.url"
              :href="links.minecraft.url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              :data-tooltip="links.minecraft.title"
            >
              <svg
                class="icon"
                viewBox="0 0 1024 1024"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path
                  d="M170.666667 85.333333h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333334v682.666666a85.333333 85.333333 0 0 1-85.333334 85.333334H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333334V170.666667a85.333333 85.333333 0 0 1 85.333334-85.333334m85.333333 170.666667v170.666667h170.666667v85.333333H341.333333v256h85.333334v-85.333333h170.666666v85.333333h85.333334v-256h-85.333334v-85.333333h170.666667V256h-170.666667v170.666667h-170.666666V256H256z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              v-if="links.x.url"
              :href="links.x.url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              :data-tooltip="links.x.title"
            >
              <svg
                class="icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path
                  d="M1 2h2.5l15 20h-2.5ZM5.5 2h2.5l15 20h-2.5Z"
                  fill="currentColor"
                />
                <path d="M3 2h5v2H3ZM16 22h5v-2h-5Z" fill="currentColor" />
                <path d="M18.5 2h3.5l-17 20h-3.5Z" fill="currentColor" />
              </svg>
            </a>
            <a
              v-if="links.xiaohongshu.url"
              :href="links.xiaohongshu.url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              :data-tooltip="links.xiaohongshu.title"
            >
              <svg
                class="icon"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path
                  d="M22.405 9.879c.002.016.01.02.07.019h.725a.797.797 0 0 0 .78-.972a.794.794 0 0 0-.884-.618a.795.795 0 0 0-.692.794c0 .101-.002.666.001.777m-11.509 4.808c-.203.001-1.353.004-1.685.003a2.5 2.5 0 0 1-.766-.126a.025.025 0 0 0-.03.014L7.7 16.127a.025.025 0 0 0 .01.032c.111.06.336.124.495.124c.66.01 1.32.002 1.981 0q.017 0 .023-.015l.712-1.545a.025.025 0 0 0-.024-.036zM.477 9.91c-.071 0-.076.002-.076.01l-.01.08c-.027.397-.038.495-.234 3.06c-.012.24-.034.389-.135.607c-.026.057-.033.042.003.112c.046.092.681 1.523.787 1.74c.008.015.011.02.017.02c.008 0 .033-.026.047-.044q.219-.282.371-.606c.306-.635.44-1.325.486-1.706c.014-.11.021-.22.03-.33l.204-2.616l.022-.293c.003-.029 0-.033-.03-.034zm7.203 3.757a1.4 1.4 0 0 1-.135-.607c-.004-.084-.031-.39-.235-3.06a.4.4 0 0 0-.01-.082c-.004-.011-.052-.008-.076-.008h-1.48c-.03.001-.034.005-.03.034l.021.293q.114 1.473.233 2.946c.05.4.186 1.085.487 1.706c.103.215.223.419.37.606c.015.018.037.051.048.049c.02-.003.742-1.642.804-1.765c.036-.07.03-.055.003-.112m3.861-.913h-.872a.126.126 0 0 1-.116-.178l1.178-2.625a.025.025 0 0 0-.023-.035l-1.318-.003a.148.148 0 0 1-.135-.21l.876-1.954a.025.025 0 0 0-.023-.035h-1.56q-.017 0-.024.015l-.926 2.068c-.085.169-.314.634-.399.938a.5.5 0 0 0-.02.191a.46.46 0 0 0 .23.378a1 1 0 0 0 .46.119h.59c.041 0-.688 1.482-.834 1.972a.5.5 0 0 0-.023.172a.47.47 0 0 0 .23.398c.15.092.342.12.475.12l1.66-.001q.017 0 .023-.015l.575-1.28a.025.025 0 0 0-.024-.035m-6.93-4.937H3.1a.032.032 0 0 0-.034.033c0 1.048-.01 2.795-.01 6.829c0 .288-.269.262-.28.262h-.74c-.04.001-.044.004-.04.047c.001.037.465 1.064.555 1.263c.01.02.03.033.051.033c.157.003.767.009.938-.014c.153-.02.3-.06.438-.132c.3-.156.49-.419.595-.765c.052-.172.075-.353.075-.533q.003-3.495-.007-6.991a.03.03 0 0 0-.032-.032zm11.784 6.896q-.002-.02-.024-.022h-1.465c-.048-.001-.049-.002-.05-.049v-4.66c0-.072-.005-.07.07-.07h.863c.08 0 .075.004.075-.074V8.393c0-.082.006-.076-.08-.076h-3.5c-.064 0-.075-.006-.075.073v1.445c0 .083-.006.077.08.077h.854c.075 0 .07-.004.07.07v4.624c0 .095.008.084-.085.084c-.37 0-1.11-.002-1.304 0c-.048.001-.06.03-.06.03l-.697 1.519s-.014.025-.008.036s.013.008.058.008q2.622.003 5.243.002c.03-.001.034-.006.035-.033zm4.177-3.43q0 .021-.02.024c-.346.006-.692.004-1.037.004q-.021-.003-.022-.024q-.006-.651-.01-1.303c0-.072-.006-.071.07-.07l.733-.003c.041 0 .081.002.12.015c.093.025.16.107.165.204c.006.431.002 1.153.001 1.153m2.67.244a1.95 1.95 0 0 0-.883-.222h-.18c-.04-.001-.04-.003-.042-.04V10.21q.001-.198-.025-.394a1.8 1.8 0 0 0-.153-.53a1.53 1.53 0 0 0-.677-.71a2.2 2.2 0 0 0-1-.258c-.153-.003-.567 0-.72 0c-.07 0-.068.004-.068-.065V7.76c0-.031-.01-.041-.046-.039H17.93s-.016 0-.023.007q-.008.008-.008.023v.546c-.008.036-.057.015-.082.022h-.95c-.022.002-.028.008-.03.032v1.481c0 .09-.004.082.082.082h.913c.082 0 .072.128.072.128v1.148s.003.117-.06.117h-1.482c-.068 0-.06.082-.06.082v1.445s-.01.068.064.068h1.457c.082 0 .076-.006.076.079v3.225c0 .088-.007.081.082.081h1.43c.09 0 .082.007.082-.08v-3.27c0-.029.006-.035.033-.035l2.323-.003a.7.7 0 0 1 .28.061a.46.46 0 0 1 .274.407c.008.395.003.79.003 1.185c0 .259-.107.367-.33.367h-1.218c-.023.002-.029.008-.028.033q.276.655.57 1.303a.05.05 0 0 0 .04.026c.17.005.34.002.51.003c.15-.002.517.004.666-.01a2 2 0 0 0 .408-.075c.59-.18.975-.698.976-1.313v-1.981q.001-.191-.034-.38c0 .078-.029-.641-.724-.998"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
          <p class="motto">「{{ config['description'] }}」</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/css/components/container.scss';
@import '../../assets/css/main.scss';

.profile-card {
  @extend .container-base;
  display: inline-flex;
  flex-direction: column;
  gap: 0.8rem;
  background: v-bind(
    'props.isDark ? "rgba(155, 155, 155, 0.3)":"rgba(0, 0, 0, 0.3)"'
  );
  color: white;
}
.profile-card:hover {
  box-shadow: 0 20px 30px
    v-bind('props.isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"');
  transform: translateY(-3px);
  transition: 0.5s;
}
.card-content {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
}

/* 切换动画：缩放 + 淡入淡出 */
.card-switch-enter-active,
.card-switch-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-switch-enter-from {
  opacity: 0;
  transform: scale(0.92);
}
.card-switch-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.card-switch-enter-to,
.card-switch-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* 正面与背面的通用样式 */
.profile-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  transition: transform 0.5s;
}

/* 点击时瞬间缩小 */
.profile-info:active {
  transform: scale(0.98);
  transition: transform 0.05s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

/* 可选：增强悬浮效果，增加光晕（不影响原有样式） */
.profile-info:hover {
  transform: scale(1.03);
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.4));
  transition:
    transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1),
    filter 0.2s;
}

.avatar {
  @extend .cursor-solid;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.username {
  @extend .cursor-solid;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.social-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

.social-link {
  color: white;
  transition:
    transform 0.2s,
    color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
}
.social-link:hover {
  transform: scale(1.15);
  color: #00a1d6;
}
/* tooltip 样式保持不变 */
.social-link {
  position: relative;
}

.social-link::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 150%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.5);
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s,
    visibility 0.2s;
  pointer-events: none;
  z-index: 10;
}

.social-link::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.9) transparent transparent transparent;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s,
    visibility 0.2s;
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
.icon {
  @extend .cursor-solid;
  width: 24px;
  height: 24px;
}

/* 背面内容样式 */
.back-content {
  text-align: center;
  padding: 0.5rem 0;
}
.bio {
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
}
.skills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.8rem 0;
}
.skill-tag {
  background: rgba(255, 255, 255, 0.15);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  backdrop-filter: blur(4px);
}
.motto {
  font-size: 0.7rem;
  font-style: italic;
  opacity: 0.8;
  margin-top: 0.5rem;
}

/* 尺寸调整 */
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
@media (max-width: 480px) {
  .size-small {
    padding: 0.4rem 0.8rem 0.4rem 0.6rem;
  }
  .size-small .avatar {
    width: 48px;
    height: 48px;
  }
  .size-small .username {
    font-size: 1.2rem;
  }
  .size-small .icon {
    width: 26px;
    height: 26px;
  }
}

/* tooltip 样式 */
.profile-info::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(100, 100, 100, 0.8);
  backdrop-filter: blur(5px);
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 16px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s,
    visibility 0.2s;
  pointer-events: none;
  z-index: 10;
}

.profile-info::before {
  content: '';
  position: absolute;
  bottom: 102%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: rgba(80, 80, 80, 0.9) transparent transparent transparent;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s,
    visibility 0.2s;
  pointer-events: none;
  z-index: 10;
}

.profile-info:hover::after,
.profile-info:hover::before {
  opacity: 1;
  visibility: visible;
}
</style>
