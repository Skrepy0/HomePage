// utils/cityPinyinMap.ts

/**
 * 城市信息类型（根据 CSV 结构定义）
 */
interface CityRow {
  id: string
  pid: string
  deep: string
  name: string
  pinyin_prefix: string
  pinyin: string
  ext_id: string
  ext_name: string
}

// 缓存映射表，避免重复加载
let pinyinMap: Map<string, string> | null = null
let loadingPromise: Promise<Map<string, string>> | null = null

/**
 * 解析 CSV 行（简单实现，不处理带引号的字段）
 * 假设 CSV 字段中不含逗号和换行符
 */
function parseCSVLine(line: string): string[] {
  return line.split(',').map((field) => field.trim().replace(/^"|"$/g, ''))
}

/**
 * 加载 CSV 数据并构建拼音->汉字映射
 */
async function loadCityData(): Promise<Map<string, string>> {
  // 已加载过，直接返回
  if (pinyinMap) return pinyinMap

  // 正在加载中，等待同一 Promise
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    // 仅在客户端执行 fetch，避免 SSR 时访问不存在的路径
    if (import.meta.client === false) {
      // 服务端返回空映射，客户端会重新加载
      return new Map()
    }

    try {
      const response = await fetch('/csv/ok_data_level3.csv')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const text = await response.text()
      // 去除 UTF-8 BOM（如果存在）
      const cleanText = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
      const lines = cleanText
        .split('\n')
        .filter((line) => line.trim().length > 0)

      if (lines.length === 0) {
        throw new Error('CSV 文件为空')
      }

      // 解析表头
      const headerLine = lines[0]
      if (!headerLine) {
        throw new Error('CSV 文件缺少表头')
      }
      const headers = parseCSVLine(headerLine)
      const nameIdx = headers.indexOf('name')
      const pinyinIdx = headers.indexOf('pinyin')

      if (nameIdx === -1 || pinyinIdx === -1) {
        throw new Error('CSV 缺少必要的列: name 或 pinyin')
      }

      const map = new Map<string, string>()

      // 遍历数据行
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        if (!line) continue
        if (!line.trim()) continue
        const fields = parseCSVLine(line)
        if (fields.length <= Math.max(nameIdx, pinyinIdx)) continue

        const name = fields[nameIdx]
        const pinyinRaw = fields[pinyinIdx]

        if (!name || !pinyinRaw) continue

        // 处理拼音：移除空格并转为小写
        const normalizedPinyin = pinyinRaw.replace(/\s/g, '').toLowerCase()
        // 只保留第一个匹配（按 CSV 顺序）
        if (!map.has(normalizedPinyin)) {
          map.set(normalizedPinyin, name)
        }
      }

      pinyinMap = map
      return map
    } catch (error) {
      console.error('加载城市数据失败:', error)
      // 返回空映射，后续调用将得到原拼音
      return new Map()
    }
  })()

  return loadingPromise
}

/**
 * 根据拼音获取城市中文名（异步）
 * @param pinyin 拼音字符串（可选，传入 undefined 或空字符串返回 '未知地点'）
 * @returns 中文城市名，未找到时返回原拼音或 '未知地点'
 */
export async function getCityNameByPinyin(pinyin?: string): Promise<string> {
  if (!pinyin) return '未知地点'
  if (pinyin === 'Taipei') return '台北'
  const map = await loadCityData()
  const normalized = pinyin.trim().toLowerCase()
  const chinese = map.get(normalized)
  return chinese ?? normalized
}

/**
 * 同步获取城市名（仅当数据已加载完成时可用）
 * 建议在确保 loadCityData 已完成后再使用，例如在 getCityNameByPinyin 之后
 */
export function getCityNameSync(pinyin?: string): string | undefined {
  if (!pinyin) return undefined
  if (!pinyinMap) return undefined
  const normalized = pinyin.trim().toLowerCase()
  return pinyinMap.get(normalized)
}

// 可选：预加载数据（可在应用启动时调用，例如在 app.vue 的 onMounted 中）
export async function preloadCityData() {
  await loadCityData()
}
