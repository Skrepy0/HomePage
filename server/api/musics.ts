export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const playlistId = (query.id as string) || '3779629' // 默认歌单ID
  const server = (query.server as string) || 'kuwo'

  try {
    // 请求第三方 API 获取歌单详情（包含播放链接）
    const apiUrl = `https://api.injahow.cn/meting/?type=playlist&id=${playlistId}&server=${server}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const songsRaw = await res.json()
    if (!Array.isArray(songsRaw)) throw new Error('返回数据格式错误')

    // 转换为前端期望的数据结构
    const songs = songsRaw
      .map((song: any) => ({
        id: song.id,
        name: song.name,
        artist: song.artist.split('/'),
        play_url: song.url, // 关键：播放链接已包含
        pic_url: song.pic, // 封面链接
      }))
      .filter((song) => song.play_url) // 过滤掉没有播放链接的歌曲

    if (!songs.length) throw new Error('没有可播放的歌曲')

    return { code: 200, data: songs }
  } catch (error) {
    console.error('获取歌单失败:', error)
    return { code: 500, message: '获取歌单失败，请稍后重试' }
  }
})
