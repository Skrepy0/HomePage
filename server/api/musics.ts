export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const server = (query.platform as string) || 'kuwo'
  console.log(server)
  const maxAttempts = 6
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const playlistId = Math.floor(Math.random() * 1000000000)
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
        .filter((song) => song.play_url !== '')

      if (songs.length > 0) {
        return { code: 200, data: songs }
      }
      // 如果没有歌曲，继续下一次尝试
    } catch (error) {
      console.warn(`尝试 ${attempts + 1} 失败:`, error)
    }
    attempts++
  }

  return { code: 500, message: '获取歌单失败，请稍后重试' }
})
