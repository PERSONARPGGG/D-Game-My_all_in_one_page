'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AlertTriangle, TrendingUp, Zap, Target, Newspaper } from 'lucide-react'

const breakingNews = [
  { id: 1, category: '긴급', title: '연준 파월 의장 "인플레이션 여전히 높다" - 금리 인하 연기 시사', importance: 5, time: '10분 전' },
  { id: 2, category: '기술', title: '오픈AI o1-preview 공식 출시 - 복잡한 추론 작업에서 GPT-4o 압도', importance: 4, time: '1시간 전' },
  { id: 3, category: '게임', title: '메타포 리판타지오 출시일 확정 - 10월 11일 글로벌 동시 발매', importance: 3, time: '3시간 전' },
  { id: 4, category: '투자', title: '비트코인 $64K 돌파 - ETF 순유입 5일 연속 기록', importance: 3, time: '5시간 전' },
]

const categoryIcons = {
  긴급: AlertTriangle,
  기술: Zap,
  게임: Target,
  투자: TrendingUp,
  뉴스: Newspaper,
}

export function BreakingNews() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          🔥 실시간 브레이킹
        </CardTitle>
      </CardHeader>
      <div className="p-4 pt-0">
        <div className="space-y-2">
          {breakingNews.map((news) => {
            const Icon = categoryIcons[news.category as keyof typeof categoryIcons] || Newspaper
            return (
              <div
                key={news.id}
                className={`p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer ${news.importance >= 4 ? 'border-destructive/30 bg-destructive/5' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${news.importance >= 4 ? 'text-destructive' : 'text-primary'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">
                        {news.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{news.time}</span>
                      {[...Array(news.importance)].map((_, i) => (
                        <span key={i} className={news.importance >= 4 ? 'text-destructive' : 'text-yellow-500'} text-xs>★</span>
                      ))}
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{news.title}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}