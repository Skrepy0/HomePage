import { ref } from 'vue'

export function useGitHubCommits(owner: string, repo: string) {
    const commitCount = ref<number | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchCommitCount = async () => {
        loading.value = true
        error.value = null
        try {
            // 使用 per_page=1 只获取第一页，然后从 Link 头中解析最后一页页码
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
                headers: {
                    // 如果你有 GitHub Token，可以放在这里提高限制（但注意安全）
                    // 'Authorization': 'token YOUR_GITHUB_TOKEN'
                }
            })
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`)

            const linkHeader = response.headers.get('Link')
            if (!linkHeader) {
                // 如果提交数少于 per_page，则直接从返回数组长度获取
                const data = await response.json()
                commitCount.value = data.length
            } else {
                // 解析 Link 头获取最后一页的 page 参数
                const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/)
                if (lastPageMatch && lastPageMatch[1]) {
                    commitCount.value = parseInt(lastPageMatch[1], 10)
                } else {
                    // 如果没有 last，说明只有一页，则当前页就是总数
                    const data = await response.json()
                    commitCount.value = data.length
                }
            }
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    return { commitCount, loading, error, fetchCommitCount }
}