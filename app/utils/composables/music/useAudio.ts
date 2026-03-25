export function useAudio(
  currentSong: Ref<Song | undefined>,
  volume: Ref<number>,
  onEnded: () => void
) {
  const audio = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false) // 初始为 false
  const currentTime = ref(0)
  const duration = ref(0)

  // 播放方法
  const play = () => {
    if (!audio.value) return
    audio.value
      .play()
      .then(() => {
        isPlaying.value = true
      })
      .catch((e) => {
        console.warn('播放失败', e)
        isPlaying.value = false // 失败时重置为 false
        // 可选：触发 onEnded 自动下一首
        onEnded()
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
      onEnded()
    })
    audioEl.addEventListener('error', () => {
      console.warn('音频错误，自动下一首')
      onEnded()
    })

    audio.value = audioEl
    // 关键：初始状态不自动播放，仅当用户主动点击或切换歌曲后保持播放状态时才播放
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
    initAudio,
    play,
    pause,
    togglePlay,
    syncVolume,
    seek,
  }
}
