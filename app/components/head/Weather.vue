<template>
  <div class="weather-card" :class="{ 'dark-mode': isDark }">
    <div class="weather-content">
      <div class="weather-main">
        <Icon :icon="weatherIcon" width="28" height="28" class="weather-icon" />
        <div class="weather-info">
          <div class="location">{{ displayLocation }}</div>
          <div class="temp" :style="{ color: tempColor }">
            {{ temperature }}°C
          </div>
        </div>
      </div>
      <div class="weather-desc">{{ description }}</div>
      <button
        v-if="showRefresh"
        class="refresh-btn"
        @click="refresh"
        :disabled="loading"
        title="刷新天气"
      >
        <Icon icon="mdi:refresh" width="20" height="20" />
      </button>
    </div>
    <div v-if="error" class="error-msg" @click="refresh">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { config } from '~/config'
import {
  getColorByTemp,
  weatherTextToIcon,
  Zhixiashi,
} from '~/utils/weather/weather'
import { getCityNameByPinyin } from '~/utils/weather/cityPinyinMap'

const props = defineProps<{
  isDark?: boolean
  showRefresh?: boolean
}>()

const location = ref('')
const temperature = ref('--')
const description = ref('')
const weatherIcon = ref('wi:day-sunny')
const loading = ref(false)
const error = ref('')

// 去除地区后缀（直辖市不处理）
const removeSuffix = (name: string): string => {
  if (!name) return ''
  return name.replace(/(市|县|区|省)$/, '')
}

const displayLocation = computed(() => {
  if (!location.value) return '未知地点'
  if (Zhixiashi.includes(location.value)) return location.value
  return removeSuffix(location.value)
})

// 根据温度值动态设置文字颜色
const tempColor = computed(() => {
  const temp = parseFloat(temperature.value)
  return getColorByTemp(temp)
})

const fetchWeather = async () => {
  loading.value = true
  error.value = ''
  let cityPinyin = ''

  try {
    // 1. 获取 IP 定位（同步等待结果）
    const ipRes = await fetch('http://ip-api.com/json/')
    if (!ipRes.ok) throw new Error('IP 定位请求失败')
    const ipData = await ipRes.json()
    if (ipData.status !== 'success') throw new Error('IP 定位数据无效')

    // ip-api.com 返回的 city 字段已经是拼音（如 'Shangqiu'）
    cityPinyin = ipData.city.toLowerCase()
    console.log('定位城市拼音:', cityPinyin)

    // 2. 请求天气 API
    const key = config.key
    if (!key) throw new Error('未配置心知天气密钥')
    const url = `https://api.seniverse.com/v3/weather/now.json?key=${key}&location=${encodeURIComponent(cityPinyin)}&language=zh-Hans&unit=c`

    const weatherRes = await fetch(url)
    if (!weatherRes.ok) throw new Error(`HTTP ${weatherRes.status}`)
    const weatherData = await weatherRes.json()

    if (weatherData.results && weatherData.results.length) {
      const now = weatherData.results[0].now
      temperature.value = Math.round(Number(now.temperature)).toString()
      description.value = now.text
      location.value = await getCityNameByPinyin(ipData.city) // 存储拼音，显示时转换为中文
      weatherIcon.value = weatherTextToIcon[now.text] || 'wi:na'
    } else {
      throw new Error('天气数据格式错误')
    }
  } catch (err) {
    console.error(err)
    error.value = '获取天气失败，点击重试'
    if (!cityPinyin) {
      // 可尝试默认城市，但避免无限循环
    }
  } finally {
    loading.value = false
  }
}

const refresh = () => {
  fetchWeather()
}

onMounted(() => {
  fetchWeather()
})
</script>

<style scoped lang="scss">
@import '../../../assets/css/components/container';
.weather-card {
  @extend .container-clear;
  width: 100%;
  max-width: 110px;
  margin: 0 auto;
  padding: 0.6rem;
}
.weather-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.3rem;
}
.weather-main {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.weather-icon {
  flex-shrink: 0;
  color: white;
  width: 28px;
  height: 28px;
}
.weather-info {
  text-align: left;
}
.location {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}
.temp {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  transition: color 0.2s ease;
}
.weather-desc {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  flex: 1;
  text-align: right;
}
.refresh-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.4);
    transform: rotate(90deg);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.error-msg {
  margin-top: 0.4rem;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
@media (max-width: 480px) {
  .weather-card {
    max-width: 30%;
    padding: 0.5rem;
  }
  .temp {
    font-size: 0.9rem;
  }
  .location {
    max-width: 80px;
  }
}
</style>
