# 저장: D:\Game\my-info-hub\setup-day1.ps1
# 실행: powershell -ExecutionPolicy Bypass -File setup-day1.ps1

cd "D:\Game\my-info-hub"

# 1. 디렉토리 생성
$dirs = @(
  "src/lib/supabase", "src/types", "src/hooks", "src/components/ui", 
  "src/components/layout", "src/app/(dashboard)", "src/app/api", 
  "supabase/migrations", "public"
)
$dirs | ForEach-Object { mkdir -Force $_ | Out-Null }

# 2. components.json
@"
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide-react"
}
"@ | Out-File -Encoding utf8 components.json

# 3. src/lib/utils.ts
@"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
"@ | Out-File -Encoding utf8 src/lib/utils.ts

# 4. src/types/supabase.ts
@"
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]
export interface Database {
  public: {
    Tables: {
      categories: { Row: any; Insert: any; Update: any }
      sources: { Row: any; Insert: any; Update: any }
      articles: { Row: any; Insert: any; Update: any }
      user_preferences: { Row: any; Insert: any; Update: any }
      highlights: { Row: any; Insert: any; Update: any }
      actions: { Row: any; Insert: any; Update: any }
      daily_reports: { Row: any; Insert: any; Update: any }
      subscriptions: { Row: any; Insert: any; Update: any }
      portfolio_holdings: { Row: any; Insert: any; Update: any }
      portfolio_transactions: { Row: any; Insert: any; Update: any }
      portfolio_alerts: { Row: any; Insert: any; Update: any }
      user_games: { Row: any; Insert: any; Update: any }
      game_patches: { Row: any; Insert: any; Update: any }
      game_events: { Row: any; Insert: any; Update: any }
      game_coupons: { Row: any; Insert: any; Update: any }
    }
  }
}
"@ | Out-File -Encoding utf8 src/types/supabase.ts

# 5. Supabase 클라이언트 4개
@"
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
"@ | Out-File -Encoding utf8 src/lib/supabase/client.ts

@"
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }) } catch {} },
        remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: '', ...options }) } catch {} },
      },
    }
  )
}
"@ | Out-File -Encoding utf8 src/lib/supabase/server.ts

@"
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  await supabase.auth.getUser()
  return supabaseResponse
}
"@ | Out-File -Encoding utf8 src/lib/supabase/middleware.ts

@"
export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'
export { updateSession } from './middleware'
"@ | Out-File -Encoding utf8 src/lib/supabase/index.ts

Write-Host "✅ Day 1 기본 구조 생성 완료" -ForegroundColor Green