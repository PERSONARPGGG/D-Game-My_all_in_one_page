declare module 'rss-parser' {
  interface CustomItem {
    link?: string
    title?: string
    pubDate?: string
    isoDate?: string
    content?: string
    contentSnippet?: string
    summary?: string
    creator?: string
    author?: string
    guid?: string
    categories?: string[]
    enclosure?: { url?: string; length?: string; type?: string }
  }

  interface CustomFeed {
    title?: string
    image?: { url?: string; title?: string; link?: string }
    items?: CustomItem[]
  }

  interface ParserOptions {
    timeout?: number
    headers?: Record<string, string>
    [key: string]: unknown
  }

  export default class Parser<Item = CustomItem, Feed = CustomFeed> {
    constructor(options?: ParserOptions)
    parseURL(url: string): Promise<Feed & { items: Item[]; title?: string; image?: { url?: string } }>
    parseString(xml: string): Promise<Feed & { items: Item[] }>
  }

  export { Parser }
}
