'use client'

import { cn } from '@/lib/utils'
import { ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative inline-block">{children}</div>
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export function DropdownMenuTrigger({ children, asChild = false }: DropdownMenuTriggerProps) {
  return <>{children}</>
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: 'start' | 'end'
  className?: string
}

export function DropdownMenuContent({ children, align = 'start', className }: DropdownMenuContentProps) {
  return (
    <div
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
        'animate-in fade-in-0 zoom-in-95',
        align === 'end' && 'right-0',
        className
      )}
    >
      <div className="p-1">{children}</div>
    </div>
  )
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
}

export function DropdownMenuItem({ className, children, onClick, ...props }: DropdownMenuItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start py-1.5 px-3 text-sm', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  )
}