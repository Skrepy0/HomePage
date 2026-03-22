// utils/weather.ts
export const Zhixiashi = ['北京', '上海', '天津', '重庆', '香港', '澳门']
export const weatherTextToIcon: Record<string, string> = {
  晴: 'wi:day-sunny',
  多云: 'wi:day-cloudy',
  阴: 'wi:cloud',
  阵雨: 'wi:day-showers',
  雷阵雨: 'wi:day-thunderstorm',
  小雨: 'wi:day-rain',
  中雨: 'wi:rain',
  大雨: 'wi:rain-wind',
  暴雨: 'wi:heavy-rain',
  小雪: 'wi:day-snow',
  中雪: 'wi:snow',
  大雪: 'wi:snow-wind',
  雾: 'wi:fog',
  霾: 'wi:smoke',
  沙尘暴: 'wi:sandstorm',
  浮尘: 'wi:windy',
  强沙尘暴: 'wi:sandstorm',
  扬沙: 'wi:windy',
  雷雨: 'wi:day-thunderstorm',
  雨夹雪: 'wi:rain-mix',
  冰雹: 'wi:hail',
}

export // 根据温度返回对应颜色
const getColorByTemp = (temp: number): string => {
  if (isNaN(temp)) return 'rgba(255,255,255,0.9)'
  if (temp <= 0) return '#8ab3ff'
  if (temp < 10) return '#b0d4ff'
  if (temp < 20) return '#3fdd6a'
  if (temp < 30) return '#ffb347'
  return '#ff6b6b'
}
