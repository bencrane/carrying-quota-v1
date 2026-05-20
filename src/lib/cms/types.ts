export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Article {
  id: string;
  slug: string;
  section: string;
  title: string;
  dek?: string;
  body?: string;
  coverImageUrl?: string;
  publishedAt: string;
  authors: Author[];
  tags: string[];
}

export interface CMSClient {
  listArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | null>;
}
