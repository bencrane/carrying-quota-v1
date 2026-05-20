import type { Article, CMSClient } from "./types";

const articles: Article[] = [];

export const mockCMS: CMSClient = {
  async listArticles() {
    return articles;
  },
  async getArticleBySlug(slug) {
    return articles.find((a) => a.slug === slug) ?? null;
  },
};
