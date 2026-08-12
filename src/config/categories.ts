import type { Category, CategorySlug, CategoryGroup } from '@/types/domain'

export const CATEGORIES: Category[] = [
  // 개발·AI 그룹
  {
    slug: 'ai-dev',
    label: 'AI·LLM',
    group: 'dev-ai',
    icon: 'Bot',
    color: 'bg-purple-500',
    displayOrder: 1,
    description: 'AI 모델, LLM, 벤치마크, 논문',
    keywords: ['claude', 'gpt', 'llm', 'ai 모델', '벤치마크', '논문', '네모트론', '제미나이'],
  },
  {
    slug: 'backend-infra',
    label: '백엔드·인프라',
    group: 'dev-ai',
    icon: 'Server',
    color: 'bg-blue-500',
    displayOrder: 2,
    description: '시스템 설계, 쿠버네티스, 관측성',
    keywords: ['쿠버네티스', '도커', '마이크로서비스', '분산시스템', '인프라', '데브옵스'],
  },
  {
    slug: 'frontend',
    label: '프론트엔드',
    group: 'dev-ai',
    icon: 'Layout',
    color: 'bg-cyan-500',
    displayOrder: 3,
    description: 'React, Next.js, TypeScript, 도구',
    keywords: ['react', 'next.js', 'typescript', '프론트엔드', '웹개발', '상태관리'],
  },
  {
    slug: 'dev-workflow',
    label: '개발 워크플로',
    group: 'dev-ai',
    icon: 'Terminal',
    color: 'bg-violet-500',
    displayOrder: 4,
    description: 'AI 코딩 에이전트, 로컬 LLM, CLI 파이프라인',
    keywords: ['claude code', 'cursor', 'cline', 'aider', '로컬 llm', '올라마', '프롬프트'],
  },
  {
    slug: 'startup-revenue',
    label: '창업·수익화',
    group: 'dev-ai',
    icon: 'Rocket',
    color: 'bg-amber-500',
    displayOrder: 5,
    description: '해커톤, 액셀러레이터, 인디해커, 정부지원',
    keywords: ['해커톤', '액셀러레이터', 'YC', '창업지원', '인디해커', '수익화', 'MVP'],
  },

  // 투자 그룹
  {
    slug: 'us-stocks-etf',
    label: '미국주식·ETF',
    group: 'invest',
    icon: 'TrendingUp',
    color: 'bg-green-500',
    displayOrder: 10,
    description: '포트폴리오, 실적, 배당, 밸류에이션',
    keywords: ['나스닥', 'S&P500', 'ETF', '배당', '실적', '밸류에이션', '리밸런싱'],
  },
  {
    slug: 'macro-fed',
    label: '매크로·연준',
    group: 'invest',
    icon: 'Globe',
    color: 'bg-teal-500',
    displayOrder: 11,
    description: '금리, 달러, 원자재, 섹터 로테이션',
    keywords: ['연준', 'FOMC', '금리', '달러', 'CPI', 'PCE', '섹터 로테이션'],
  },
  {
    slug: 'real-estate',
    label: '부동산·REIT',
    group: 'invest',
    icon: 'Home',
    color: 'bg-orange-500',
    displayOrder: 12,
    description: '트렌드, 정책, 수익률',
    keywords: ['부동산', 'REIT', '아파트', '분양', '정책', '수익률'],
  },

  // 게임 그룹
  {
    slug: 'game-playing',
    label: '플레이중 게임',
    group: 'game',
    icon: 'Gamepad2',
    color: 'bg-pink-500',
    displayOrder: 20,
    description: '아크레이더스, 더파이널스, 페르소나5 팬텀X, 카스온라인, DJMAX, 테스트바 히어로',
    keywords: ['아크레이더스', '더파이널스', '페르소나5 팬텀X', '카스온라인', 'DJMAX', 'EZ2ON', '테스트바 히어로'],
  },
  {
    slug: 'game-official',
    label: '공식 채널',
    group: 'game',
    icon: 'BookOpen',
    color: 'bg-indigo-500',
    displayOrder: 21,
    description: 'Steam, 공식 블로그, 패치노트, 디스코드 공지',
    keywords: ['공식', '패치노트', '업데이트', 'Steam', '디스코드', '메타포지'],
  },

  // 뉴스·트렌드 그룹
  {
    slug: 'news-breaking',
    label: '실시간 속보',
    group: 'news',
    icon: 'Newspaper',
    color: 'bg-red-500',
    displayOrder: 30,
    description: '연합/조선/한겨레/팩트체크 + 구글트렌드/X트렌드',
    keywords: ['속보', '긴급', '브레이킹', '팩트체크', '트렌드'],
  },
  {
    slug: 'trends',
    label: '트렌드·이슈',
    group: 'news',
    icon: 'Zap',
    color: 'bg-slate-500',
    displayOrder: 31,
    description: '해커뉴스, 레딧 핫, 실시간 이슈',
    keywords: ['해커뉴스', '레딧', '이슈', '트렌드', '바이럴'],
  },
]

export const CATEGORY_GROUPS: { group: CategoryGroup; label: string; icon: string; color: string }[] = [
  { group: 'dev-ai', label: '개발·AI', icon: 'Code', color: 'text-purple-500' },
  { group: 'invest', label: '투자', icon: 'TrendingUp', color: 'text-green-500' },
  { group: 'game', label: '게임', icon: 'Gamepad2', color: 'text-pink-500' },
  { group: 'news', label: '뉴스·트렌드', icon: 'Newspaper', color: 'text-red-500' },
]

export function getCategory(slug: CategorySlug): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug)
}

export function getCategoriesByGroup(group: CategoryGroup): Category[] {
  return CATEGORIES.filter(c => c.group === group).sort((a, b) => a.displayOrder - b.displayOrder)
}

export function getAllCategorySlugs(): CategorySlug[] {
  return CATEGORIES.map(c => c.slug)
}

export function getCategoryGroups(): CategoryGroup[] {
  return CATEGORY_GROUPS.map(g => g.group)
}