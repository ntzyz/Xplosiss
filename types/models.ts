export interface BlogPostBody {
  title: string;
  content: string;
  language: string;
  format: string;
  default: boolean;
}

export interface BlogReply {
  user: string;
  email: string;
  site: string;
  content: string;
  replyTo: number | null;
  githubId: string;
  datetime: number;
  markdown?: boolean;
}

export interface BlogPost {
  _id?: string;
  date: Date | string;
  category: string;
  tags: string[];
  slug: string;
  cover: string;
  hideOnIndex: null | boolean;
  insertCover: null | boolean;
  password?: string;
  more?: boolean;
  protected?: boolean;
  title?: string;
  content?: string;
  language?: string;
  body?: BlogPostBody[];
  replies?: BlogReply[];
}

export interface BlogMedia {
  file: string;
  mime: string | false;
}

export interface BlogTag {
  tag: string;
  counter: number;
}

export interface BlogWidget {
  _id?: string;
  title: string;
  content: string;
  enabled: boolean;
}
