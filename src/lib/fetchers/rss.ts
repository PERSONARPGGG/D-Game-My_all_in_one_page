import Parser from 'rss-parser'
import type { FetcherResult, FetcherContext } from './base'
import { registerFetcher, normalizeArticle, deduplicateArticles } from './base'

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; InfoHub/1.0; +https://github.com/PERSONARPGGG/D-Game-My_all_in_one_page)',
  },
})

async function fetchRSS(context: FetcherContext): Promise<FetcherResult> {
  const { source } = context
  const errors: string[] = []
  const articles: FetcherResult['articles'] = []

  try {
    const feed = await parser.parseURL(source.url)

    for (const item of feed.items.slice(0, 50)) {
      if (!item.link || !item.title) continue

      const publishedAt = item.pubDate || item.isoDate || new Date().toISOString()
      const content = item.content || item.contentSnippet || item.summary || ''

      articles.push(normalizeArticle({
        title: item.title.trim(),
        url: item.link.trim(),
        summary: item.contentSnippet || item.summary?.slice(0, 300),
        content: content.slice(0, 5000),
        thumbnail: item.enclosure?.url || feed.image?.url,
        author: item.creator || item.author || feed.title,
        publishedAt: new Date(publishedAt).toISOString(),
        categorySlug: source.categorySlug,
        rawData: {
          guid: item.guid,
          categories: item.categories,
          enclosure: item.enclosure,
        },
      }, source))
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'RSS 파싱 실패')
  }

  return { articles: deduplicateArticles(articles), errors }
}

registerFetcher('rss', fetchRSS)