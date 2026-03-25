import Meting from '@meting/core'

const meting = new Meting('netease')
meting.format(true)

interface Song {
  id: number
  name: string
  artist: string[]
  album: string
  url_id: number
  pic_id: string
  lyric_id: number
  source: string
  play_url: string
  pic_url: string
}

// 简单内存缓存（生产环境建议使用 Redis 或持久化缓存）
let cache: { data: Song[]; timestamp: number } | null = null
const CACHE_TTL = 30 * 60 * 1000 // 30 分钟

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const playlistId = (query.id as string) || '3779629'

  // 检查缓存
  if (cache && cache.timestamp + CACHE_TTL > Date.now()) {
    return { code: 200, data: cache.data }
  }

  try {
    // 获取歌单原始数据
    const playlistResult = await meting.playlist(playlistId)
    const songsRaw: any[] = JSON.parse(playlistResult)

    // 并发获取每首歌的播放链接和封面（使用 Promise.allSettled 避免单曲失败影响整体）
    const settledResults = await Promise.allSettled(
      songsRaw.map(async (song) => {
        const [urlResult, picResult] = await Promise.all([
          meting.url(song.url_id, 320),
          meting.pic(song.pic_id, 300),
        ])
        const playUrl = JSON.parse(urlResult).url
        const picUrl = JSON.parse(picResult).url
        return {
          ...song,
          play_url: playUrl,
          pic_url: picUrl,
        }
      })
    )

    // 过滤出成功的歌曲，失败的忽略（可打印日志）
    const songs: Song[] = settledResults
      .filter(
        (r): r is PromiseFulfilledResult<Song> => r.status === 'fulfilled'
      )
      .map((r) => r.value)

    // 更新缓存
    cache = { data: songs, timestamp: Date.now() }

    return { code: 200, data: songs }
  } catch (error) {
    console.error('获取歌单失败:', error)
    return { code: 500, message: '获取歌单失败' }
  }
})
