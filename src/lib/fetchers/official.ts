import type { FetcherResult, FetcherContext } from './base'
import { registerFetcher, normalizeArticle, deduplicateArticles } from './base'
import * as cheerio from 'cheerio'

interface GameOfficialConfig {
  gameId: string
  name: string
  urls: Array<{ type: 'patch' | 'event' | 'news' | 'coupon'; url: string; selector?: string }>
}

async function fetchGameOfficial(context: FetcherContext): Promise<FetcherResult> {
  const { source, signal } = context
  const errors: string[] = []
  const articles: FetcherResult['articles'] = []

  try {
    const config = source.config as unknown as GameOfficialConfig
    if (!config?.urls?.length) return { articles: [], errors: ['URL 설정 없음'] }

    for (const urlConfig of config.urls) {
      try {
        const response = await fetch(urlConfig.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          signal,
        })
        if (!response.ok) continue

        const html = await response.text()
        const $ = cheerio.load(html)

        const items = urlConfig.selector 
          ? $(urlConfig.selector).toArray()
          : $('article, .post, .notice, .patch-item, .event-item, .news-item, li').toArray()

        for (const item of items.slice(0, 20)) {
          const $item = $(item)
          const titleEl = $item.find('a, h1, h2, h3, .title, .subject').first()
          const title = titleEl.text().trim() || $item.text().trim().slice(0, 100)
          const href = titleEl.attr('href') || $item.find('a').first().attr('href')

          if (!title || title.length < 5) continue

          let url = href
          if (url && !url.startsWith('http')) {
            const base = new URL(urlConfig.url)
            url = `${base.origin}${url.startsWith('/') ? '' : '/'}${url}`
          }

          const content = $item.find('.content, .summary, .excerpt, p').first().text().trim().slice(0, 500)
          const dateStr = $item.find('time, .date, .time, .published').attr('datetime') || $item.find('time, .date, .time, .published').text().trim()

          articles.push(normalizeArticle({
            title,
            url: url || urlConfig.url,
            summary: content || title,
            content: '',
            author: config.name,
            publishedAt: parseDate(dateStr) || new Date().toISOString(),
            categorySlug: source.categorySlug,
            rawData: {
              gameId: config.gameId,
              gameName: config.name,
              sourceType: urlConfig.type,
              sourceUrl: urlConfig.url,
            },
          }, source))
        }
      } catch (e) {
        errors.push(`${urlConfig.url}: ${e instanceof Error ? e.message : '파싱 실패'}`)
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      errors.push(error.message)
    }
  }

  return { articles: deduplicateArticles(articles), errors }
}

function parseDate(dateStr?: string): string | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

registerFetcher('official', fetchGameOfficial)