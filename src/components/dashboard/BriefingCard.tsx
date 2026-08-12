'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Sunrise, 
  Sunset, 
  Zap, 
  TrendingUp, 
  Target,
  BookOpen,
  CheckCircle2,
  Clock
} from 'lucide-react'

interface BriefingItem {
  id: string
  category: string
  categoryIcon: React.ComponentType<{ className?: string }>
  title: string
  summary: string
  importance: number
  actionItems: string[]
  readTime: number
}

const MORNING_BRIEFING: BriefingItem[] = [
  {
    id: '1',
    category: 'AI/개발',
    categoryIcon: Zap,
    title: 'Claude 3.5 Sonnet 업데이트 - 코딩 성능 15% 향상',
    summary: '새 버전에서 SWE-bench 점수 49% 달성. 함수 호출 정확도 개선, 장문 컨텍스트 처리 강화.',
    importance: 5,
    actionItems: ['새 모델 테스트해보기', '기존 프롬프트 마이그레이션 체크'],
    readTime: 2,
  },
  {
    id: '2',
    category: '투자',
    categoryIcon: TrendingUp,
    title: '연준 금리 동결 전망 우세 - 다음 주 FOMC 주목',
    summary: 'CPI 발표 후 금리 인하 기대 후퇴. 9월 인하 확률 60% → 35%로 하락. 달러 강세 지속.',
    importance: 4,
    actionItems: ['포트폴리오 리밸런싱 검토', '현금 비중 15% 유지'],
    readTime: 3,
  },
  {
    id: '3',
    category: '게임',
    categoryIcon: Target,
    title: '페르소나 5 팬텀 X - 신규 캐릭터 "마코토" 업데이트',
    summary: '한정 픽업 2주간 진행. 신규 페르소나 "요한나" 추가. 이벤트 던전 "벨벳 룸" 오픈.',
    importance: 3,
    actionItems: ['일일 미션 완료', '픽업 전 50연차 모아두기'],
    readTime: 1,
  },
]

const EVENING_BRIEFING: BriefingItem[] = [
  {
    id: '4',
    category: 'AI/개발',
    categoryIcon: Zap,
    title: '로컬 LLM 신기록 - Nemotron 3 Ultra 4bit 양자화 8tok/s 달성',
    summary: 'RTX 3090 단일 카드에서 8토큰/초 추론. GPT-4 급 추론 능력 유지하며 로컬 실행 가능.',
    importance: 5,
    actionItems: ['올라마로 모델 다운로드', '로컬 코딩 어시스턴트 구성'],
    readTime: 3,
  },
  {
    id: '5',
    category: '투자',
    categoryIcon: TrendingUp,
    title: '엔비디아 실적 발표 - 매출 122% 증가, 가이던스 상향',
    summary: '데이터센터 매출 $26.3B 기록. 차세대 블랙웰 칩 수요 강력. 주가 시간외 +6%.',
    importance: 4,
    actionItems: ['보유 수량 확인', '목표가 $150 유지'],
    readTime: 2,
  },
]

export function BriefingCard() {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning')
  const items = activeTab === 'morning' ? MORNING_BRIEFING : EVENING_BRIEFING
  const TabIcon = activeTab === 'morning' ? Sunrise : Sunset

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <TabIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">
            {activeTab === 'morning' ? '🌅 아침 브리핑' : '🌙 저녁 브리핑'}
          </CardTitle>
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {['morning', 'evening'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'morning' | 'evening')}
              className={cn(
                'px-3 py-1 rounded text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab === 'morning' ? '🌅 아침' : '🌙 저녁'}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'p-4 rounded-lg border transition-all',
                item.importance >= 4 && 'border-primary/30 bg-primary/5'
              )}
            >
              <div className="flex items-start gap-3">
                <item.categoryIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary">{item.category}</span>
                    <span className="text-xs text-muted-foreground">{item.readTime}분 읽기</span>
                    {[...Array(item.importance)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-xs">★</span>
                    ))}
                  </div>
                  <h4 className="font-medium text-sm mb-1 line-clamp-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.summary}</p>
                  {item.actionItems.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.actionItems.map((action, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                        >
                          ✓ {action}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { useState } from 'react'