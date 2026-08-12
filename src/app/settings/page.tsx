'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User, Bell, Palette, Zap, Database, 
  Key, Shield, Moon, Sun, Monitor, Smartphone,
  Plus, Trash2, Edit, Download, Upload, RefreshCw,
  TrendingUp, Newspaper, Check, TestTube2,
} from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [tone, setTone] = useState<'manager' | 'brother' | 'senior' | 'entj'>('manager')

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">일반</TabsTrigger>
          <TabsTrigger value="theme">테마</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="api">API 키</TabsTrigger>
          <TabsTrigger value="data">데이터</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle>👤 프로필</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>닉네임</Label>
                  <Input placeholder="사용자 이름" defaultValue="Garry" />
                </div>
                <div className="space-y-2">
                  <Label>이메일</Label>
                  <Input type="email" placeholder="email@example.com" defaultValue="user@example.com" disabled />
                </div>
              </div>
              <Button>저장</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>🌍 언어/지역</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>언어</Label>
                  <Select defaultValue="ko">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>시간대</Label>
                  <Select defaultValue="Asia/Seoul">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Seoul">Asia/Seoul (KST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="pt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle>🎨 테마 설정</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>테마 모드</Label>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {[
                    { value: 'light', label: '라이트', icon: Sun, desc: '밝은 배경' },
                    { value: 'dark', label: '다크', icon: Moon, desc: '어두운 배경' },
                    { value: 'amoled', label: '아몰레드', icon: Monitor, desc: '완전 검은 배경 (OLED 절전)' },
                    { value: 'system', label: '시스템', icon: Smartphone, desc: 'OS 설정 따라감' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value as 'light' | 'dark' | 'amoled' | 'system')}
                      className={cn(
                        'p-4 rounded-lg border-2 text-center transition-all',
                        theme === t.value && 'border-primary bg-primary/10'
                      )}
                    >
                      <t.icon className="h-6 w-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>알림 톤</Label>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {[
                    { value: 'manager', label: '매니저', emoji: '👔', desc: '전문적이고 정중한 존댓말' },
                    { value: 'brother', label: '형/누나', emoji: '🤝', desc: '친근한 반말' },
                    { value: 'senior', label: '선배', emoji: '👨‍🏫', desc: '조언조 반말' },
                    { value: 'entj', label: 'ENTJ 팩폭', emoji: '⚡', desc: '직설적이고 효율성 중시' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value as 'manager' | 'brother' | 'senior' | 'entj')}
                      className={cn(
                        'p-4 rounded-lg border-2 text-center hover:bg-accent',
                        tone === t.value && 'border-primary bg-primary/10'
                      )}
                    >
                      <div className="text-2xl mb-1">{t.emoji}</div>
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="pt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle>🔔 알림 설정</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'breaking', label: '브레이킹 뉴스 즉시 알림', desc: '중요도 5점 만점 5점인 긴급 뉴스', default: true },
                { id: 'morning', label: '아침 브리핑', desc: '매일 오전 07:00 발송', default: true },
                { id: 'evening', label: '저녁 브리핑', desc: '매일 오후 21:00 발송', default: true },
                { id: 'keywords', label: '키워드 알림', desc: '설정한 키워드 매칭 시', default: true },
                { id: 'weekly', label: '주간 리포트', desc: '매주 일요일 오전 09:00 발송', default: true },
                { id: 'gamePatch', label: '게임 패치 알림', desc: '플레이중 게임 패치/업데이트', default: true },
                { id: 'gameEvent', label: '게임 이벤트 알림', desc: '게임 이벤트 시작/종료', default: true },
                { id: 'gameCoupon', label: '게임 쿠폰 알림', desc: '새 쿠폰 코드 발견 시', default: true },
              ].map(({ id, label, desc, default: def }) => (
                <div key={id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch defaultChecked={def} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="pt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle>🔑 API 키 관리</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                키는 로컬(localStorage)에만 저장되며 서버로 전송되지 않습니다. 브라우저를 닫아도 유지됩니다.
              </p>
              {[
                { key: 'NVIDIA_API_KEY', label: 'NVIDIA Nemotron 3 Ultra', icon: Zap, desc: '로컬 LLM 요약용 (무료)' },
                { key: 'GOOGLE_AI_API_KEY', label: 'Google Gemini 1.5 Flash', icon: Zap, desc: '빠른 요약용 (무료)' },
                { key: 'OPENROUTER_API_KEY', label: 'OpenRouter (무료 모델)', icon: Zap, desc: '다양한 무료 모델 접근' },
                { key: 'ALPHA_VANTAGE_API_KEY', label: 'Alpha Vantage (주식 데이터)', icon: TrendingUp, desc: '실적/배당/시세 데이터' },
                { key: 'NEWS_API_KEY', label: 'News API (뉴스 데이터)', icon: Newspaper, desc: '실시간 뉴스 수집' },
              ].map(({ key, label, icon: Icon, desc }) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="password" placeholder="API 키 입력" className="w-64" />
                    <Button variant="outline" size="sm">저장</Button>
                    <Button variant="ghost" size="sm">삭제</Button>
                    <Button variant="ghost" size="sm" onClick={() => {}}>
                      <TestTube2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="pt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle>💾 데이터 관리</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" onClick={() => {}}>
                  <Download className="h-4 w-4 mr-2" />
                  JSON 내보내기
                </Button>
                <Button variant="outline" onClick={() => {}}>
                  <Download className="h-4 w-4 mr-2" />
                  Markdown 내보내기
                </Button>
                <Button variant="outline" onClick={() => {}}>
                  <Upload className="h-4 w-4 mr-2" />
                  백업 가져오기
                </Button>
                <Button variant="outline" onClick={() => {}}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  강제 동기화
                </Button>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">저장소 사용량</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-muted-foreground">기사 캐시</span><br /><span className="font-bold">45.2 MB</span></div>
                  <div><span className="text-muted-foreground">하이라이트/메모</span><br /><span className="font-bold">2.1 MB</span></div>
                  <div><span className="text-muted-foreground">액션/리포트</span><br /><span className="font-bold">890 KB</span></div>
                </div>
              </div>
              <div className="border-t pt-4 text-destructive">
                <Button variant="destructive" onClick={() => {}}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  모든 데이터 초기화
                </Button>
                <p className="text-xs text-muted-foreground mt-2">복구 불가능합니다. 신중하게 결정하세요.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}