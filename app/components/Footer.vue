<template>
  <footer class="footer" :class="{ 'dark-mode': isDark }">
    <div class="footer-content">
      <div class="copyright">
        © {{ currentYear }} Skrepy.
        <a class="license" href="https://mit-license.org/" target="_blank"
          >MIT</a
        >.
        <br />
        由Skrepy使用
        <a
          target="_blank"
          style="color: #419972"
          href="https://github.com/vuejs/core"
          >Vue.js</a
        >
        和
        <a
          target="_blank"
          style="color: #00dc82"
          href="https://github.com/nuxt/nuxt"
          >Nuxt</a
        >
        编写
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const props = defineProps<{
  isDark?: boolean
}>()

const currentYear = new Date().getFullYear()
</script>

<style scoped lang="scss">
@import '../../assets/css/main.scss';
.footer {
  border-radius: 3px;
  left: 0;
  margin-top: 3rem;
  padding: 1.5rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(100, 100, 100, 0.2);
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  transition: background 0.8s ease;
  flex: 1px;
}

/* 暗色主题微调 */
.footer.dark-mode {
  background: rgba(155, 155, 155, 0.3);
}

.footer-content {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
}

.copyright {
  font-size: 0.85rem;
  opacity: 0.8;
  font-family: 'Comic', 'Comic Sans MS', serif;
  text-align: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .footer {
    padding: 1rem;
    margin-top: 2rem;
  }
  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
  }
  .footer-links {
    gap: 1rem;
  }
}
a {
  @extend .cursor-solid;
}
.license {
  color: rgba(255, 255, 255, 0.8);
  @extend .cursor-solid;
}
</style>
