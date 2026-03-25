<template>
  <div
    ref="playerRef"
    v-if="visible"
    class="music-player"
    :class="{ 'dark-mode': isDark }"
  >
    <div class="player-header">
      <h3><a href="https://www.bilibili.com/video/BV1J4411v7g6/">Music~</a></h3>
      <button class="close-btn" @click="close">✕</button>
    </div>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>
    <div v-else-if="error" class="error">
      <span>{{ error }}</span>
      <button class="retry-btn" @click="fetchPlaylist">重试</button>
    </div>
    <div v-else-if="currentSong" class="player-content">
      <div class="cover">
        <img
          :src="currentSong.pic_url"
          :alt="currentSong.name"
          loading="lazy"
        />
      </div>
      <div class="player-right">
        <div class="info">
          <div class="title">{{ currentSong.name }}</div>
          <div class="artist">{{ currentSong.artist.join(', ') }}</div>
        </div>
        <div class="controls">
          <button
            class="control-btn"
            @click="playlistPrev"
            :disabled="!hasPrev"
          >
            ⏮
          </button>
          <button class="control-btn play-btn" @click="audio.togglePlay">
            {{ audio.isPlaying.value ? '⏸' : '▶' }}
          </button>
          <button
            class="control-btn"
            @click="playlistNext"
            :disabled="!hasNext"
          >
            ⏭
          </button>
          <button
            class="control-btn mode-btn"
            @click="toggleMode"
            :title="modeText"
          >
            {{ modeIcon }}
          </button>
        </div>
        <div class="progress-bar" @click="seek">
          <div class="progress" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="time">
          {{ formatTime(audio.currentTime.value) }} /
          {{ formatTime(audio.duration.value) }}
        </div>
        <!-- 音量控制区域 -->
        <div class="volume-control" @wheel="onVolumeWheel">
          <span class="volume-icon">🔊</span>
          <input
            type="range"
            class="volume-slider"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            @input="onVolumeChange"
            :style="{ backgroundSize: volume * 100 + '% 100%' }"
          />
        </div>
      </div>
    </div>
    <div v-else class="empty">暂无歌曲</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAudio } from '../../utils/composables/music/useAudio'
import { usePlaylist } from '../../utils/composables/music/usePlaylist.ts'
import { useMediaSession } from '../../utils/composables/music/useMediaSession.ts'
import { useVolumeSlider } from '../../utils/composables/music/useVolumeSlider.ts'
import { useWheelBlocker } from '../../utils/composables/music/useWheelBlocker.ts'

const props = defineProps<{
  visible: boolean
  isDark?: boolean
}>()

const emit = defineEmits(['close'])
const playerRef = ref<HTMLElement | null>(null)
const volume = ref(0.5)

// 歌单逻辑
const {
  songs,
  loading,
  error,
  currentSong,
  hasPrev,
  hasNext,
  mode,
  modeIcon,
  modeText,
  fetchPlaylist,
  prev: playlistPrev,
  next: playlistNext,
  toggleMode,
} = usePlaylist(() => {
  // 歌曲切换时重新初始化音频
  audio.initAudio()
})

// 音频逻辑（正确使用 audio 对象）
const audio = useAudio(currentSong, volume, () => {
  if (mode.value === 'single') {
    audio.play()
  } else {
    playlistNext()
  }
})
// 媒体会话
useMediaSession(
  currentSong,
  audio.isPlaying,
  audio.play,
  audio.pause,
  playlistPrev,
  playlistNext,
  (offset) => {
    if (audio.audio.value) {
      audio.audio.value.currentTime += offset
    }
  }
)
// 音量滑块样式
const { volumeSlider, updateVolumeFill } = useVolumeSlider(volume)

// 音量变化处理
const onVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  volume.value = parseFloat(target.value)
  audio.syncVolume()
  updateVolumeFill()
}

// 滚轮调节音量
const onVolumeWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.02 : 0.02
  let newVolume = volume.value + delta
  newVolume = Math.min(1, Math.max(0, newVolume))
  volume.value = newVolume
  audio.syncVolume()
  updateVolumeFill()
  const slider = e.target as HTMLInputElement
  if (slider) slider.value = newVolume.toString()
}

// 进度条点击跳转
const seek = (e: MouseEvent) => {
  audio.seek(e)
}

// 关闭播放器
const close = () => {
  emit('close')
}

// 滚轮阻止
useWheelBlocker(playerRef)

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 进度百分比
const progressPercent = computed(() => {
  if (!audio.duration.value) return 0
  return (audio.currentTime.value / audio.duration.value) * 100
})

// 初始加载歌单
fetchPlaylist()
</script>

<style scoped lang="scss">
@import '../../../assets/css/components/player.scss';
</style>
