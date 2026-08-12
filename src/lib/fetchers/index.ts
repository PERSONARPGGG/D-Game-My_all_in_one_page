import './rss'
import './reddit'
import './dcinside'
import './official'
import './api'

import { fetcherRegistry, type FetcherResult, type FetcherContext } from './base'

export { fetcherRegistry, type FetcherResult, type FetcherContext }
export { registerFetcher, getFetcher, fetchSource, normalizeArticle, deduplicateArticles, filterByKeywords } from './base'