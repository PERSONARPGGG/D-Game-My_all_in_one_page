'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { BriefingCard } from '@/components/dashboard/BriefingCard'
import { StatsOverview } from '@/components/dashboard/StatsOverview'
import { BreakingNews } from '@/components/dashboard/BreakingNews'
import { CategoryGrid } from '@/components/dashboard/CategoryGrid'
import { QuickActions } from '@/components/dashboard/QuickActions'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">대시보드</h1>
            <p className="text-muted-foreground text-sm">좋은 아침입니다 · 핵심만 빠르게 확인하세요</p>
          </div>
        </div>

        <BriefingCard />
        <StatsOverview />
        <BreakingNews />
        <CategoryGrid />
        <QuickActions />
      </div>
    </DashboardLayout>
  )
}