import { createClient } from '@/lib/supabase/server'
import { fetchSource, fetcherRegistry } from '@/lib/fetchers'
import { enrichArticles } from '@/lib/ai/summarizer'
import type { Source, Article } from '@/types/domain'

export interface PipelineResult {
  sourceId: string
  sourceName: string
  fetched: number
  saved: number
  enriched: number
  errors: string[]
  durationMs: number
}

export async function runPipelineForSource(source: Source): Promise<PipelineResult> {
  const startTime = Date.now()
  const result: PipelineResult = {
    sourceId: source.id,
    sourceName: source.name,
    fetched: 0,
    saved: 0,
    enriched: 0,
    errors: [],
    durationMs: 0,
  }

  const supabase = createClient()

  try {
    // 1. Fetch
    const fetchResult = await fetchSource(source)
    result.fetched = fetchResult.articles.length
    result.errors.push(...fetchResult.errors)

    if (fetchResult.articles.length === 0) {
      result.durationMs = Date.now() - startTime
      return result
    }

    // 2. Convert to Article format with IDs
    const articles: Article[] = fetchResult.articles.map(a => ({
      ...a,
      id: crypto.randomUUID(),
      fetchedAt: new Date().toISOString(),
      aiSummary: '',
      aiTags: [],
      aiActions: [],
      aiImportance: 3,
      isBreaking: false,
      isRead: false,
      isBookmarked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    // 3. AI Enrichment
    const enriched = await enrichArticles(articles)
    result.enriched = enriched.filter(a => a.aiSummary).length

    // 4. Save to Supabase (upsert by URL)
    const { data: existingUrls } = await supabase
      .from('articles')
      .select('url')
      .in('url', enriched.map(a => a.url))

    const existingUrlSet = new Set(existingUrls?.map(u => u.url) || [])
    const newArticles = enriched.filter(a => !existingUrlSet.has(a.url))

    if (newArticles.length > 0) {
      const { error } = await supabase
        .from('articles')
        .upsert(newArticles.map(a => ({
          ...a,
          rawData: a.rawData || {},
        })), { onConflict: 'url' })

      if (error) throw error
      result.saved = newArticles.length
    }

    // 5. Update source last_fetched
    await supabase
      .from('sources')
      .update({ 
        last_fetched_at: new Date().toISOString(),
        error_count: result.errors.length > 0 ? result.errors.length : 0,
      })
      .eq('id', source.id)

  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : '파이프라인 오류')
  }

  result.durationMs = Date.now() - startTime
  return result
}

export async function runFullPipeline(): Promise<PipelineResult[]> {
  const supabase = createClient()
  
  const { data: sources, error } = await supabase
    .from('sources')
    .select('*')
    .eq('is_active', true)

  if (error) throw error
  if (!sources?.length) return []

  const results = await Promise.allSettled(
    sources.map(source => runPipelineForSource(source as Source))
  )

  return results.map((r, i) => 
    r.status === 'fulfilled' ? r.value : {
      sourceId: sources[i].id,
      sourceName: sources[i].name,
      fetched: 0,
      saved: 0,
      enriched: 0,
      errors: [r.status === 'rejected' ? r.reason?.message : '알 수 없는 오류'],
      durationMs: 0,
    }
  )
}

export async function runBreakingCheck(): Promise<Article[]> {
  const supabase = createClient()
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .gte('published_at', oneHourAgo)
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
    .limit(10)

  return articles || []
}

export function getAvailableFetchers(): string[] {
  return Array.from(fetcherRegistry.keys())
}