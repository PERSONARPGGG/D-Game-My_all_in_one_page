'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  Zap, TrendingUp, Target, Newspaper, 
  Code, Server, Layout, FlaskConical,
  DollarSign, Globe, Shield, Gamepad2,
  BookOpen, BarChart
} from 'lucide-react'

const categories = [
  { id: 'ai-dev', label: 'AI·LLM', icon: Zap, color: 'bg-purple-500', count: 24, slug: 'ai-dev', group: 'dev-ai' },
  { id: 'backend-infra', label: '백엔드·인프라', icon: Server, color: 'bg-blue-500', count: 18, slug: 'backend-infra', group: 'dev-ai' },
  { id: 'frontend', label: '프론트엔드', icon: Layout, color: 'bg-cyan-500', count: 12, slug: 'frontend', group: 'dev-ai' },
  { id: 'dev-workflow', label: '개발 워크플로', icon: FlaskConical, color: 'bg-violet-500', count: 8, slug: 'dev-workflow', group: 'dev-ai' },
  { id: 'startup-revenue', label: '창업·수익화', icon: DollarSign, color: 'bg-amber-500', count: 6, slug: 'startup-revenue', group: 'dev-ai' },
  { id: 'us-stocks-etf', label: '미국주식·ETF', icon: TrendingUp, color: 'bg-green-500', count: 32, slug: 'us-stocks-etf', group: 'invest' },
  { id: 'macro-fed', label: '매크로·연준', icon: Globe, color: 'bg-teal-500', count: 14, slug: 'macro-fed', group: 'invest' },
  { id: 'real-estate', label: '부동산·REIT', icon: Shield, color: 'bg-orange-500', count: 5, slug: 'real-estate', group: 'invest' },
  { id: 'game-playing', label: '플레이중 게임', icon: Gamepad2, color: 'bg-pink-500', count: 15, slug: 'game-playing', group: 'game' },
  { id: 'game-official', label: '공식 채널', icon: BookOpen, color: 'bg-indigo-500', count: 8, slug: 'game-official', group: 'game' },
  { id: 'news-breaking', label: '실시간 속보', icon: Newspaper, color: 'bg-red-500', count: 12, slug: 'news-breaking', group: 'news' },
  { id: 'trends', label: '트렌드·이슈', icon: Globe, color: 'bg-slate-500', count: 20, slug: 'trends', group: 'news' },
]

export function CategoryGrid() {
  return (
    <Card>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">카테고리별 피드</h3>
          <span className="text-xs text-muted-foreground">{categories.length}개 카테고리</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                className={cn(
                  'relative p-3 rounded-lg border text-left hover:shadow-md transition-all',
                  'group focus:ring-2 focus:ring-primary'
                )}
                onClick={() => window.location.href = `/feed?cat=${cat.slug}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('h-8 w-8 rounded-lg flex items-center justify-center', cat.color)}>
                    <Icon className="h-4 w-4 text-white" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{cat.label}</p>
                    <p className="text-xs text-muted-foreground">{cat.count}개 새 글</p>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                    이동 →
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}