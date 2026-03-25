<template>
  <div v-if="visible" class="music-player" :class="{ 'dark-mode': isDark }">
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
          <button class="control-btn" @click="prev" :disabled="!hasPrev">
            ⏮
          </button>
          <button class="control-btn play-btn" @click="togglePlay">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="control-btn" @click="next" :disabled="!hasNext">
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
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
        <!-- 音量控制区域 -->
        <div class="volume-control">
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  isDark?: boolean
}>()

const emit = defineEmits(['close'])

interface Song {
  id: number
  name: string
  artist: string[]
  album: string
  play_url: string
  pic_url: string
}

const songs = ref<Song[]>([])
const volumeSlider = ref<HTMLInputElement | null>(null)
const loading = ref(true)
const error = ref('')
const currentIndex = ref(0)
const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7) // 默认音量 70%
const mode = ref<'loop' | 'random' | 'single'>('loop')

const currentSong = computed(() => songs.value[currentIndex.value])
const hasPrev = computed(() => songs.value.length > 1 && currentIndex.value > 0)
const hasNext = computed(
  () => songs.value.length > 1 && currentIndex.value < songs.value.length - 1
)

const modeIcon = computed(() => {
  if (mode.value === 'loop') return '🔁'
  if (mode.value === 'random') return '🎲'
  return '🔂'
})
const modeText = computed(() => {
  if (mode.value === 'loop') return '列表循环'
  if (mode.value === 'random') return '随机播放'
  return '单曲循环'
})

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// ---------- Media Session API 支持 ----------
const updateMediaSession = () => {
  if (!('mediaSession' in navigator)) return
  const song = currentSong.value
  if (!song) return
  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.name,
    artist: song.artist.join(', '),
    album: song.album,
    artwork: [{ src: song.pic_url, sizes: '512x512', type: 'image/jpeg' }],
  })
  navigator.mediaSession.setActionHandler('play', () => play())
  navigator.mediaSession.setActionHandler('pause', () => pause())
  navigator.mediaSession.setActionHandler('previoustrack', () => prev())
  navigator.mediaSession.setActionHandler('nexttrack', () => next())
  navigator.mediaSession.setActionHandler('seekbackward', (details) => {
    if (audio.value && details.seekOffset)
      audio.value.currentTime -= details.seekOffset
  })
  navigator.mediaSession.setActionHandler('seekforward', (details) => {
    if (audio.value && details.seekOffset)
      audio.value.currentTime += details.seekOffset
  })
}

const updateMediaPlaybackState = () => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = isPlaying.value
      ? 'playing'
      : 'paused'
  }
}

watch([currentSong, isPlaying], () => {
  updateMediaSession()
  updateMediaPlaybackState()
})

const updateVolumeFill = () => {
  if (volumeSlider.value) {
    const percent = volume.value * 100
    volumeSlider.value.style.backgroundSize = `${percent}% 100%`
  }
}

const onVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const newVolume = parseFloat(target.value)
  volume.value = newVolume
  if (audio.value) audio.value.volume = newVolume
  updateVolumeFill()
}

// ---------- 播放器核心逻辑 ----------
const fetchPlaylist = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/netease')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.code === 200 && data.data?.length) {
      songs.value = data.data
      // 随机选择初始歌曲索引
      const randomIndex = Math.floor(Math.random() * songs.value.length)
      currentIndex.value = randomIndex
      initAudio()
    } else {
      error.value = data.message || '获取歌单失败'
    }
  } catch (err) {
    console.error(err)
    error.value = '网络错误，点击重试'
  } finally {
    loading.value = false
  }
}

const initAudio = () => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
  const song = currentSong.value
  if (!song || !song.play_url) return
  const audioEl = new Audio(song.play_url)
  audioEl.volume = volume.value
  audioEl.addEventListener('timeupdate', () => {
    currentTime.value = audioEl.currentTime
  })
  audioEl.addEventListener('durationchange', () => {
    duration.value = audioEl.duration
  })
  audioEl.addEventListener('ended', () => {
    if (mode.value === 'single') {
      audioEl.currentTime = 0
      audioEl.play()
    } else {
      next()
    }
  })
  audio.value = audioEl
  if (isPlaying.value) {
    audioEl.play().catch((e) => console.warn('播放失败', e))
  }
  updateMediaSession()
  updateMediaPlaybackState()
}

const play = () => {
  if (!audio.value) return
  audio.value.play()
  isPlaying.value = true
  updateMediaPlaybackState()
}

const pause = () => {
  if (!audio.value) return
  audio.value.pause()
  isPlaying.value = false
  updateMediaPlaybackState()
}

const togglePlay = () => {
  if (isPlaying.value) pause()
  else play()
}

const prev = () => {
  if (!hasPrev.value) return
  currentIndex.value--
  initAudio()
  if (isPlaying.value) play()
}

const next = () => {
  if (!hasNext.value) {
    if (mode.value === 'loop') {
      currentIndex.value = 0
      initAudio()
      if (isPlaying.value) play()
    }
    return
  }
  currentIndex.value++
  initAudio()
  if (isPlaying.value) play()
}

const toggleMode = () => {
  if (mode.value === 'loop') mode.value = 'random'
  else if (mode.value === 'random') mode.value = 'single'
  else mode.value = 'loop'
}

const seek = (e: MouseEvent) => {
  if (!audio.value || !duration.value) return
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const x = e.clientX - rect.left
  const percent = x / rect.width
  audio.value.currentTime = percent * duration.value
}

const close = () => {
  emit('close')
}

onMounted(() => {
  updateVolumeFill()
  fetchPlaylist()
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', null)
    navigator.mediaSession.setActionHandler('pause', null)
    navigator.mediaSession.setActionHandler('previoustrack', null)
    navigator.mediaSession.setActionHandler('nexttrack', null)
  }
})
</script>

<style scoped lang="scss">
@import '../../../assets/css/main.scss';
a {
  @extend .cursor-solid;
  color: whitesmoke;
  text-decoration: none;
}
.music-player {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 300px;
  background: rgba(20, 20, 30, 0.95);
  border-radius: 20px;
  padding: 1rem;
  color: #f0f0f0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  transition: all 0.3s;
  backdrop-filter: none;
}
.music-player.dark-mode {
  background: rgba(10, 10, 18, 0.98);
  border-color: rgba(255, 255, 255, 0.1);
}
.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  h3 {
    font-size: 1rem;
    margin: 0;
    font-weight: 500;
  }
  .close-btn {
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
}
.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem 0;
  color: #aaa;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: #ffb347;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
.error {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .retry-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 20px;
    padding: 0.2rem 0.8rem;
    color: white;
    cursor: pointer;
    font-size: 0.7rem;
    transition: background 0.2s;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
.player-content {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  .cover {
    width: 90px;
    height: 90px;
    flex-shrink: 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .player-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .info {
    text-align: left;
    .title {
      font-weight: 600;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0.2rem;
    }
    .artist {
      font-size: 0.7rem;
      color: #bbb;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    .control-btn {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.08);
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      color: white;
      font-size: 1rem;
      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
      }
      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
    .play-btn {
      width: 38px;
      height: 38px;
      background: #ffb347;
      color: #1e1e2a;
      &:hover {
        background: #ffa01e;
      }
    }
  }
  .progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    cursor: pointer;
    margin: 0.2rem 0;
    .progress {
      height: 100%;
      background: #ffb347;
      border-radius: 2px;
      transition: width 0.05s linear;
    }
  }
  .time {
    font-size: 0.65rem;
    color: #aaa;
    text-align: center;
  }
  .volume-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.2rem;
    .volume-icon {
      font-size: 0.8rem;
      color: #ccc;
    }
    .volume-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      background:
        linear-gradient(to right, #ffb347, #ffb347) 0% 0% / 0% 100% no-repeat,
        rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      outline: none;
      transition: background-size 0.1s;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ffb347;
        cursor: pointer;
        border: none;
        margin-top: -4px;
      }

      &::-webkit-slider-runnable-track {
        height: 4px;
        background: transparent;
        border-radius: 4px;
      }

      &::-moz-range-track {
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }

      &::-moz-range-progress {
        height: 4px;
        background: #ffb347;
        border-radius: 4px;
      }
    }
  }
}
@media (max-width: 640px) {
  .music-player {
    width: 280px;
    right: 10px;
    top: 70px;
    padding: 0.8rem;
  }
  .player-content .cover {
    width: 70px;
    height: 70px;
  }
  .player-content .controls .control-btn {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
  .player-content .controls .play-btn {
    width: 34px;
    height: 34px;
  }
}
</style>
