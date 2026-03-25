import { watch, Ref } from 'vue'
import { Song } from '~/types/music'

export function useMediaSession(
  currentSong: Ref<Song | undefined>,
  isPlaying: Ref<boolean>,
  play: () => void,
  pause: () => void,
  prev: () => void,
  next: () => void,
  seek: (offset: number) => void
) {
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
    navigator.mediaSession.setActionHandler('play', play)
    navigator.mediaSession.setActionHandler('pause', pause)
    navigator.mediaSession.setActionHandler('previoustrack', prev)
    navigator.mediaSession.setActionHandler('nexttrack', next)
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      if (details.seekOffset) seek(-details.seekOffset)
    })
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      if (details.seekOffset) seek(details.seekOffset)
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

  const dispose = () => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', null)
      navigator.mediaSession.setActionHandler('pause', null)
      navigator.mediaSession.setActionHandler('previoustrack', null)
      navigator.mediaSession.setActionHandler('nexttrack', null)
    }
  }

  return { dispose }
}
