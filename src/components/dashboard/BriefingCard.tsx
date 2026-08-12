'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Zap, 
  TrendingUp, 
  Target,
  Newspaper,
  CheckCircle2,
  Clock,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface BriefingItem {
  id: string
  category: string
  categoryIcon: React.ComponentType<{ className?: string }>
  title: string
  summary: string
  importance: 1 | 2 | 3 | 4 | 5
  actionItems: string[]
  readTime: number
  url: string
  source: string
  publishedAt: string
}

const MOCK_BRIEFING: BriefingItem[] = [
  {
    id: '1',
    category: 'AI/개발',
    categoryIcon: Zap,
    title: 'Claude 3.5 Sonnet 업데이트 - 코딩 성능 15% 향상, SWE-bench 49% 달성',
    summary: '새 버전에서 함수 호출 정확도 개선, 장문 컨텍스트 처리 강화. 개발자 워크플로 크게 개선될 전망.',
    importance: 5,
    actionItems: ['새 모델 테스트해보기', '기존 프롬프트 마이그레이션 체크'],
    readTime: 2,
    url: 'https://anthropic.com/news/claude-3-5-sonnet',
    source: 'Anthropic Blog',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    category: '투자',
    categoryIcon: TrendingUp,
    title: '연준 금리 동결 전망 우세 - 다음 주 FOMC 회의 주목',
    summary: 'CPI 발표 후 금리 인하 기대 후퇴. 달러 강세 지속. 9월 인하 확률 35%로 하락.',
    importance: 4,
    actionItems: ['포트폴리오 리밸런싱 검토', '현금 비중 15% 유지'],
    readTime: 3,
    url: 'https://bloomberg.com/markets/rates-bonds',
    source: 'Bloomberg',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    category: '게임',
    categoryIcon: Target,
    title: '페르소나 5 팬텀 X - 신규 캐릭터 마코토 픽업 시작',
    summary: '한정 픽업 2주간 진행. 신규 페르소나 요한나 추가. 이벤트 던전 벨벳 룸 오픈.',
    importance: 3,
    actionItems: ['일일 미션 완료', '50연차 모아두기'],
    readTime: 1,
    url: 'https://p5x.com/notice',
    source: '공식 커뮤니티',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    category: 'AI/개발',
    categoryIcon: Zap,
    title: 'Nemotron 3 Ultra 4bit 양자화 - RTX 3090에서 8tok/s 달성',
    summary: '로컬 LLM 신기록. GPT-4급 추론 능력 유지하며 단일 카드에서 실행 가능.',
    importance: 5,
    actionItems: ['올라마로 모델 다운로드', '로컬 코딩 어시스턴트 구성'],
    readTime: 3,
    url: 'https://nvidia.com/research/nemotron',
    source: 'NVIDIA Research',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    category: '투자',
    categoryIcon: TrendingUp,
    title: '엔비디아 실적 발표 - 매출 122% 증가, 블랙웰 수요 강력',
    summary: '데이터센터 매출 $26.3B 기록. 차세대 블랙웰 칩 수요 강력. 주가 시간외 +6%.',
    importance: 4,
    actionItems: ['보유 수량 확인', '목표가 $150 유지'],
    readTime: 2,
    url: 'https://investor.nvidia.com/',
    source: 'NVIDIA IR',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
]

export function BriefingCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 text-primary">🌅</span>
          <span className="text-lg font-bold">오늘의 브리핑</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => window.location.href = '/briefing'}>
          전체 보기
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {MOCK_BRIEFING.slice(0, 5).map((item) => (
            <BriefingItemCard key={item.id} item={item} />
          ))}
        </div>
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/briefing'}>
            브리핑 전체 보기 (5개)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function BriefingItemCard({ item }: { item: any }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        item.importance >= 4 ? 'border-primary/30 bg-primary/5' : ''
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <span className="h-5 w-5 text-primary mt-0.5 shrink-0">📌</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">{item.category}</span>
            <span className="text-xs text-muted-foreground">{formatRelativeTime(item.publishedAt)}</span>
            {item.importance >= 4 && <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive animate-pulse">긴급</span>}
            {[...Array(item.importance)].map((_, i) => <span key={i} className="text-yellow-500 text-xs">★</span>)}
          </div>
          <h4 className="font-medium text-sm mb-1 line-clamp-1">{item.title}</h4>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.summary}</p>
          
          {item.actionItems.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {item.actionItems.map((action: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                >
                  ✓ {action}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground">{item.readTime}분 읽기 · {item.source}</span>
            <button 
              className="ml-auto text-xs text-primary hover:underline"
              onClick={(e) => { e.stopPropagation(); window.open(item.url, '_blank') }}
            >
              원문 보기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}