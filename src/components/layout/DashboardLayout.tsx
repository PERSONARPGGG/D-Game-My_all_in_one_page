'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Sunrise, 
  List, 
  Search, 
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const TABS = [
  { href: '/', icon: LayoutDashboard, label: '대시보드', short: '홈' },
  { href: '/briefing', icon: Sunrise, label: '브리핑', short: '브리핑' },
  { href: '/feed', icon: List, label: '피드', short: '피드' },
  { href: '/search', icon: Search, label: '검색', short: '검색' },
  { href: '/settings', icon: Settings, label: '설정', short: '설정' },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | 'amoled' | 'system'>('system')
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('theme') as typeof theme | null
    if (stored) setTheme(stored)
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark', 'amoled')
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(theme)
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const currentTab = TABS.find(t => pathname === t.href || (t.href !== '/' && pathname.startsWith(t.href)))

  if (!isMobile) {
    return (
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 border-r bg-card flex flex-col">
          <div className="p-4 border-b flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">InfoHub</span>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t space-y-2">
            <ThemeSelector theme={theme} setTheme={setTheme} />
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    )
  }

  return (
    <>
      <TooltipProvider>
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed bottom-4 left-4 z-50 md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg">InfoHub</span>
              <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="mt-6 border-t pt-4 space-y-2">
              <ThemeSelector theme={theme} setTheme={setTheme} />
              <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </SheetContent>
        </Sheet>
      </TooltipProvider>

      <main className="pb-16 md:pb-0">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t bg-background/95 backdrop-blur">
        <div className="grid grid-cols-5">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
            return (
              <Tooltip key={tab.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={tab.href}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 py-2 px-1 transition-colors',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{tab.short}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">{tab.label}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </nav>
    </>
  )
}

function ThemeSelector({ theme, setTheme }: { theme: string; setTheme: (t: string) => void }) {
  const themes = [
    { value: 'light', label: '라이트', icon: Sun },
    { value: 'dark', label: '다크', icon: Moon },
    { value: 'amoled', label: '아몰레드', icon: Monitor },
    { value: 'system', label: '시스템', icon: Smartphone },
  ] as const

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="text-sm">테마</span>
          <Zap className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn('flex items-center gap-2', theme === t.value && 'bg-accent')}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {theme === t.value && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ViewModeToggle({ viewMode, setViewMode }: { viewMode: string; setViewMode: (t: string) => void }) {
  return (
    <Button
      variant="outline"
      className="w-full justify-between"
      onClick={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')}
    >
      <span className="text-sm">
        {viewMode === 'mobile' ? '📱 모바일 모드' : '🖥️ 데스크톱 모드'}
      </span>
      <Monitor className="h-4 w-4" />
    </Button>
  )
}