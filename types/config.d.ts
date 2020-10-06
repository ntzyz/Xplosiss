declare global {
  interface BlogConfig {
    database: { 
      address: string
      db: string
    }
    port: number
    favicon?: string
    avatar: string
    title: string
    subtitle: string
    footer: string[]
    url: string
    language: string
    components: {
      title: boolean
      categories: boolean
      tags: boolean
      replies: boolean
    }
    meta: {
      themeColor: string
    }
    page: {
      size: number
    }
    reply: {
      enableMarkdownSupport: boolean
    }
    allowedOrigins: string[]
    plugins: {
      gallery?: {
        enabled: boolean
        mountPoint: string
        title: string
      }
      'rss-feed'?: {
        enabled: boolean
      }
      'navigation-sound'?: {
        enabled: boolean
        audioURL: string
      }
      'telegram-helper'?: {
        enabled: boolean
        ownerId: number
        telegramBotToken: string
      }
      statistics?: {
        enabled: boolean
        enableBrowserIdentifier: boolean
        respectDNT: boolean
      }
    }
  }
}

export {};
