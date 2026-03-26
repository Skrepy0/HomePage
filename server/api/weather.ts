export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { location } = body

  if (!location) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Location Lost',
    })
  }

  const apiKey = useRuntimeConfig().apiKey
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: '服务配置错误：缺少 API 密钥',
    })
  }

  try {
    const url = `https://api.seniverse.com/v3/weather/now.json?key=${apiKey}&location=${encodeURIComponent(location)}&language=zh-Hans&unit=c`
    const weatherRes = await fetch(url)

    if (!weatherRes.ok) {
      console.error(
        `心知天气 API 返回错误: ${weatherRes.status} ${weatherRes.statusText}`
      )
      throw new Error(`HTTP ${weatherRes.status}`)
    }

    const rawData = await weatherRes.json()

    if (!rawData.results || rawData.results.length === 0) {
      throw new Error('未找到天气数据')
    }
    const result = rawData.results[0]
    const path = result.location.path.split(',')
    return {
      city: `${path[2]} ${path[1]}`,
      temperature: result.now.temperature,
      weather: result.now.text,
      humidity: result.now.humidity,
      windScale: result.now.wind_scale,
    }
  } catch (err) {
    console.error('获取天气失败:', err)
    throw createError({
      statusCode: 500,
      statusMessage: '获取天气失败，请稍后重试',
    })
  }
})
