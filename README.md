# InfoHub - 나만의 정보 허브

개발자/투자자/게이머를 위한 최적화된 정보 대시보드. 인스타/쇼츠 시간 줄이고 원하는 정보만 모아보는 페이지.

## 🚀 기술 스택

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **UI**: shadcn/ui 스타일 컴포넌트 + Lucide Icons
- **State**: TanStack Query + Zustand
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Edge Functions)
- **Deploy**: Vercel + Supabase
- **Data Pipeline**: RSS/Reddit/DCInside/Official API + AI 요약 (Nemotron/Gemini/OpenRouter/Local 폴백)

## 📋 주요 기능

- 🌅 **오늘의 브리핑** - 아침/저녁/커스텀, 5개 핵심 카드, 실시간 클릭→상세/원문링크
- 📰 **피드** - 카테고리 탭, 검색/정렬/필터, 무한스크롤, 카드/컴팩트 뷰
- 🤖 **AI 요약/분류** - Nemotron → Gemini → OpenRouter → 로컬(TF-IDF) 폴백 체인
- 💰 **포트폴리오** - 토스증권 스타일 티커 카드 + 실적/배당/알림
- 🎮 **게임 트래킹** - 아크레이더스/더파이널스/페르소나5 팬텀X/카스온라인/DJMAX/테스트바 히어로 + 공식/커뮤니티 소스
- 📝 **하이라이트/메모** - 롱프레스 선택 + 태그 + 검색
- ✅ **액션 트래커** - 실천 체크 + 스트릭 + 주간 리포트
- 🔍 **통합 검색** - Meilisearch/Postgres FTS 풀텍스트
- 🌙 **테마** - 라이트/다크/아몰레드/시스템 + 4가지 알림 톤

## 🛠 개발 환경 설정

### 1. 저장소 클론
```bash
git clone https://github.com/PERSONARPGGG/D-Game-My_all_in_one_page.git
cd D-Game-My_all_in_one_page
```

### 2. 의존성 설치
```bash
pnpm install
```

### 3. 환경변수 설정
```bash
cp .env.example .env.local
# .env.local 편집 - Supabase URL/Key 필수
```

### 4. Supabase 설정
1. https://supabase.com 에서 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/001_initial_schema.sql` 실행
3. Settings > API에서 Project URL, anon key 복사 → `.env.local`에 입력

### 5. 개발 서버 실행
```bash
pnpm dev
# http://localhost:3000
```

## 📁 프로젝트 구조
```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (dashboard)/        # 대시보드 레이아웃 그룹
│   │   ├── page.tsx        # 메인 대시보드
│   │   ├── briefing/       # 브리핑 페이지
│   │   ├── feed/           # 피드 페이지
│   │   ├── search/         # 검색 페이지
│   │   └── settings/       # 설정 페이지
│   ├── api/                # API 라우트
│   ├── globals.css         # 전역 스타일 + CSS 변수
│   ├── layout.tsx          # 루트 레이아웃
│   └── providers.tsx       # React Query Provider
├── components/
│   ├── ui/                 # 기본 UI 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트 (탭바/드로어)
│   └── dashboard/          # 대시보드 전용 컴포넌트
├── hooks/                  # 커스텀 훅 (useTheme, useOffline 등)
├── lib/
│   ├── supabase/           # Supabase 클라이언트 (client/server/middleware)
│   ├── fetchers/           # RSS/Reddit/DCInside/Official/API 페처
│   ├── ai/                 # AI 요약 (Nemotron/Gemini/OpenRouter/Local)
│   └── pipeline/           # 데이터 파이프라인 오케스트레이터
├── config/                 # 설정 (카테고리 등)
├── types/                  # TypeScript 타입 정의
└── middleware.ts           # Next.js 미들웨어 (세션 갱신)
supabase/
└── migrations/             # SQL 마이그레이션 파일
```

## 🔄 배포 (Vercel)
1. Vercel에서 GitHub 레포 연결
2. Environment Variables에 `.env.local` 값들 입력
3. Deploy → 자동 배포

## 📱 PWA 설치
- 모바일에서 "홈 화면에 추가"로 앱처럼 사용
- 오프라인에서 마지막 동기화된 콘텐츠 읽기 가능

## 📄 라이선스
MIT