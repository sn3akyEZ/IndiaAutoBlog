import { type Article, type InsertArticle, type UpdateArticle } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Article operations
  getArticles(filters?: { category?: string; status?: string; featured?: boolean }): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, updates: UpdateArticle): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  incrementViews(id: string): Promise<void>;
  toggleLike(id: string): Promise<Article | undefined>;
  toggleDislike(id: string): Promise<Article | undefined>;
  getTrendingArticles(limit?: number): Promise<Article[]>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
}

export class MemStorage implements IStorage {
  private articles: Map<string, Article>;

  constructor() {
    this.articles = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleArticles: InsertArticle[] = [
      {
        title: "India's EV Sales Surge 300% This Quarter",
        excerpt: "Electric vehicle adoption is accelerating across Indian cities with government incentives and improved charging infrastructure driving unprecedented growth...",
        content: "Electric vehicle adoption is accelerating across Indian cities with government incentives and improved charging infrastructure driving unprecedented growth. The latest quarterly data shows a remarkable 300% increase in EV sales compared to the same period last year, marking a significant milestone in India's transition to sustainable transportation.",
        category: "car-news",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        author: "Admin",
        status: "published",
        likes: 45,
        dislikes: 3,
        views: 2100,
        readTime: 6,
        featured: false,
      },
      {
        title: "BMW 3 Series 2024: The Perfect Balance",
        excerpt: "Our comprehensive review of BMW's latest 3 Series reveals a car that masterfully balances luxury with performance...",
        content: "Our comprehensive review of BMW's latest 3 Series reveals a car that masterfully balances luxury with performance. The 2024 model brings significant improvements in technology, comfort, and driving dynamics while maintaining the sporty character that has defined the 3 Series for decades.",
        category: "reviews",
        imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        author: "Admin",
        status: "published",
        likes: 234,
        dislikes: 8,
        views: 12500,
        readTime: 8,
        featured: true,
      },
      {
        title: "Yamaha R15 V4: Track-Ready Beast",
        excerpt: "The new R15 V4 brings track-inspired performance to the streets with significant upgrades over its predecessor...",
        content: "The new R15 V4 brings track-inspired performance to the streets with significant upgrades over its predecessor. Yamaha has enhanced every aspect of this popular sportbike, from the engine performance to the aerodynamics, making it a formidable choice for enthusiasts.",
        category: "reviews",
        imageUrl: "https://pixabay.com/get/g13eca5815494d9f6716ae8af3f113a620890c656d1f9ff5bd7c8528db34ef966765d4e00241832e01c06ca3b5212a089a4fba7f002faca8d7826e9a0bbab3574_1280.jpg",
        author: "Admin",
        status: "published",
        likes: 156,
        dislikes: 5,
        views: 8300,
        readTime: 6,
        featured: true,
      },
      {
        title: "Tata Nexon EV Max: Electric Future",
        excerpt: "Tata's enhanced Nexon EV Max promises longer range and better features. We put it through comprehensive testing...",
        content: "Tata's enhanced Nexon EV Max promises longer range and better features. We put it through comprehensive testing to see if it lives up to the expectations. The updated model addresses many of the concerns from the original version while adding new features that make it more competitive in the growing EV market.",
        category: "reviews",
        imageUrl: "https://pixabay.com/get/g3b5176dbe86fd092934f6fcbd94b6995a0372567dcf5838face43f192393b2132623b9525147dc75fd804a2bf29b4eed42f3fa0a8e4e7d665b5823a246a3509d_1280.jpg",
        author: "Admin",
        status: "published",
        likes: 312,
        dislikes: 12,
        views: 15700,
        readTime: 10,
        featured: true,
      },
      {
        title: "Royal Enfield Unveils New 650 Twin Series",
        excerpt: "Royal Enfield expands its popular 650cc platform with three new models targeting different riding styles and preferences in the Indian market...",
        content: "Royal Enfield expands its popular 650cc platform with three new models targeting different riding styles and preferences in the Indian market. The new lineup includes adventure, cruiser, and sport variants, each designed to cater to specific rider preferences while maintaining the classic Royal Enfield character.",
        category: "bike-news",
        imageUrl: "https://pixabay.com/get/g430b19eb8c169ea3cd2512a980f9c8f6f948a3e7fa8a05bbcfaff7df8b681b27579143a3a0693bd59358e5b50c2b185c4851db6eaafdd1ef95baf06ee1fe945e_1280.jpg",
        author: "Admin",
        status: "published",
        likes: 78,
        dislikes: 2,
        views: 3400,
        readTime: 5,
        featured: false,
      },
    ];

    sampleArticles.forEach(article => {
      const id = randomUUID();
      const now = new Date();
      const fullArticle: Article = {
        ...article,
        id,
        createdAt: now,
        updatedAt: now,
      };
      this.articles.set(id, fullArticle);
    });
  }

  async getArticles(filters?: { category?: string; status?: string; featured?: boolean }): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (filters?.category && filters.category !== "all") {
      articles = articles.filter(article => article.category === filters.category);
    }
    
    if (filters?.status && filters.status !== "all") {
      articles = articles.filter(article => article.status === filters.status);
    }
    
    if (filters?.featured !== undefined) {
      articles = articles.filter(article => article.featured === filters.featured);
    }
    
    return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const now = new Date();
    const article: Article = {
      ...insertArticle,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updates: UpdateArticle): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;

    const updatedArticle: Article = {
      ...article,
      ...updates,
      updatedAt: new Date(),
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async incrementViews(id: string): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.views += 1;
      article.updatedAt = new Date();
      this.articles.set(id, article);
    }
  }

  async toggleLike(id: string): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (article) {
      article.likes += 1;
      article.updatedAt = new Date();
      this.articles.set(id, article);
      return article;
    }
    return undefined;
  }

  async toggleDislike(id: string): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (article) {
      article.dislikes += 1;
      article.updatedAt = new Date();
      this.articles.set(id, article);
      return article;
    }
    return undefined;
  }

  async getTrendingArticles(limit: number = 5): Promise<Article[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => article.status === "published")
      .sort((a, b) => b.views - a.views);
    return articles.slice(0, limit);
  }

  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => article.status === "published" && article.featured)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return articles.slice(0, limit);
  }
}

export const storage = new MemStorage();
