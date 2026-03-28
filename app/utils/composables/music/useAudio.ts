import { Song } from '~/types/music'
import { ref, Ref } from 'vue'
import { useToast } from '../useToast'

export function useAudio(
  currentSong: Ref<Song | undefined>,
  volume: Ref<number>,
  onEnded: () => void
) {
  const audio = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const error = ref<string | null>(null)

  const play = () => {
    if (!audio.value) return
    error.value = null // 清除之前的错误
    audio.value
      .play()
      .then(() => {
        isPlaying.value = true
      })
      .catch((e) => {
        console.warn('播放失败', e)
        isPlaying.value = false
        error.value = '播放失败，请稍后重试'
      })
  }

  const pause = () => {
    if (!audio.value) return
    audio.value.pause()
    isPlaying.value = false
  }

  const togglePlay = () => {
    if (isPlaying.value) pause()
    else play()
  }

  const initAudio = () => {
    if (audio.value) {
      audio.value.pause()
      audio.value = null
    }
    error.value = null // 重置错误
    const song = currentSong.value
    if (!song || !song.play_url) {
      error.value = '歌曲链接无效'
      return
    }

    const audioEl = new Audio(song.play_url)
    audioEl.volume = volume.value

    audioEl.addEventListener('timeupdate', () => {
      currentTime.value = audioEl.currentTime
    })
    audioEl.addEventListener('durationchange', () => {
      duration.value = audioEl.duration
    })
    audioEl.addEventListener('ended', () => {
      onEnded()
    })
    audioEl.addEventListener('error', () => {
      console.warn('音频错误')
      error.value = '音频加载失败，请检查网络或稍后重试'
    })
    audio.value = audioEl
    if (isPlaying.value) {
      play()
    }
  }

  const syncVolume = () => {
    if (audio.value) audio.value.volume = volume.value
  }

  const seek = (e: MouseEvent) => {
    if (!audio.value || !duration.value) return
    const bar = e.currentTarget as HTMLElement
    const rect = bar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    audio.value.currentTime = percent * duration.value
  }

  return {
    audio,
    isPlaying,
    currentTime,
    duration,
    error, // 暴露错误状态
    initAudio,
    play,
    pause,
    togglePlay,
    syncVolume,
    seek,
  }
}
