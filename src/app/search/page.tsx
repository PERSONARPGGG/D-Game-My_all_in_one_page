'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  Search, Filter, MoreHorizontal, 
  ExternalLink, Clock, Tag, ChevronDown,
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface Article {
  id: string
  title: string
  summary: string
  category: string
  categoryColor: string
  source: string
  publishedAt: string
  importance: number
  isBreaking: boolean
  isRead: boolean
  isBookmarked?: boolean
  aiSummary?: string
  aiTags?: string[]
  aiActions?: string[]
  url: string
}

const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Claude 3.5 Sonnet 업데이트 - 코딩 성능 15% 향상, SWE-bench 49% 달성',
    summary: '새 버전에서 함수 호출 정확도 개선, 장문 컨텍스트 처리 강화. 개발자 워크플로 크게 개선될 전망.',
    category: 'AI/개발',
    categoryColor: 'bg-purple-500',
    source: 'Anthropic Blog',
    publishedAt: '2024-01-15T08:30:00Z',
    importance: 5,
    isBreaking: true,
    isRead: false,
    aiSummary: '클로드 3.5 소넷이 코딩 벤치마크에서 49% 달성. 함수 호출과 장문 처리 대폭 개선.',
    aiTags: ['클로드', '코딩', 'AI모델', '업데이트'],
    aiActions: ['새 모델 테스트', '기존 프롬프트 마이그레이션 체크'],
    url: 'https://anthropic.com/news/claude-3-5-sonnet',
  },
  {
    id: '2',
    title: '연준 금리 동결 전망 우세 - 다음 주 FOMC 회의 주목',
    summary: 'CPI 발표 후 금리 인하 기대 후퇴. 달러 강세 지속. 9월 인하 확률 35%로 하락.',
    category: '투자',
    categoryColor: 'bg-green-500',
    source: 'Bloomberg',
    publishedAt: '2024-01-15T07:15:00Z',
    importance: 4,
    isBreaking: true,
    isRead: false,
    aiSummary: '연준 금리 동결 우세. 달러 강세, 9월 인하 확률 하락.',
    aiTags: ['연준', '금리', 'FOMC', '달러'],
    aiActions: ['포트폴리오 리밸런싱 검토', '현금 비중 15% 유지'],
    url: 'https://bloomberg.com/markets/rates-bonds',
  },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'latest' | 'importance' | 'unread'>('latest')
  const [viewMode, setViewMode] = useState<'card' | 'compact'>('card')

  const categories = [
    { id: 'all', label: '전체', color: 'bg-slate-500' },
    { id: 'ai-dev', label: 'AI·LLM', color: 'bg-purple-500' },
    { id: 'us-stocks-etf', label: '투자', color: 'bg-green-500' },
    { id: 'game-playing', label: '게임', color: 'bg-pink-500' },
    { id: 'news-breaking', label: '뉴스', color: 'bg-red-500' },
  ]

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    const timer = setTimeout(() => {
      setIsSearching(true)
      // 실제로는 API 호출
      const filtered = MOCK_ARTICLES.filter((article) => 
        article.title.toLowerCase().includes(query.toLowerCase()) || 
        article.summary.toLowerCase().includes(query.toLowerCase()) ||
        article.category.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered)
      setIsSearching(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [query])

  const filteredResults = searchResults.filter((article) => {
    if (activeCategory !== 'all' && article.category !== activeCategory) return false
    return true
  }).sort((a, b) => {
    if (sortBy === 'importance') return b.importance - a.importance
    if (sortBy === 'unread') return (a.isRead ? 1 : 0) - (b.isRead ? 1 : 0)
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">통합 검색</h1>
          <p className="text-muted-foreground text-sm">
            {query ? `${filteredResults.length}개 결과` : '키워드를 입력해 검색하세요'}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="제목, 요약, 내용, 카테고리, 태그 검색... (예: cat:ai-dev, tag:클로드, date:2024-01)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-4 py-3 border rounded-lg bg-background text-base w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                카테고리: {activeCategory === 'all' ? '전체' : activeCategory}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {['all', 'ai-dev', 'us-stocks-etf', 'game-playing', 'news-breaking'].map((c) => (
                <DropdownMenuItem
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={activeCategory === c ? 'bg-accent' : ''}
                >
                  {c === 'all' && '전체'}
                  {c === 'ai-dev' && 'AI·LLM'}
                  {c === 'us-stocks-etf' && '투자'}
                  {c === 'game-playing' && '게임'}
                  {c === 'news-breaking' && '뉴스'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                정렬: {sortBy === 'latest' ? '최신순' : sortBy === 'importance' ? '중요도' : '안읽은순'}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {['latest', 'importance', 'unread'].map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => setSortBy(s as any)}
                  className={sortBy === s ? 'bg-accent' : ''}
                >
                  {s === 'latest' && '🕐 최신순'}
                  {s === 'importance' && '⭐ 중요도순'}
                  {s === 'unread' && '📖 안읽은순'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {query && (
        <div className="space-y-3">
          {isSearching ? (
            <div className="text-center py-12 text-muted-foreground">검색 중...</div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              검색 결과가 없습니다. 다른 키워드를 시도해보세요.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResults.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ArticleCard({ article }: { article: any }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${article.categoryColor}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted">{article.category}</span>
            <span className="text-xs text-muted-foreground">{article.source}</span>
            <span className="text-xs text-muted-foreground">{formatRelativeTime(article.publishedAt)}</span>
            {article.isBreaking && <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">긴급</span>}
            {[...Array(article.importance)].map((_, i) => <span key={i} className="text-yellow-500 text-xs">★</span>)}
          </div>
          <h3 className="font-medium text-lg mb-2">{article.title}</h3>
          <p className="text-muted-foreground mb-3 line-clamp-2">{article.summary}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {(article.aiTags || []).map((tag: string, i: number) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
              원문 보기 →
            </a>
            <button className="text-sm text-primary hover:underline" onClick={() => {}}>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
