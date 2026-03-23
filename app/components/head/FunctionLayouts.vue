<template>
  <div class="function-buttons">
    <button
      class="transform-bg-button"
      type="button"
      aria-label="切换背景"
      @click="props.onSwitch"
    >
      <svg
        class="icon"
        viewBox="0 0 1024 1024"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path
          d="M938.666667 553.92V768c0 64.8-52.533333 117.333333-117.333334 117.333333H202.666667c-64.8 0-117.333333-52.533333-117.333334-117.333333V256c0-64.8 52.533333-117.333333 117.333334-117.333333h618.666666c64.8 0 117.333333 52.533333 117.333334 117.333333v297.92z m-64-74.624V256a53.333333 53.333333 0 0 0-53.333334-53.333333H202.666667a53.333333 53.333333 0 0 0-53.333334 53.333333v344.48A290.090667 290.090667 0 0 1 192 597.333333a286.88 286.88 0 0 1 183.296 65.845334C427.029333 528.384 556.906667 437.333333 704 437.333333c65.706667 0 126.997333 16.778667 170.666667 41.962667z m0 82.24c-5.333333-8.32-21.130667-21.653333-43.648-32.917333C796.768 511.488 753.045333 501.333333 704 501.333333c-121.770667 0-229.130667 76.266667-270.432 188.693334-2.730667 7.445333-7.402667 20.32-13.994667 38.581333-7.68 21.301333-34.453333 28.106667-51.370666 13.056-16.437333-14.634667-28.554667-25.066667-36.138667-31.146667A222.890667 222.890667 0 0 0 192 661.333333c-14.464 0-28.725333 1.365333-42.666667 4.053334V768a53.333333 53.333333 0 0 0 53.333334 53.333333h618.666666a53.333333 53.333333 0 0 0 53.333334-53.333333V561.525333zM320 480a96 96 0 1 1 0-192 96 96 0 0 1 0 192z m0-64a32 32 0 1 0 0-64 32 32 0 0 0 0 64z"
          fill="currentColor"
        />
      </svg>
    </button>

    <button
      class="transform-light-button"
      type="button"
      :aria-label="props.isDark ? '切换为亮色模式' : '切换为暗色模式'"
      @click="props.switchLightDark"
    >
      <svg
        class="icon"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path fill="currentColor" :d="props.isDark ? sunPath : moonPath" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="js">
import { computed } from 'vue'

const props = defineProps({
  onSwitch: {
    type: Function,
    required: true,
  },
  switchLightDark: {
    type: Function,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

// 太阳图标路径（亮色模式）
const sunPath =
  'M9.165 14.836Q8 13.67 8 12t1.165-2.835T12 8t2.836 1.165T16 12t-1.164 2.836T12 16t-2.835-1.164M2 12.5q-.213 0-.357-.143T1.5 12t.143-.357T2 11.5h2.5q.214 0 .357.143T5 12t-.143.357t-.357.143zm17.5 0q-.213 0-.357-.143T19 12t.143-.357t.357-.143H22q.214 0 .357.143T22.5 12t-.143.357T22 12.5zm-7.857-7.643Q11.5 4.713 11.5 4.5V2q0-.213.143-.357T12 1.5t.357.143T12.5 2v2.5q0 .214-.143.357T12 5t-.357-.143m0 17.5Q11.5 22.214 11.5 22v-2.5q0-.213.143-.357T12 19t.357.143t.143.357V22q0 .214-.143.357T12 22.5t-.357-.143M6.362 7.03l-1.44-1.396q-.147-.14-.144-.344t.143-.37q.166-.165.36-.165t.354.165L7.05 6.342q.16.166.16.354q0 .189-.16.354q-.14.166-.332.153t-.356-.172m12.004 12.048l-1.416-1.421q-.16-.166-.16-.357t.16-.351q.14-.165.332-.153t.356.172l1.44 1.397q.147.14.144.344t-.143.369q-.166.165-.36.165t-.354-.165M16.95 7.05q-.165-.14-.153-.332t.172-.356l1.397-1.44q.14-.147.344-.144t.369.143q.165.166.165.36t-.165.354L17.658 7.05q-.166.16-.354.16t-.354-.16M4.921 19.079q-.165-.166-.165-.36t.165-.354l1.421-1.415q.166-.16.357-.16q.192 0 .351.16q.146.14.134.332t-.153.356l-1.397 1.44q-.159.166-.353.163q-.195-.002-.36-.162'

// 月亮图标路径（暗色模式）
const moonPath =
  'M12.058 20q-3.333 0-5.667-2.334T4.058 12q0-2.47 1.413-4.535q1.414-2.067 4.01-2.973q.306-.107.536-.056t.381.199t.192.38q.04.233-.063.489q-.194.477-.282.971T10.158 7.5q0 2.673 1.863 4.537q1.864 1.863 4.537 1.863q.698 0 1.277-.148q.58-.148.988-.24q.218-.04.399.01t.292.176q.115.125.156.308t-.047.417q-.715 2.45-2.803 4.013T12.058 20'
</script>

<style scoped lang="scss">
@import '../../../assets/css/main';

.function-buttons {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 12px;
}

button {
  @extend .cursor-solid;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: v-bind(
    'props.isDark ? "rgba(200, 200, 200, 0.3)" : "rgba(80, 80, 80, 0.25)"'
  );
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid
    v-bind('props.isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"');
  color: white;
  transition: all 0.3s ease;
}

button:hover {
  background: v-bind(
    'props.isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)"'
  );
  border-color: v-bind(
    'props.isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"'
  );
  transform: scale(1.1);
  box-shadow: 0 6px 16px
    v-bind('props.isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"');
}

button:active {
  transform: scale(0.95);
}

button .icon {
  width: 24px;
  height: 24px;
  transition: transform 0.2s;
}

/* 两个按钮共用 tooltip 样式 */
.transform-bg-button,
.transform-light-button {
  position: relative;
}

.transform-bg-button::after,
.transform-light-button::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.transform-bg-button::after {
  content: '切换背景';
}

.transform-light-button::after {
  content: '切换主题';
}

.transform-bg-button:hover::after,
.transform-light-button:hover::after {
  opacity: 1;
}

/* 响应式：在小屏幕上调整位置和大小 */
@media (max-width: 640px) {
  .function-buttons {
    top: 12px;
    right: 12px;
  }

  button {
    width: 40px;
    height: 40px;
  }

  button .icon {
    width: 20px;
    height: 20px;
  }
}
</style>
