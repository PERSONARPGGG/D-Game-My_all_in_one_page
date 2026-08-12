import type { FetcherResult, FetcherContext } from './base'
import { registerFetcher, normalizeArticle, deduplicateArticles } from './base'

const REDDIT_BASE = 'https://www.reddit.com'
const USER_AGENT = 'InfoHub/1.0 (by u/InfoHubBot)'

async function fetchReddit(context: FetcherContext): Promise<FetcherResult> {
  const { source, signal } = context
  const errors: string[] = []
  const articles: FetcherResult['articles'] = []

  try {
    const config = source.config as { subreddit?: string; listing?: 'hot' | 'new' | 'top'; timeframe?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all'; limit?: number } || {}
    const subreddit = config.subreddit || 'programming'
    const listing = config.listing || 'hot'
    const timeframe = config.timeframe || 'day'
    const limit = config.limit || 25

    let url = `${REDDIT_BASE}/r/${subreddit}/${listing}.json?limit=${limit}&raw_json=1`
    if (listing === 'top') url += `&t=${timeframe}`

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal,
    })

    if (!response.ok) throw new Error(`Reddit API error: ${response.status}`)

    const data = await response.json()
    const posts = data.data?.children || []

    for (const post of posts) {
      const p = post.data
      if (!p.url || !p.title || p.is_self) continue

      const isExternal = !p.url.startsWith(`https://www.reddit.com/r/${subreddit}`)
      const articleUrl = isExternal ? p.url : `https://www.reddit.com${p.permalink}`

      articles.push(normalizeArticle({
        title: p.title,
        url: articleUrl,
        summary: p.selftext?.slice(0, 300) || p.title,
        content: p.selftext?.slice(0, 5000) || '',
        thumbnail: p.preview?.images?.[0]?.source?.url?.replace(/&/g, '&') || p.thumbnail,
        author: p.author,
        publishedAt: new Date(p.created_utc * 1000).toISOString(),
        categorySlug: source.categorySlug,
        rawData: {
          subreddit: p.subreddit,
          score: p.score,
          numComments: p.num_comments,
          permalink: p.permalink,
          isVideo: p.is_video,
          domain: p.domain,
        },
      }, source))
    }
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      errors.push(error.message)
    }
  }

  return { articles: deduplicateArticles(articles), errors }
}

registerFetcher('reddit', fetchReddit)