import Meting from '@meting/core'

const meting = new Meting('netease')
meting.format(true)

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const playlistId = (query.id as string) || '3779629'

  try {
    // 获取歌单原始数据（无播放链接）
    const playlistResult = await meting.playlist(playlistId)
    const songsRaw: any[] = JSON.parse(playlistResult)

    // 并发获取每首歌的播放链接（每次请求都重新获取）
    const settledResults = await Promise.allSettled(
      songsRaw.map(async (song) => {
        // 获取播放URL（不缓存，实时请求）
        const urlResult = await meting.url(song.url_id, 320)
        const playUrl = JSON.parse(urlResult).url

        // 获取封面（封面相对稳定，但也可实时获取，不缓存也无妨）
        const picResult = await meting.pic(song.pic_id, 300)
        const picUrl = JSON.parse(picResult).url

        return {
          id: song.id,
          name: song.name,
          artist: song.artist,
          album: song.album,
          play_url: playUrl,
          pic_url: picUrl,
        }
      })
    )

    // 过滤出成功的歌曲
    const songs = settledResults
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map((r) => r.value)

    return { code: 200, data: songs }
  } catch (error) {
    console.error('获取歌单失败:', error)
    return { code: 500, message: '获取歌单失败' }
  }
})
