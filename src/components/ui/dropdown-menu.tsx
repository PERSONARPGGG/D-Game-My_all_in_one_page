'use client'

import { cn } from '@/lib/utils'
import { ChevronDown, Check } from 'lucide-react'
import { forwardRef } from 'react'

export const DropdownMenu = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative inline-block', className)} {...props}>
        {children}
      </div>
    )
  }
)
DropdownMenu.displayName = 'DropdownMenu'

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
  ({ children, asChild = false, ...props }, ref) => {
    return <>{children}</>
  }
)
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

export const DropdownMenuContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'end' }>(
  ({ className, children, align = 'start', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
          'animate-in fade-in-0 zoom-in-95',
          align === 'end' && 'right-0',
          className
        )}
        {...props}
      >
        <div className="p-1">{children}</div>
      </div>
    )
  }
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuItem = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { onClick?: () => void }>(
  ({ className, children, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn('w-full justify-start py-1.5 px-3 text-sm rounded-sm', className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DropdownMenuItem.displayName = 'DropdownMenuItem'