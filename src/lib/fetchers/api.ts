import type { FetcherResult, FetcherContext } from './base'
import type { CategorySlug } from '@/types/domain'
import { registerFetcher, normalizeArticle, deduplicateArticles } from './base'

interface APIConfig {
  endpoint: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  params?: Record<string, string>
  dataPath?: string
  titleField: string
  urlField: string
  summaryField?: string
  dateField?: string
  categoryField?: string
}

async function fetchAPI(context: FetcherContext): Promise<FetcherResult> {
  const { source, signal } = context
  const errors: string[] = []
  const articles: FetcherResult['articles'] = []

  try {
    const config = source.config as unknown as APIConfig
    if (!config?.endpoint) return { articles: [], errors: ['엔드포인트 설정 없음'] }

    const url = new URL(config.endpoint)
    if (config.params) {
      Object.entries(config.params).forEach(([k, v]) => url.searchParams.set(k, v))
    }

    const response = await fetch(url.toString(), {
      method: config.method || 'GET',
      headers: {
        'User-Agent': 'InfoHub/1.0',
        'Accept': 'application/json',
        ...config.headers,
      },
      signal,
    })

    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`)

    const data = await response.json()
    const items = config.dataPath ? data[config.dataPath] : (Array.isArray(data) ? data : [data])

    for (const item of items.slice(0, 50)) {
      const title = item[config.titleField]
      const url = item[config.urlField]

      if (!title || !url) continue

      articles.push(normalizeArticle({
        title: String(title).trim(),
        url: String(url).trim(),
        summary: config.summaryField ? String(item[config.summaryField] || '').slice(0, 300) : String(title),
        content: '',
        author: source.name,
        publishedAt: config.dateField && item[config.dateField] ? new Date(item[config.dateField]).toISOString() : new Date().toISOString(),
        categorySlug: config.categoryField && item[config.categoryField] ? String(item[config.categoryField]) as CategorySlug : source.categorySlug,
        rawData: { ...item, apiSource: source.id },
      }, source))
    }
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      errors.push(error.message)
    }
  }

  return { articles: deduplicateArticles(articles), errors }
}

registerFetcher('api', fetchAPI)