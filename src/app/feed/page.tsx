'use client'

import { cn } from '@/lib/utils'
import { X, ChevronDown, ChevronUp, Search, Filter, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
  aiSummary?: string
  aiTags?: string[]
  aiActions?: string[]
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
  },
  {
    id: '3',
    title: '페르소나 5 팬텀 X - 신규 캐릭터 마코토 픽업 시작',
    summary: '한정 픽업 2주간 진행. 신규 페르소나 요한나 추가. 이벤트 던전 벨벳 룸 오픈.',
    category: '게임',
    categoryColor: 'bg-pink-500',
    source: '공식 커뮤니티',
    publishedAt: '2024-01-15T06:00:00Z',
    importance: 3,
    isBreaking: false,
    isRead: true,
    aiSummary: '페르소나 5 팬텀X 마코토 픽업 시작. 요한나 페르소나 추가.',
    aiTags: ['페르소나', '가챠', '이벤트'],
    aiActions: ['일일 미션 완료', '50연차 모아두기'],
  },
  {
    id: '4',
    title: 'Nemotron 3 Ultra 4bit 양자화 - RTX 3090에서 8tok/s 달성',
    summary: '로컬 LLM 신기록. GPT-4급 추론 능력 유지하며 단일 카드에서 실행 가능.',
    category: 'AI/개발',
    categoryColor: 'bg-purple-500',
    source: 'NVIDIA Research',
    publishedAt: '2024-01-14T22:30:00Z',
    importance: 5,
    isBreaking: false,
    isRead: false,
    aiSummary: '로컬 네모트론 3 울트라 4bit 8토큰/초 달성. RTX 3090 단일 카드.',
    aiTags: ['로컬LLM', '네모트론', '양자화', '엔비디아'],
    aiActions: ['올라마로 다운로드', '로컬 코딩 어시스턴트 구성'],
  },
  {
    id: '5',
    title: '엔비디아 실적 발표 - 매출 122% 증가, 블랙웰 수요 강력',
    summary: '데이터센터 매출 $26.3B 기록. 차세대 블랙웰 칩 수요 강력. 주가 시간외 +6%.',
    category: '투자',
    categoryColor: 'bg-green-500',
    source: 'NVIDIA IR',
    publishedAt: '2024-01-14T21:00:00Z',
    importance: 4,
    isBreaking: false,
    isRead: false,
    aiSummary: '엔비디아 매출 122% 증가. 블랙웰 수요 강력. 가이던스 상향.',
    aiTags: ['엔비디아', '실적', '블랙웰', 'AI칩'],
    aiActions: ['보유 수량 확인', '목표가 $150 유지'],
  },
]

const CATEGORIES = [
  { id: 'all', label: '전체', color: 'bg-slate-500' },
  { id: 'ai', label: 'AI/개발', color: 'bg-purple-500' },
  { id: 'invest', label: '투자', color: 'bg-green-500' },
  { id: 'game', label: '게임', color: 'bg-pink-500' },
  { id: 'news', label: '뉴스', color: 'bg-red-500' },
]

export function FeedPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'importance' | 'unread'>('latest')
  const [viewMode, setViewMode] = useState<'card' | 'compact'>('card')

  const filteredArticles = MOCK_ARTICLES.filter((article) => {
    if (activeCategory !== 'all') {
      const catMap: Record<string, string> = { ai: 'AI/개발', invest: '투자', game: '게임', news: '뉴스' }
      if (article.category !== catMap[activeCategory]) return false
    }
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !article.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false
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
          <h1 className="text-2xl font-bold">피드</h1>
          <p className="text-muted-foreground text-sm">{filteredArticles.length}개 글</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg bg-background w-64 md:w-80 text-sm"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
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
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'card' ? 'compact' : 'card')}>
            {viewMode === 'card' ? '📋' : '📄'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {CATEGORIES.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className={cn('h-2 w-2 rounded-full mr-2', cat.color)} />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="pt-4">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className={cn('space-y-3', viewMode === 'compact' && 'space-y-1')}>
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    compact={viewMode === 'compact'}
                  />
                ))}
                {filteredArticles.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    조건에 맞는 글이 없습니다.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ArticleCard({ article, compact }: { article: Article; compact: boolean }) {
  const [expanded, setExpanded] = useState(false)

  if (compact) {
    return (
      <div
        className={cn(
          'p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer',
          article.isRead && 'opacity-60',
          article.isBreaking && 'border-destructive/30 bg-destructive/5'
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <span className={cn('h-2 w-2 rounded-full mt-1.5 shrink-0', article.categoryColor)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted">{article.category}</span>
              <span className="text-xs text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString('ko-KR')}</span>
              {article.isBreaking && <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">긴급</span>}
              {[...Array(article.importance)].map((_, i) => <span key={i} className="text-yellow-500 text-xs">★</span>)}
            </div>
            <p className="text-sm font-medium line-clamp-1">{article.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{article.summary}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all',
        article.isRead && 'opacity-70',
        article.isBreaking && 'border-destructive/30 bg-destructive/5'
      )}
    >
      <CardContent className="p-4 pt-0">
        <div className="flex items-start gap-3">
          <span className={cn('h-2 w-2 rounded-full mt-1.5 shrink-0', article.categoryColor)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">{article.category}</span>
              <span className="text-xs text-muted-foreground">{article.source}</span>
              <span className="text-xs text-muted-foreground">{new Date(article.publishedAt).toLocaleString('ko-KR')}</span>
              {article.isBreaking && <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive animate-pulse">🔴 긴급</span>}
              {[...Array(article.importance)].map((_, i) => <span key={i} className="text-yellow-500 text-xs">★</span>)}
            </div>
            <h3 className="font-medium text-lg mb-2">{article.title}</h3>
            <p className="text-muted-foreground mb-3 line-clamp-2">{article.summary}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {(article.aiTags || []).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>

            <div className="border-t pt-3">
              <Button variant="ghost" size="sm" className="mr-2" onClick={() => {}}>
                {article.isRead ? '✓ 읽음' : '○ 읽음 처리'}
              </Button>
              <Button variant="ghost" size="sm" className="mr-2" onClick={() => {}}>
                🔖 저장
              </Button>
              <Button variant="ghost" size="sm" className="mr-2" onClick={() => setExpanded(!expanded)}>
                {expanded ? '▲ 접기' : '▼ 상세'}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {}}>하이라이트 추가</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {}}>액션 아이템으로 추가</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {}}>공유</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => {}}>숨기기</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {expanded && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg space-y-3 border-t">
                {article.aiSummary && (
                  <div>
                    <p className="text-xs font-medium text-primary mb-1">🤖 AI 요약</p>
                    <p className="text-sm">{article.aiSummary}</p>
                  </div>
                )}
                {article.aiActions && article.aiActions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-primary mb-1">⚡ 추천 액션</p>
                    <div className="flex flex-wrap gap-1">
                      {article.aiActions.map((action, i) => (
                        <Badge key={i} variant="outline" className="text-xs cursor-pointer" onClick={() => {}}>
                          + {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}