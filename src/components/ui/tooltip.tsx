'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface TooltipProviderProps {
  children: ReactNode
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <>{children}</>
}

interface TooltipProps {
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ children, side = 'top', className }: TooltipProps) {
  return <div className={cn('relative inline-block', className)}>{children}</div>
}

interface TooltipTriggerProps {
  children: ReactNode
  asChild?: boolean
}

export function TooltipTrigger({ children, asChild = false }: TooltipTriggerProps) {
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