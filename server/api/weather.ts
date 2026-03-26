export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { location } = body

  if (!location) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Location Lost',
    })
  }

  // ✅ 从环境变量读取 API Key
  const apiKey = useRuntimeConfig().apiKey // 注意环境变量名
  console.log(apiKey)
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
      // 记录详细错误，便于调试
      console.error(
        `心知天气 API 返回错误: ${weatherRes.status} ${weatherRes.statusText}`
      )
      throw new Error(`HTTP ${weatherRes.status}`)
    }

    const rawData = await weatherRes.json()

    // ✅ 数据清洗：提取前端需要的字段
    if (!rawData.results || rawData.results.length === 0) {
      throw new Error('未找到天气数据')
    }
    const result = rawData.results[0]
    return {
      city: result.location.name,
      temperature: result.now.temperature,
      weather: result.now.text,
      humidity: result.now.humidity,
      windScale: result.now.wind_scale,
    }
  } catch (err) {
    // 记录详细错误（生产环境可接入日志服务）
    console.error('获取天气失败:', err)
    throw createError({
      statusCode: 500,
      statusMessage: '获取天气失败，请稍后重试',
    })
  }
})
