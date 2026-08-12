import type { Article, Source } from '@/types/domain'

export type FetcherArticle = Omit<Article, 'id' | 'fetchedAt' | 'aiSummary' | 'aiTags' | 'aiActions' | 'aiImportance' | 'aiCategorySlug' | 'isBreaking' | 'isRead' | 'isBookmarked' | 'createdAt' | 'updatedAt'>

export interface FetcherResult {
  articles: FetcherArticle[]
  errors: string[]
}

export interface FetcherContext {
  source: Source
  signal?: AbortSignal
}

export type FetcherFunction = (context: FetcherContext) => Promise<FetcherResult>

export const fetcherRegistry = new Map<string, FetcherFunction>()

export function registerFetcher(type: string, fn: FetcherFunction) {
  fetcherRegistry.set(type, fn)
}

export function getFetcher(type: string): FetcherFunction | undefined {
  return fetcherRegistry.get(type)
}

export async function fetchSource(source: Source): Promise<FetcherResult> {
  const fetcher = fetcherRegistry.get(source.type)
  if (!fetcher) {
    return { articles: [], errors: [`알 수 없는 소스 타입: ${source.type}`] }
  }

  try {
    return await fetcher({ source })
  } catch (error) {
    return { articles: [], errors: [error instanceof Error ? error.message : '알 수 없는 오류'] }
  }
}

export function normalizeArticle(article: Partial<Article>, source: Source): FetcherArticle {
  return {
    sourceId: source.id,
    categorySlug: article.categorySlug || source.categorySlug,
    title: article.title || '제목 없음',
    url: article.url || '',
    summary: article.summary,
    content: article.content,
    thumbnail: article.thumbnail,
    author: article.author,
    publishedAt: article.publishedAt || new Date().toISOString(),
    rawData: article.rawData || {},
  }
}

export function deduplicateArticles(articles: FetcherArticle[]): FetcherArticle[] {
  const seen = new Set<string>()
  return articles.filter(article => {
    const key = article.url.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function filterByKeywords(articles: FetcherArticle[], keywords: string[], exclude: boolean = false): FetcherArticle[] {
  if (keywords.length === 0) return articles
  const lowerKeywords = keywords.map(k => k.toLowerCase())
  return articles.filter(article => {
    const text = `${article.title} ${article.summary || ''}`.toLowerCase()
    const matches = lowerKeywords.some(k => text.includes(k))
    return exclude ? !matches : matches
  })
}