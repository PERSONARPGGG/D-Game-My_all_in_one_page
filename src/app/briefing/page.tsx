'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Sunrise, Sunset, Zap, TrendingUp, Target, 
  Newspaper, BookOpen, CheckCircle2, Clock,
  Plus, Minus, Edit, Trash2
} from 'lucide-react'

const MORNING_SECTIONS = [
  { id: 'core', label: '핵심 3개', icon: Sunrise, color: 'text-yellow-500' },
  { id: 'actions', label: '오늘 할 일', icon: CheckCircle2, color: 'text-green-500' },
  { id: 'ai', label: 'AI/개발', icon: Zap, color: 'text-purple-500' },
  { id: 'breaking', label: '긴급 속보', icon: Newspaper, color: 'text-red-500' },
  { id: 'invest', label: '투자 현황', icon: TrendingUp, color: 'text-emerald-500' },
  { id: 'game', label: '게임', icon: Target, color: 'text-pink-500' },
  { id: 'routine', label: '루틴', icon: Clock, color: 'text-blue-500' },
]

const EVENING_SECTIONS = [
  { id: 'core', label: '핵심 3개', icon: Sunset, color: 'text-orange-500' },
  { id: 'actions', label: '오늘 실천', icon: CheckCircle2, color: 'text-green-500' },
  { id: 'ai', label: 'AI/개발', icon: Zap, color: 'text-purple-500' },
  { id: 'breaking', label: '긴급 속보', icon: Newspaper, color: 'text-red-500' },
  { id: 'invest', label: '투자 현황', icon: TrendingUp, color: 'text-emerald-500' },
  { id: 'game', label: '게임', icon: Target, color: 'text-pink-500' },
  { id: 'preview', label: '내일 미리보기', icon: BookOpen, color: 'text-indigo-500' },
]

const MORNING_ITEMS = {
  core: [
    { title: 'Claude 3.5 Sonnet 코딩 성능 15% 향상', category: 'AI/개발', importance: 5, url: '#' },
    { title: '연준 금리 동결 전망 - 9월 인하 확률 35%', category: '투자', importance: 4, url: '#' },
    { title: '페르소나 5 팬텀X 마코토 픽업 시작', category: '게임', importance: 3, url: '#' },
  ],
  actions: [
    { title: '네모트론 3 울트라 로컬 테스트', category: 'AI/개발', done: false },
    { title: '포트폴리오 리밸런싱 검토', category: '투자', done: true },
    { title: '페르소나 일일 미션 완료', category: '게임', done: false },
  ],
  ai: [
    { title: 'Nemotron 3 Ultra 4bit 8tok/s 달성', category: 'AI/개발', importance: 5, url: '#' },
    { title: '로컬 LLM 올라마 설정 가이드', category: '워크플로', importance: 4, url: '#' },
    { title: 'AI 코딩 에이전트 비교: Cursor vs Cline', category: '워크플로', importance: 3, url: '#' },
  ],
  breaking: [
    { title: '엔비디아 실적 서프라이즈 - 주가 +6%', category: '투자', importance: 5, url: '#' },
    { title: '오픈AI o1-preview 공식 출시', category: 'AI/개발', importance: 4, url: '#' },
  ],
  invest: [
    { title: '보유 종목: NVDA +4.2%, QQQ +1.1%', category: '포트폴리오', importance: 3, url: '#' },
    { title: '배당 캘린더: 다음 주 AAPL 배당락', category: '배당', importance: 2, url: '#' },
  ],
  game: [
    { title: '메타포 리판타지오 10/11 출시 확정', category: '게임', importance: 4, url: '#' },
    { title: '페르소나 5 팬텀X 벨벳 룸 이벤트', category: '게임', importance: 3, url: '#' },
  ],
  routine: [
    { title: '아침 스트레칭 10분', category: '건강', done: true },
    { title: '물 500ml 마시기', category: '건강', done: false },
    { title: '일일 계획 검토 5분', category: '생산성', done: true },
  ],
}

const EVENING_ITEMS = {
  core: [
    { title: 'Nemotron 3 Ultra 4bit 8tok/s 달성', category: 'AI/개발', importance: 5, url: '#' },
    { title: '엔비디아 실적 서프라이즈 - 주가 +6%', category: '투자', importance: 5, url: '#' },
    { title: '오픈AI o1-preview 공식 출시', category: 'AI/개발', importance: 4, url: '#' },
  ],
  actions: [
    { title: '네모트론 3 울트라 로컬 테스트', category: 'AI/개발', done: true },
    { title: '포트폴리오 리밸런싱 완료', category: '투자', done: true },
    { title: '페르소나 일일 미션 완료', category: '게임', done: true },
  ],
  ai: [
    { title: '로컬 LLM 신기록 - 4bit 양자화로 8tok/s', category: 'AI/개발', importance: 5, url: '#' },
    { title: 'AI 코딩 에이전트 실전 비교', category: '워크플로', importance: 4, url: '#' },
  ],
  breaking: [
    { title: '비트코인 $65K 돌파 - ETF 순유입 기록', category: '투자', importance: 4, url: '#' },
  ],
  invest: [
    { title: '포트폴리오 일일 수익 +2.3%', category: '포트폴리오', importance: 3, url: '#' },
  ],
  game: [
    { title: '페르소나 5 팬텀X 벨벳 룸 이벤트 종료 임박', category: '게임', importance: 3, url: '#' },
  ],
  preview: [
    { title: '내일 FOMC 회의 - 금리 결정', category: '투자', importance: 5, url: '#' },
    { title: '애플 신제품 발표 이벤트', category: '기술', importance: 3, url: '#' },
  ],
}

export default function BriefingPage() {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'custom'>('morning')
  const [customSections, setCustomSections] = useState(MORNING_SECTIONS.map(s => s.id))

  const sections = activeTab === 'morning' ? MORNING_SECTIONS : activeTab === 'evening' ? EVENING_SECTIONS : 
    MORNING_SECTIONS.filter(s => customSections.includes(s.id))

  const itemsMap = activeTab === 'evening' ? EVENING_ITEMS : MORNING_ITEMS

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">오늘의 브리핑</h1>
          <p className="text-muted-foreground text-sm">
            {activeTab === 'morning' ? '🌅 아침 브리핑' : activeTab === 'evening' ? '🌙 저녁 브리핑' : '⚙️ 커스텀 브리핑'}
          </p>
        </div>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab as any}>
          <TabsList>
            <TabsTrigger value="morning">🌅 아침</TabsTrigger>
            <TabsTrigger value="evening">🌙 저녁</TabsTrigger>
            <TabsTrigger value="custom">⚙️ 커스텀</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === 'custom' && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {MORNING_SECTIONS.map((section) => (
                <label
                  key={section.id}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors',
                    customSections.includes(section.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-accent'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={customSections.includes(section.id)}
                    onChange={(e) => setCustomSections(
                      e.target.checked
                        ? [...customSections, section.id]
                        : customSections.filter(id => id !== section.id)
                    )}
                    className="sr-only peer"
                  />
                  <section.icon className={cn('h-4 w-4', section.color)} />
                  <span className="text-sm">{section.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sections.map((section) => (
          <BriefingSection key={section.id} section={section} items={(itemsMap as Record<string, any>)[section.id] || []} />
        ))}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/feed'}>
          전체 피드 보기
        </Button>
        <Button className="flex-1" onClick={() => {}}>
          브리핑 공유
        </Button>
      </div>
    </div>
  )
}

function BriefingSection({ section, items }: { section: typeof MORNING_SECTIONS[0]; items: any[] }) {
  const [expanded, setExpanded] = useState(true)
  const Icon = section.icon

  return (
    <Card className={cn('overflow-hidden', !expanded && 'h-auto')}>
      <CardHeader className={cn('pb-2 cursor-pointer', !expanded && 'pb-3')}>
        <div className="flex items-center justify-between" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <Icon className={cn('h-5 w-5', section.color)} />
            <CardTitle className="text-lg">{section.label}</CardTitle>
            <Badge variant="secondary" className="text-xs">{items.length}개</Badge>
          </div>
          <span className="text-muted-foreground">{expanded ? '▲' : '▼'}</span>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={i}
                className={cn(
                  'p-3 rounded-lg border hover:bg-accent/50 transition-colors',
                  item.importance >= 4 && 'border-primary/30 bg-primary/5'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">{item.category}</span>
                      {[...Array(item.importance || 3)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-xs">★</span>
                      ))}
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                    {item.done !== undefined && (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-primary"
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.done ? '완료됨' : '미완료'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
