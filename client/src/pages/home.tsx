import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import Navigation from "@/components/navigation";
import HeroShowcase from "@/components/hero-showcase";
import ArticleCard from "@/components/article-card";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }
      params.append("status", "published");
      
      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroShowcase />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-headline font-black text-foreground">Latest News</h2>
              <div className="flex space-x-2">
                <Button
                  variant={categoryFilter === "all" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setCategoryFilter("all")}
                  data-testid="filter-all"
                >
                  All
                </Button>
                <Button
                  variant={categoryFilter === "car-news" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setCategoryFilter("car-news")}
                  data-testid="filter-cars"
                >
                  Cars
                </Button>
                <Button
                  variant={categoryFilter === "bike-news" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setCategoryFilter("bike-news")}
                  data-testid="filter-bikes"
                >
                  Bikes
                </Button>
                <Button
                  variant={categoryFilter === "reviews" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setCategoryFilter("reviews")}
                  data-testid="filter-reviews"
                >
                  Reviews
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-lg overflow-hidden shadow-lg animate-pulse">
                    <div className="w-full h-48 bg-muted"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-6 bg-muted rounded"></div>
                      <div className="h-16 bg-muted rounded"></div>
                      <div className="flex justify-between">
                        <div className="flex space-x-4">
                          <div className="h-4 bg-muted rounded w-12"></div>
                          <div className="h-4 bg-muted rounded w-12"></div>
                          <div className="h-4 bg-muted rounded w-12"></div>
                        </div>
                        <div className="h-4 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
            
            {!isLoading && articles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No articles found for the selected category.</p>
              </div>
            )}
          </div>
          
          <Sidebar />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
