'use client'

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
  Plus, Trash2, Edit, Download, Upload, RefreshCw
} from 'lucide-react'

export function SettingsPage() {
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
                  {['light', 'dark', 'amoled', 'system'].map((theme) => (
                    <button
                      key={theme}
                      className={cn(
                        'p-4 rounded-lg border-2 text-center transition-all',
                        theme === 'light' && 'border-slate-300 bg-white',
                        theme === 'dark' && 'border-slate-700 bg-slate-900 text-white',
                        theme === 'amoled' && 'border-slate-900 bg-black text-white',
                        theme === 'system' && 'border-blue-500 bg-blue-50'
                      )}
                    >
                      {theme === 'light' && <Sun className="h-6 w-6 mx-auto mb-1" />}
                      {theme === 'dark' && <Moon className="h-6 w-6 mx-auto mb-1" />}
                      {theme === 'amoled' && <Monitor className="h-6 w-6 mx-auto mb-1" />}
                      {theme === 'system' && <Smartphone className="h-6 w-6 mx-auto mb-1" />}
                      <div className="text-sm font-medium">{theme}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>알림 톤</Label>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {['manager', 'brother', 'senior', 'entj'].map((tone) => (
                    <button
                      key={tone}
                      className="p-4 rounded-lg border-2 text-center hover:bg-accent"
                    >
                      <div className="text-lg mb-1">
                        {tone === 'manager' && '👔'}
                        {tone === 'brother' && '🤝'}
                        {tone === 'senior' && '👨‍🏫'}
                        {tone === 'entj' && '⚡'}
                      </div>
                      <div className="text-sm font-medium">{tone}</div>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">브레이킹 뉴스 즉시 알림</p>
                  <p className="text-sm text-muted-foreground">중요도 5점 만점 5점인 긴급 뉴스</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">아침 브리핑</p>
                  <p className="text-sm text-muted-foreground">매일 오전 07:00 발송</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">저녁 브리핑</p>
                  <p className="text-sm text-muted-foreground">매일 오후 21:00 발송</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">키워드 알림</p>
                  <p className="text-sm text-muted-foreground">설정한 키워드 매칭 시</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">주간 리포트</p>
                  <p className="text-sm text-muted-foreground">매주 일요일 오전 09:00 발송</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="pt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle>🔑 API 키 관리</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                키는 암호화되어 저장됩니다. 브라우저에서만 사용되며 서버로 전송되지 않습니다.
              </p>
              {[
                { key: 'NVIDIA_API_KEY', label: 'NVIDIA Nemotron 3 Ultra', icon: Zap },
                { key: 'GOOGLE_AI_API_KEY', label: 'Google Gemini 1.5 Flash', icon: Zap },
                { key: 'OPENROUTER_API_KEY', label: 'OpenRouter (무료 모델)', icon: Zap },
                { key: 'ALPHA_VANTAGE_API_KEY', label: 'Alpha Vantage (주식 데이터)', icon: TrendingUp },
                { key: 'NEWS_API_KEY', label: 'News API (뉴스 데이터)', icon: Newspaper },
              ].map(({ key, label, icon }) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="password" placeholder="API 키 입력" className="w-64" />
                    <Button variant="outline" size="sm">저장</Button>
                    <Button variant="ghost" size="sm">삭제</Button>
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