'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Plus, Settings, Download, Upload, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const quickActions = [
  { label: '새 글 작성', icon: Plus, action: 'write', variant: 'default' },
  { label: '설정 열기', icon: Settings, action: 'settings', variant: 'outline' },
  { label: '데이터 내보내기', icon: Download, action: 'export', variant: 'outline' },
  { label: '백업 가져오기', icon: Upload, action: 'import', variant: 'outline' },
  { label: '강제 동기화', icon: RefreshCw, action: 'sync', variant: 'ghost' },
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
              variant={action.variant as any}
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
    case 'export':
      alert('데이터 내보내기 (구현 예정)')
      break
    case 'import':
      alert('백업 가져오기 (구현 예정)')
      break
    case 'sync':
      alert('강제 동기화 실행 (구현 예정)')
      break
  }
}