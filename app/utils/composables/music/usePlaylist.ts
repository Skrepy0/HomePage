import { computed, ref } from 'vue'
import { Song } from '~/types/music'

export function usePlaylist(onSongChange: () => void) {
  const songs = ref<Song[]>([])
  const loading = ref(true)
  const error = ref('')
  const currentIndex = ref(0)
  const mode = ref<'loop' | 'random' | 'single'>('loop')
  const platforms = ['netease', 'kugou', 'baidu', 'kuwo']
  const currentSong = computed(() => songs.value[currentIndex.value])
  const hasPrev = computed(
    () => songs.value.length > 1 && currentIndex.value > 0
  )
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

  const fetchPlaylist = async () => {
    loading.value = true
    error.value = ''
    try {
      const randomIndex = Math.floor(Math.random() * platforms.length)
      const res = await fetch(`/api/musics?platform=${platforms[randomIndex]}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data.code === 200 && data.data?.length) {
        songs.value = data.data
        // 初始歌曲
        currentIndex.value = 0
        onSongChange()
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

  const prev = () => {
    if (!hasPrev.value) return
    currentIndex.value--
    onSongChange() // 触发外部传入的回调（即 audio.initAudio）
  }

  const next = () => {
    if (!hasNext.value) {
      if (mode.value === 'loop') {
        currentIndex.value = 0
        onSongChange()
      }
      return
    }
    currentIndex.value++
    onSongChange()
  }

  const toggleMode = () => {
    if (mode.value === 'loop') mode.value = 'random'
    else if (mode.value === 'random') mode.value = 'single'
    else mode.value = 'loop'
  }

  return {
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
    prev,
    next,
    toggleMode,
  }
}
