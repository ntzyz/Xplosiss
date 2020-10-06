declare global {
  interface BlogPostBody {
    title: string
    content: string
    language: string
    format: string
    default: boolean
  }
  
  interface BlogReply {
    user: string
    email: string
    site: string
    content: string
    replyTo: number | null
    githubId: string
    datetime: number
    markdown?: boolean
  }
  
interface BlogPost {
    _id?: string
    date: Date | string
    category: string
    tags: string[]
    slug: string
    cover: string
    hideOnIndex: null | boolean
    insertCover: null | boolean
    languages?: {
      name: string
      code: string
    }[],
    password?: string
    more?: boolean
    protected?: boolean
    title?: string
    content?: string
    language?: string
    body?: BlogPostBody[]
    replies?: BlogReply[]
    outdatedWarning?: boolean
  }
  
  interface BlogMedia {
    file: string
    mime: string | false
  }
  
  interface BlogTag {
    tag: string
    counter: number
  }
  
  interface BlogWidget {
    _id?: string
    title: string
    content: string
    enabled: boolean
  }
}

export {};
