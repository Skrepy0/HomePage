<template>
  <div
    ref="playerRef"
    v-if="visible"
    class="music-player"
    :class="{ 'dark-mode': isDark }"
  >
    <div class="player-header">
      <h3><a href="https://www.bilibili.com/video/BV1J4411v7g6/">Music~</a></h3>
      <button class="refresh-btn" @click="fetchPlaylist" title="刷新歌单">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
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
            <svg
              v-if="mode === 'loop'"
              width="16"
              height="16"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M560.70379009 320.16991061H198.25332639c-21.68104205 0-39.27725009-17.59620803-39.27725009-39.27725007s17.59620803-39.27725009 39.27725009-39.27725005H560.70379009c21.68104205 0 39.27725009 17.59620803 39.27725007 39.27725005s-17.59620803 39.27725009-39.27725007 39.27725007zM560.70379009 555.67630209H198.25332639c-21.68104205 0-39.27725009-17.59620803-39.27725009-39.27725008s17.59620803-39.27725009 39.27725009-39.27725008H560.70379009c21.68104205 0 39.27725009 17.59620803 39.27725007 39.27725008-0.15710901 21.68104205-17.59620803 39.27725009-39.27725007 39.27725008zM560.70379009 791.02558454H198.25332639c-21.68104205 0-39.27725009-17.59620803-39.27725009-39.27725007s17.59620803-39.27725009 39.27725009-39.27725006H560.70379009c21.68104205 0 39.27725009 17.59620803 39.27725007 39.27725006s-17.59620803 39.27725009-39.27725007 39.27725007zM721.42629742 826.21800061c-6.441469 0-13.04004703-1.57108999-18.85308003-4.87037899-12.56872002-6.91279601-20.26706103-20.10995203-20.26706105-34.40687108V245.07180847c0-21.68104205 17.59620803-39.27725009 39.27725007-39.27725008s39.27725009 17.59620803 39.27725008 39.27725008v470.69856494l48.54668111-30.63625506c18.22464404-11.46895703 42.57653909-6.127251 54.20260509 12.25450201 11.62606602 18.38175303 6.127251 42.57653909-12.25450202 54.20260511l-108.71942822 68.65663314c-6.59857803 3.92772502-13.98270102 5.97014202-21.20971503 5.970142z"
                fill="currentColor"
              />
            </svg>
            <svg
              v-else-if="mode === 'single'"
              width="16"
              height="16"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M802.611388 448.802879a43.350032 43.350032 0 0 0-43.350032 43.350031v249.385508h-473.310097L406.500473 620.989205a43.350032 43.350032 0 0 0-61.30417-61.311395l-192.112891 192.105666c-9.089057 9.096282-13.13506 21.205391-12.463134 33.112199-0.671925 11.899584 3.366852 24.015918 12.463134 33.112199l192.112891 192.105666c8.467706 8.460481 19.558089 12.694334 30.655697 12.694334s22.187991-4.233853 30.655698-12.701559a43.350032 43.350032 0 0 0 0-61.30417l-120.556439-120.549213h516.660129a43.350032 43.350032 0 0 0 43.350032-43.350032c0-0.932026-0.079475-1.842376-0.137275-2.767177 0.0578-0.917576 0.137275-1.827926 0.137275-2.767177V492.15291a43.350032 43.350032 0 0 0-43.350032-43.350031z"
                fill="currentColor"
              />
              <path
                d="M553.26923 638.907218V389.673435a43.350032 43.350032 0 0 0-86.700063 0V638.907218a43.350032 43.350032 0 0 0 86.700063 0z"
                fill="currentColor"
              />
              <path
                d="M883.495322 240.787751c0.671925-11.892359-3.374077-24.001468-12.463134-33.090524l-192.112891-192.112891a43.342807 43.342807 0 0 0-61.296945 0 43.335582 43.335582 0 0 0 0 61.30417l120.549214 120.549214H221.504212a43.350032 43.350032 0 0 0-43.350032 43.350031c0 0.932026 0.079475 1.842376 0.137276 2.759952-0.0578 0.917576-0.137275 1.827926-0.137276 2.759952v287.215636a43.350032 43.350032 0 0 0 86.700064 0V284.137783h473.317322L617.615127 404.686996a43.342807 43.342807 0 1 0 61.296945 61.30417l192.112891-192.105665c9.096282-9.089057 13.142285-21.198166 12.470359-33.09775z"
                fill="currentColor"
              />
            </svg>
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M753.564731 337.471035c-45.8697 0-160.259984 113.849978-243.789399 194.548928C383.134027 654.383848 263.508509 773.284865 167.764911 773.284865l-58.892295 0c-24.068162 0-43.581588-19.526729-43.581588-43.581588s19.513426-43.581588 43.581588-43.581588l58.892295 0c60.504002 0 183.002964-121.68134 281.432741-216.784348 119.79641-115.744117 223.254713-219.029482 304.368102-219.029482l56.209186 0-59.641355-57.828057c-17.033955-16.993023-17.060561-42.902112-0.057305-59.927881 17.002232-17.030885 44.596707-17.064654 61.631686-0.065492l134.207631 133.874033c8.192589 8.172123 12.794397 19.238157 12.794397 30.803563 0 11.564383-4.601808 22.604834-12.794397 30.776957L811.706943 461.72599c-8.505721 8.486278-19.646456 12.522198-30.78719 12.522198-11.166317 0-22.333658-4.676509-30.844495-13.199627-17.003256-17.025769-16.975627-45.432749 0.057305-62.425771l59.641355-61.151755L753.564731 337.471035zM811.706943 561.66105c-17.034978-16.999163-44.629453-16.972557-61.631686 0.058328-17.003256 17.024745-16.975627 46.257533 0.057305 63.250556l59.641355 61.150732-56.209186 0c-35.793204 0-95.590102-52.946886-154.87637-108.373243-17.576307-16.435321-45.161572-16.3422-61.594847 1.226944-16.444531 17.568121-15.523555 46.393633 2.053776 62.823837 90.322122 84.458577 151.246703 131.484613 214.417441 131.484613l56.209186 0-59.641355 57.824987c-17.033955 16.993023-17.060561 43.736107-0.057305 60.761875 8.511861 8.523117 19.678178 12.369725 30.844495 12.369725 11.140735 0 22.281469-4.453429 30.78719-12.939707L945.914574 757.311055c8.192589-8.173147 12.794397-19.315928 12.794397-30.881334 0-11.564383-4.601808-22.682605-12.794397-30.855752L811.706943 561.66105zM108.871593 337.471035l58.892295 0c45.932122 0 114.40154 58.455343 168.915108 107.942431 8.352225 7.576559 18.832927 12.140505 29.29214 12.140505 11.852956 0 23.673166-4.394077 32.270984-13.857613 16.182564-17.807574 14.859429-46.823422-2.958378-62.998823-85.247546-77.381391-156.561755-130.388652-227.519854-130.388652l-58.892295 0c-24.068162 0-43.581588 19.526729-43.581588 43.581588S84.804455 337.471035 108.871593 337.471035z"
                fill="currentColor"
              />
            </svg>
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="volume-icon"
          >
            <path
              d="M257.493333 322.4l215.573334-133.056c24.981333-15.413333 57.877333-7.914667 73.493333 16.746667 5.301333 8.373333 8.106667 18.048 8.106667 27.914666v555.989334C554.666667 819.093333 530.784 842.666667 501.333333 842.666667c-9.994667 0-19.786667-2.773333-28.266666-8L257.493333 701.6H160c-41.237333 0-74.666667-33.013333-74.666667-73.738667V396.138667c0-40.725333 33.429333-73.738667 74.666667-73.738667h97.493333z m26.133334 58.4a32.298667 32.298667 0 0 1-16.96 4.8H160c-5.888 0-10.666667 4.714667-10.666667 10.538667v231.733333c0 5.813333 4.778667 10.538667 10.666667 10.538667h106.666667c5.994667 0 11.872 1.664 16.96 4.8L490.666667 770.986667V253.013333L283.626667 380.8zM800.906667 829.653333a32.288 32.288 0 0 1-45.248-0.757333 31.317333 31.317333 0 0 1 0.768-44.693333c157.653333-150.464 157.653333-393.962667 0-544.426667a31.317333 31.317333 0 0 1-0.768-44.682667 32.288 32.288 0 0 1 45.248-0.757333c183.68 175.306667 183.68 460.010667 0 635.317333z m-106.901334-126.186666a32.288 32.288 0 0 1-45.248-1.216 31.328 31.328 0 0 1 1.237334-44.672c86.229333-80.608 86.229333-210.56 0-291.178667a31.328 31.328 0 0 1-1.237334-44.672 32.288 32.288 0 0 1 45.248-1.216c112.885333 105.546667 112.885333 277.418667 0 382.965333z"
              fill="currentColor"
            />
          </svg>
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
import { computed, ref, watch, onMounted } from 'vue' // 补充导入 watch 和 onMounted
import { useAudio } from '../../utils/composables/music/useAudio'
import { usePlaylist } from '../../utils/composables/music/usePlaylist.ts'
import { useMediaSession } from '../../utils/composables/music/useMediaSession.ts'
import { useVolumeSlider } from '../../utils/composables/music/useVolumeSlider.ts'
import { useWheelBlocker } from '../../utils/composables/music/useWheelBlocker.ts'

const props = defineProps<{
  visible: boolean
  isDark?: boolean
}>()

// 第 28 行附近，将 defineEmits 改为：
const emit = defineEmits(['close', 'playingStateChange'])

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

// 音频逻辑
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

// 监听播放状态变化，主动通知父组件
watch(
  () => audio.isPlaying.value,
  (newVal) => {
    emit('playingStateChange', newVal)
  }
)

// 初始加载歌单
onMounted(() => {
  fetchPlaylist()
})
</script>

<style scoped lang="scss">
@import '../../../assets/css/components/player.scss';
</style>
