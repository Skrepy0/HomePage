import { ref } from 'vue'

interface LanguageStats {
  [language: string]: number
}

interface TopLanguage {
  name: string
  bytes: number
  percent?: number
}

// 可选：限制并发请求数（无需额外安装库，手动实现）
async function promiseLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = []
  const executing: Promise<void>[] = []

  for (const task of tasks) {
    const p = task().then((result) => {
      results.push(result)
    })
    executing.push(p)

    if (executing.length >= limit) {
      await Promise.race(executing)
      // 移除已完成的 promise
      executing.splice(
        executing.findIndex((e) => e === p),
        1
      )
    }
  }
  await Promise.all(executing)
  return results
}

export function useGithubLanguages(username: string, token?: string) {
  const languages = ref<TopLanguage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 请求头：优先使用 token，提高速率限制
  const getHeaders = () => {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  /**
   * 获取最近一个月的日期范围（仅日期部分，用于比较）
   */
  const getLastMonthRange = () => {
    const now = new Date()
    const oneMonthAgo = new Date(now)
    oneMonthAgo.setMonth(now.getMonth() - 1)
    // 归一化到当天 00:00:00，只比较日期
    oneMonthAgo.setHours(0, 0, 0, 0)
    now.setHours(23, 59, 59, 999)
    return {
      since: oneMonthAgo,
      until: now,
    }
  }

  /**
   * 通过用户事件 API 获取最近一个月内有 PushEvent 的仓库（去重）
   */
  const fetchRecentReposViaEvents = async (): Promise<string[]> => {
    const { since } = getLastMonthRange()
    let page = 1
    const reposSet = new Set<string>()
    let hasMore = true

    while (hasMore) {
      // 用户公共事件 API（默认返回最近 90 天的事件，分页）
      const url = `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`
      const response = await fetch(url, { headers: getHeaders() })

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`)
      }

      const events = await response.json()
      if (!Array.isArray(events) || events.length === 0) {
        hasMore = false
        break
      }

      for (const event of events) {
        // 只处理 PushEvent
        if (event.type === 'PushEvent') {
          const eventDate = new Date(event.created_at)
          if (eventDate >= since) {
            // 仓库全名格式: owner/repo，提取 repo 名称
            const repoFullName = event.repo.name
            const repoName = repoFullName.split('/')[1]
            reposSet.add(repoName)
          }
        }
      }

      // 如果返回数量小于请求数量，说明没有下一页了
      if (events.length < 100) {
        hasMore = false
      } else {
        page++
      }
    }

    return Array.from(reposSet)
  }

  /**
   * 可选回退：获取用户所有仓库（当事件 API 失败或返回空时使用）
   */
  const fetchAllReposFallback = async (): Promise<string[]> => {
    let page = 1
    const repos: string[] = []
    let hasMore = true

    while (hasMore) {
      const url = `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`
      const response = await fetch(url, { headers: getHeaders() })
      if (!response.ok) {
        throw new Error(`Failed to fetch all repos: ${response.status}`)
      }
      const data = await response.json()
      if (data.length === 0) {
        hasMore = false
      } else {
        repos.push(...data.map((repo: any) => repo.name))
        page++
      }
    }
    return repos
  }

  /**
   * 获取单个仓库的语言统计
   */
  const fetchRepoLanguages = async (
    repoName: string
  ): Promise<LanguageStats> => {
    const url = `https://api.github.com/repos/${username}/${repoName}/languages`
    const response = await fetch(url, { headers: getHeaders() })
    if (!response.ok) {
      // 如果某个仓库失败，抛出错误（上层捕获后返回空对象）
      throw new Error(`Failed to fetch languages for ${repoName}`)
    }
    return await response.json()
  }

  /**
   * 处理原始语言统计数据：排序、取前6、计算百分比
   */
  const processLanguages = (combined: LanguageStats) => {
    const sorted = Object.entries(combined)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, bytes]) => ({ name, bytes }))

    const totalBytes = sorted.reduce((sum, item) => sum + item.bytes, 0)
    languages.value = sorted.map((item) => ({
      ...item,
      percent: totalBytes ? (item.bytes / totalBytes) * 100 : 0,
    }))
  }

  /**
   * 主函数：获取最近一个月活跃仓库的语言统计
   */
  const fetchTopLanguages = async (useFallback = false) => {
    loading.value = true
    error.value = null
    try {
      let repos: string[] = []

      if (!useFallback) {
        try {
          repos = await fetchRecentReposViaEvents()
          if (repos.length === 0) {
            console.warn(
              '未找到最近一个月内有 Push 事件的仓库，尝试获取所有仓库'
            )
            repos = await fetchAllReposFallback()
          }
        } catch (err) {
          console.warn('事件 API 失败，回退到获取所有仓库', err)
          repos = await fetchAllReposFallback()
        }
      } else {
        repos = await fetchAllReposFallback()
      }

      if (repos.length === 0) {
        languages.value = []
        error.value = '未找到任何仓库'
        return
      }

      // 并发获取语言统计，控制并发数为 5，单个仓库失败不影响整体
      const tasks = repos.map(
        (repo) => () =>
          fetchRepoLanguages(repo).catch((err) => {
            console.warn(`仓库 ${repo} 语言统计获取失败:`, err)
            return {} as LanguageStats
          })
      )
      const languageStatsArray = await promiseLimit(tasks, 5)

      // 合并所有语言字节数
      const combined: LanguageStats = {}
      for (const stats of languageStatsArray) {
        for (const [lang, bytes] of Object.entries(stats)) {
          combined[lang] = (combined[lang] || 0) + bytes
        }
      }

      if (Object.keys(combined).length === 0) {
        error.value = '无法获取任何语言统计数据'
        languages.value = []
        return
      }

      processLanguages(combined)
    } catch (err: any) {
      error.value = err.message || '获取语言统计失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    languages, // 响应式语言列表（前6种）
    loading, // 加载状态
    error, // 错误信息
    fetchTopLanguages, // 手动触发获取（可传入 useFallback 强制使用全量仓库）
  }
}
