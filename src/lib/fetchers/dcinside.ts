import * as cheerio from 'cheerio'
import type { FetcherResult, FetcherContext } from './base'
import { registerFetcher, normalizeArticle, deduplicateArticles } from './base'

const DCINSIDE_BASE = 'https://gall.dcinside.com/mgallery/board/lists'
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

interface DCInsideConfig {
  galleryId: string
  page?: number
  keywordFilter?: string[]
  excludeKeywords?: string[]
}

async function fetchDCInside(context: FetcherContext): Promise<FetcherResult> {
  const { source, signal } = context
  const errors: string[] = []
  const articles: FetcherResult['articles'] = []

  try {
    const config = (source.config as unknown as DCInsideConfig) || {}
    const galleryId = config.galleryId || source.id
    const page = config.page || 1
    const keywordFilter = config.keywordFilter || []
    const excludeKeywords = config.excludeKeywords || ['공지', '광고', '홍보', '설문', '이벤트']

    const url = `${DCINSIDE_BASE}?id=${galleryId}&page=${page}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Referer': 'https://gall.dcinside.com/',
      },
      signal,
    })

    if (!response.ok) throw new Error(`DCInside 요청 실패: ${response.status}`)

    const html = await response.text()
    const $ = cheerio.load(html)

    const rows = $('tbody tr.ub-content, tbody tr:not(.notice)').toArray()

    for (const row of rows.slice(0, 30)) {
      const $row = $(row)
      const titleEl = $row.find('.gall_tit a, .gall_subject a').first()
      const title = titleEl.text().trim()
      const href = titleEl.attr('href')

      if (!title || !href) continue

      // 제외 키워드 체크
      if (excludeKeywords.some(k => title.includes(k))) continue
      // 포함 키워드 체크 (설정된 경우)
      if (keywordFilter.length > 0 && !keywordFilter.some(k => title.includes(k))) continue

      const url = href.startsWith('http') ? href : `https://gall.dcinside.com${href}`
      const author = $row.find('.gall_writer').text().trim() || $row.find('.gall_nick').text().trim()
      const dateStr = $row.find('.gall_date').attr('title') || $row.find('.gall_date').text().trim()
      const views = parseInt($row.find('.gall_count').text().trim()) || 0
      const recommends = parseInt($row.find('.gall_recommend').text().trim()) || 0

      articles.push(normalizeArticle({
        title,
        url,
        summary: title,
        content: '',
        author: author || 'DCInside',
        publishedAt: parseDCDate(dateStr),
        categorySlug: source.categorySlug,
        rawData: {
          galleryId,
          views,
          recommends,
          isNotice: $row.hasClass('notice'),
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

function parseDCDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString()
  
  // 형식: "2024.01.15 14:30" 또는 "14:30" (오늘)
  const today = new Date()
  const match = dateStr.match(/(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})/)
  if (match) {
    return new Date(
      parseInt(match[1]),
      parseInt(match[2]) - 1,
      parseInt(match[3]),
      parseInt(match[4]),
      parseInt(match[5])
    ).toISOString()
  }

  // 시간만 있는 경우 오늘 날짜에 시간 적용
  const timeMatch = dateStr.match(/(\d{2}):(\d{2})/)
  if (timeMatch) {
    const d = new Date(today)
    d.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0)
    return d.toISOString()
  }

  return today.toISOString()
}

registerFetcher('dcinside', fetchDCInside)