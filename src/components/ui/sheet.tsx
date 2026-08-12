'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50" onClick={() => onOpenChange(false)}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-background shadow-xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function SheetTrigger({ children, asChild = false, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  if (asChild && typeof children === 'function') {
    return children({ ...props, onClick: props.onClick })
  }
  return <Button {...props}>{children}</Button>
}

export function SheetContent({ children, className, side = 'right', ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: 'left' | 'right' }) {
  return (
    <div
      className={cn(
        'fixed top-0 bottom-0 z-50 flex flex-col',
        side === 'right' ? 'right-0' : 'left-0',
        'w-96 bg-background shadow-xl',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <slot name="title" />
        <Button variant="ghost" size="icon" onClick={() => {}}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  )
}