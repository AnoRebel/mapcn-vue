export default defineEventHandler(async () => {
  try {
    const data = await $fetch<{ stargazers_count: number }>(
      'https://api.github.com/repos/AnoRebel/mapcn-vue',
      { headers: { 'User-Agent': 'mapcn-vue' } }
    )
    const formattedCount =
      data.stargazers_count >= 1000
        ? `${(data.stargazers_count / 1000).toFixed(1)}k`
        : String(data.stargazers_count)
    return { count: data.stargazers_count, formatted: formattedCount }
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error)
    return { count: 0, formatted: '0' }
  }
})
