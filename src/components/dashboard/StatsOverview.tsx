'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  FileText, 
  CheckCircle2, 
  Flame, 
  TrendingUp,
  Target,
  BookOpen
} from 'lucide-react'

const stats = [
  { label: '오늘 읽은 글', value: '12', change: '+3', icon: FileText, color: 'text-blue-500' },
  { label: '실천 완료', value: '3', change: '+1', icon: CheckCircle2, color: 'text-green-500' },
  { label: '연속 달성', value: '7일', change: '최고 14일', icon: Flame, color: 'text-orange-500' },
  { label: '수익률', value: '+2.3%', change: '벤치마크 +0.8%', icon: TrendingUp, color: 'text-emerald-500' },
]

export function StatsOverview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <stat.icon className={cn('h-8 w-8', stat.color)} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}