// composables/useGithubLanguages.ts
import { ref } from 'vue'

interface LanguageStats {
  [language: string]: number
}

interface TopLanguage {
  name: string
  bytes: number
  percent?: number
}

export function useGithubLanguages(username: string) {
  const languages = ref<TopLanguage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取最近一个月的日期范围
   */
  const getLastMonthRange = () => {
    const now = new Date()
    const oneMonthAgo = new Date(now)
    oneMonthAgo.setMonth(now.getMonth() - 1)
    return {
      since: oneMonthAgo.toISOString(),
      until: now.toISOString(),
    }
  }

  /**
   * 获取用户最近一个月内提交过的仓库列表（去重）
   */
  const fetchRecentRepos = async (): Promise<string[]> => {
    const { since } = getLastMonthRange()
    let page = 1
    const reposSet = new Set<string>()
    let hasMore = true

    // 搜索用户最近一个月的提交事件
    while (hasMore) {
      // 使用 GitHub 搜索 API 查找该用户的 PushEvent
      const url = `https://api.github.com/search/commits?q=author:${username}+committer-date:>${since}&per_page=100&page=${page}`
      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github.cloak-preview+json',
          // 可选：添加 token 提高限制
          // 'Authorization': `token ${YOUR_TOKEN}`
        },
      })

      if (!response.ok) {
        // 如果搜索 API 失败，回退到获取所有仓库（但不推荐）
        console.warn('搜索 API 失败，回退到获取所有仓库')
        return fetchAllReposFallback()
      }

      const data = await response.json()
      if (!data.items || data.items.length === 0) {
        hasMore = false
        break
      }

      // 提取仓库名
      for (const item of data.items) {
        if (item.repository && item.repository.name) {
          reposSet.add(item.repository.name)
        }
      }

      // 检查是否还有下一页
      if (data.items.length < 100) {
        hasMore = false
      } else {
        page++
      }
    }

    return Array.from(reposSet)
  }

  /**
   * 回退方案：获取所有仓库（如果搜索 API 不可用）
   */
  const fetchAllReposFallback = async (): Promise<string[]> => {
    let page = 1
    let repos: string[] = []
    let hasMore = true

    while (hasMore) {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`,
        { headers: {} }
      )
      if (!response.ok)
        throw new Error(`Failed to fetch repos: ${response.status}`)

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
   * 获取指定仓库的语言统计
   */
  const fetchRepoLanguages = async (
    repoName: string
  ): Promise<LanguageStats> => {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/languages`,
      { headers: {} }
    )
    if (!response.ok)
      throw new Error(`Failed to fetch languages for ${repoName}`)
    return await response.json()
  }

  /**
   * 获取最近一个月的语言使用统计
   */
  const fetchTopLanguages = async () => {
    loading.value = true
    error.value = null
    try {
      // 1. 获取最近一个月内有提交的仓库
      const repos = await fetchRecentRepos()

      if (repos.length === 0) {
        // 如果没有找到最近提交的仓库，回退到所有仓库
        console.warn('未找到最近提交的仓库，使用所有仓库统计')
        const allRepos = await fetchAllReposFallback()
        const languageStatsArray = await Promise.all(
          allRepos.map(fetchRepoLanguages)
        )
        const combined: LanguageStats = {}
        for (const stats of languageStatsArray) {
          for (const [lang, bytes] of Object.entries(stats)) {
            combined[lang] = (combined[lang] || 0) + bytes
          }
        }
        processLanguages(combined)
      } else {
        // 2. 并发获取这些仓库的语言统计
        const languageStatsArray = await Promise.all(
          repos.map(fetchRepoLanguages)
        )
        // 3. 合并统计
        const combined: LanguageStats = {}
        for (const stats of languageStatsArray) {
          for (const [lang, bytes] of Object.entries(stats)) {
            combined[lang] = (combined[lang] || 0) + bytes
          }
        }
        processLanguages(combined)
      }
    } catch (err: any) {
      error.value = err.message
      console.error('获取语言统计失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理语言统计数据
   */
  const processLanguages = (combined: LanguageStats) => {
    // 转换为数组并排序
    const sorted = Object.entries(combined)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3) // 取前n种语言
      .map(([name, bytes]) => ({ name, bytes }))

    // 计算百分比
    const totalBytes = sorted.reduce((sum, item) => sum + item.bytes, 0)
    languages.value = sorted.map((item) => ({
      ...item,
      percent: totalBytes ? (item.bytes / totalBytes) * 100 : 0,
    }))
  }

  return { languages, loading, error, fetchTopLanguages }
}
