import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const searchParams = request.nextUrl.searchParams

  const category = searchParams.get('cat')
  const search = searchParams.get('q')
  const sort = searchParams.get('sort') || 'latest'
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const importance = searchParams.get('importance')
  const unreadOnly = searchParams.get('unread') === 'true'
  const breakingOnly = searchParams.get('breaking') === 'true'

  let query = supabase
    .from('articles')
    .select('*, sources(name, type)')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('category_slug', category)
  }

  if (breakingOnly) {
    query = query.eq('is_breaking', true)
  }

  if (importance) {
    query = query.gte('ai_importance', parseInt(importance))
  }

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,content.ilike.%${search}%`)
  }

  if (sort === 'importance') {
    query = query.order('ai_importance', { ascending: false })
  } else if (sort === 'unread') {
    query = query.order('is_read', { ascending: true })
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ 
    articles: data || [], 
    total: count || 0,
    limit,
    offset,
  })
}