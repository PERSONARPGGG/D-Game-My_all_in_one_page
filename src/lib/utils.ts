import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  })
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  return formatDate(d, { hour: undefined, minute: undefined })
}

export function getImportanceColor(importance: number): string {
  const colors = {
    1: 'text-slate-400',
    2: 'text-slate-500',
    3: 'text-yellow-500',
    4: 'text-orange-500',
    5: 'text-red-500',
  }
  return colors[importance as keyof typeof colors] || 'text-slate-500'
}

export function getImportanceLabel(importance: number): string {
  const labels = {
    1: '낮음',
    2: '보통',
    3: '중요',
    4: '높음',
    5: '긴급',
  }
  return labels[importance as keyof typeof labels] || '중요'
}