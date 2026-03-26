export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const playlistId = (query.id as string) || '3779629' // 默认歌单ID
  const server = (query.server as string) || 'kuwo'

  try {
    const apiUrl = `https://api.injahow.cn/meting/?type=playlist&id=${playlistId}&server=${server}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const songsRaw = await res.json()
    if (!Array.isArray(songsRaw)) throw new Error('返回数据格式错误')

    const songs = songsRaw
      .map((song: any) => ({
        id: song.id,
        name: song.name,
        artist: song.artist.split('/'),
        play_url: song.url,
        pic_url: song.pic,
      }))
      .filter((song) => song.play_url)

    if (!songs.length) throw new Error('没有可播放的歌曲')

    return { code: 200, data: songs }
  } catch (error) {
    console.error('获取歌单失败:', error)
    return { code: 500, message: '获取歌单失败，请稍后重试' }
  }
})
