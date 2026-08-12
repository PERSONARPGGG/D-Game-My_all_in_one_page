'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Plus, Settings, Download, Upload, RefreshCw, Zap, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const quickActions = [
  { label: '새 글 작성', icon: Plus, action: 'write', variant: 'default' as const },
  { label: '강제 동기화', icon: RefreshCw, action: 'sync', variant: 'outline' as const },
  { label: 'AI 요약 실행', icon: Zap, action: 'ai-summarize', variant: 'outline' as const },
  { label: '검색', icon: Search, action: 'search', variant: 'outline' as const },
  { label: '설정', icon: Settings, action: 'settings', variant: 'ghost' as const },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">⚡ 빠른 실행</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant={action.variant}
              className={cn('h-auto py-3 px-2 gap-1', 'flex flex-col items-center')}
              onClick={() => handleAction(action.action)}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function handleAction(action: string) {
  switch (action) {
    case 'write':
      alert('글 작성 모드 (구현 예정)')
      break
    case 'settings':
      window.location.href = '/settings'
      break
    case 'sync':
      alert('강제 동기화 실행 (구현 예정)')
      break
    case 'ai-summarize':
      alert('AI 요약 실행 (구현 예정)')
      break
    case 'search':
      window.location.href = '/search'
      break
  }
}