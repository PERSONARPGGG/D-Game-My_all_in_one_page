import type { Article, CategorySlug } from '@/types/domain'

export interface AIProvider {
  name: string
  summarize(article: Article): Promise<AIResult>
  isAvailable(): boolean
}

export interface AIResult {
  summary: string
  tags: string[]
  actions: string[]
  importance: 1 | 2 | 3 | 4 | 5
  categorySlug?: string
}

const AI_PROVIDERS_ORDER = [
  'nemotron',
  'gemini',
  'openrouter',
  'local',
] as const

type AIProviderName = typeof AI_PROVIDERS_ORDER[number]

interface ProviderConfig {
  name: AIProviderName
  apiKeyEnv: string
  endpoint: string
  model: string
  maxTokens: number
}

const PROVIDER_CONFIGS: Record<AIProviderName, ProviderConfig> = {
  nemotron: {
    name: 'nemotron',
    apiKeyEnv: 'NVIDIA_API_KEY',
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'nvidia/nemotron-3-ultra',
    maxTokens: 512,
  },
  gemini: {
    name: 'gemini',
    apiKeyEnv: 'GOOGLE_AI_API_KEY',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',
    maxTokens: 512,
  },
  openrouter: {
    name: 'openrouter',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    maxTokens: 512,
  },
  local: {
    name: 'local',
    apiKeyEnv: '',
    endpoint: '',
    model: 'local-tfidf',
    maxTokens: 0,
  },
}

function buildPrompt(article: Article): string {
  return `다음 기사를 분석해 JSON 형태로 반환해줘:

제목: ${article.title}
요약: ${article.summary || '없음'}
내용: ${article.content?.slice(0, 2000) || '없음'}
카테고리: ${article.categorySlug}
출처: ${article.sourceId}

반환 형식:
{
  "summary": "핵심 3줄 요약 (한국어)",
  "tags": ["태그1", "태그2", "태그3"],
  "actions": ["실행 가능한 액션1", "액션2"],
  "importance": 3,
  "categorySlug": "추천 카테고리 슬러그"
}

중요도: 1(낮음)~5(긴급). 개발자/투자자/게이머 관점에서 실용성 위주.`
}

async function callNemotron(article: Article): Promise<AIResult> {
  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) throw new Error('Nemotron API 키 없음')

  const config = PROVIDER_CONFIGS.nemotron
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: '너는 개발자/투자자/게이머를 위한 정보 큐레이터야. 기사에서 실용적인 인사이트만 뽑아 JSON으로 반환해.' },
        { role: 'user', content: buildPrompt(article) },
      ],
      max_tokens: config.maxTokens,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) throw new Error(`Nemotron API 오류: ${response.status}`)
  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}

async function callGemini(article: Article): Promise<AIResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('Gemini API 키 없음')

  const config = PROVIDER_CONFIGS.gemini
  const response = await fetch(`${config.endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `너는 개발자/투자자/게이머를 위한 정보 큐레이터야. JSON만 반환해.\n\n${buildPrompt(article)}` }],
      }],
      generationConfig: {
        maxOutputTokens: config.maxTokens,
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) throw new Error(`Gemini API 오류: ${response.status}`)
  const data = await response.json()
  return JSON.parse(data.candidates[0].content.parts[0].text)
}

async function callOpenRouter(article: Article): Promise<AIResult> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OpenRouter API 키 없음')

  const config = PROVIDER_CONFIGS.openrouter
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/PERSONARPGGG/D-Game-My_all_in_one_page',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: '너는 개발자/투자자/게이머를 위한 정보 큐레이터야. JSON만 반환해.' },
        { role: 'user', content: buildPrompt(article) },
      ],
      max_tokens: config.maxTokens,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) throw new Error(`OpenRouter API 오류: ${response.status}`)
  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}

function localSummarize(article: Article): AIResult {
  const text = `${article.title} ${article.summary || ''} ${article.content || ''}`
  const words = text.toLowerCase().match(/\b\w{3,}\b/g) || []
  const freq = new Map<string, number>()
  
  for (const w of words) {
    if (w.length > 2 && !['the', 'and', 'for', 'are', '이', '그', '저', '것', '수', '등', '및', '또는'].includes(w)) {
      freq.set(w, (freq.get(w) || 0) + 1)
    }
  }

  const topWords = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w)

  const sentences = text.split(/[.!?。]/).filter(s => s.trim().length > 20)
  const summary = sentences.slice(0, 3).join('. ') + '.'

  let importance: 1 | 2 | 3 | 4 | 5 = 3
  const urgentKeywords = ['긴급', '속보', '폭락', '폭등', '해킹', '버그', '패치', '출시', '발표']
  if (urgentKeywords.some(k => text.includes(k))) importance = 5
  else if (text.length > 2000) importance = 4

  const devKeywords = ['api', 'sdk', 'github', 'release', 'version', 'patch', 'update']
  const investKeywords = ['주식', 'etf', '배당', '실적', '연준', '금리', '달러']
  const gameKeywords = ['패치', '이벤트', '쿠폰', '업데이트', '시즌', '티어']

  let categorySlug = article.categorySlug
  if (devKeywords.some(k => text.toLowerCase().includes(k))) categorySlug = 'ai-dev'
  else if (investKeywords.some(k => text.includes(k))) categorySlug = 'us-stocks-etf'
  else if (gameKeywords.some(k => text.includes(k))) categorySlug = 'game-playing'

  return {
    summary,
    tags: topWords.slice(0, 3),
    actions: importance >= 4 ? ['원문 확인', '관련 내용 검토'] : ['나중에 읽기'],
    importance,
    categorySlug,
  }
}

export async function enrichArticle(article: Article): Promise<Article> {
  const providers = AI_PROVIDERS_ORDER
  
  for (const providerName of providers) {
    try {
      let result: AIResult
      
      switch (providerName) {
        case 'nemotron':
          result = await callNemotron(article)
          break
        case 'gemini':
          result = await callGemini(article)
          break
        case 'openrouter':
          result = await callOpenRouter(article)
          break
        case 'local':
          result = localSummarize(article)
          break
        default:
          continue
      }

      return {
        ...article,
        aiSummary: result.summary,
        aiTags: result.tags,
        aiActions: result.actions,
        aiImportance: result.importance,
        aiCategorySlug: (result.categorySlug as CategorySlug) || article.categorySlug,
      }
    } catch (error) {
      console.warn(`AI Provider ${providerName} 실패:`, error)
      continue
    }
  }

  return article
}

export async function enrichArticles(articles: Article[]): Promise<Article[]> {
  const results = await Promise.allSettled(
    articles.map(a => enrichArticle(a))
  )

  return results.map((r, i) => 
    r.status === 'fulfilled' ? r.value : articles[i]
  )
}