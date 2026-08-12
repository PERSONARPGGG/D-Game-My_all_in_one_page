'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children, side = 'top', className }: { children: ReactNode; side?: 'top' | 'bottom' | 'left' | 'right'; className?: string }) {
  return <div className={cn('relative inline-block', className)}>{children}</div>
}

export function TooltipTrigger({ children, asChild = false }: { children: ReactNode; asChild?: boolean }) {
  if (asChild && typeof children === 'object' && children !== null) {
    return children
  }
  return <span className="relative">{children}</span>
}

export function TooltipContent({ children, side = 'top', className }: { children: ReactNode; side?: string; className?: string }) {
  return (
    <div
      className={cn(
        'absolute z-50 px-3 py-2 text-sm text-popover-foreground bg-popover rounded-md shadow-lg border animate-in',
        'fade-in-0 zoom-in-95',
        side === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
        className
      )}
    >
      {children}
    </div>
  )
}