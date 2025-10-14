import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, updateArticleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all articles with optional filtering
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, status, featured } = req.query;
      const filters: any = {};
      
      if (category && typeof category === "string") filters.category = category;
      if (status && typeof status === "string") filters.status = status;
      if (featured !== undefined) filters.featured = featured === "true";
      
      const articles = await storage.getArticles(filters);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  // Get featured articles for homepage showcase
  app.get("/api/articles/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const articles = await storage.getFeaturedArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured articles" });
    }
  });

  // Get trending articles for sidebar
  app.get("/api/articles/trending", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const articles = await storage.getTrendingArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending articles" });
    }
  });

  // Get single article by ID
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementViews(id);
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Create new article (admin only)
  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  // Update article (admin only)
  app.put("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateArticleSchema.parse(req.body);
      const article = await storage.updateArticle(id, validatedData);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  // Delete article (admin only)
  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteArticle(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Like article
  app.post("/api/articles/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.toggleLike(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json({ likes: article.likes });
    } catch (error) {
      res.status(500).json({ message: "Failed to like article" });
    }
  });

  // Dislike article
  app.post("/api/articles/:id/dislike", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.toggleDislike(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json({ dislikes: article.dislikes });
    } catch (error) {
      res.status(500).json({ message: "Failed to dislike article" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
