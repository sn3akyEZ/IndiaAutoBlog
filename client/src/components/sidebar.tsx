import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Sidebar() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const { data: trendingArticles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles/trending"],
  });

  const { data: allArticles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Mock newsletter subscription
    toast({ title: "Successfully subscribed to newsletter!" });
    setEmail("");
  };

  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};
    allArticles.forEach(article => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const categoryDisplayNames: Record<string, string> = {
    "car-news": "Car News",
    "bike-news": "Bike News",
    "reviews": "Reviews",
    "technology": "Technology",
    "industry": "Industry News",
  };

  return (
    <aside className="lg:col-span-1 space-y-8">
      {/* Trending Articles */}
      <div className="bg-card rounded-lg p-6">
        <h3 className="text-xl font-headline font-bold text-foreground mb-4 flex items-center">
          <Flame className="text-primary mr-2" />
          Trending Now
        </h3>
        
        <div className="space-y-4">
          {trendingArticles.length === 0 ? (
            <p className="text-muted-foreground text-sm">No trending articles available.</p>
          ) : (
            trendingArticles.map((article, index) => (
              <div key={article.id} className="flex items-start space-x-3" data-testid={`trending-article-${index}`}>
                <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ${
                  index === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                    <Link href={`/article/${article.id}`} data-testid={`link-trending-${index}`}>
                      {article.title}
                    </Link>
                  </h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Eye className="w-3 h-3 mr-1" />
                    <span data-testid={`text-views-trending-${index}`}>
                      {article.views > 1000 ? `${(article.views / 1000).toFixed(1)}K` : article.views} views
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
        <h3 className="text-xl font-headline font-bold text-foreground mb-2">Stay Updated</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Get the latest automotive news delivered to your inbox weekly.
        </p>
        
        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-input border border-border"
            data-testid="input-newsletter-email"
          />
          <Button 
            type="submit" 
            className="w-full"
            data-testid="button-newsletter-subscribe"
          >
            Subscribe Now
          </Button>
        </form>
      </div>

      {/* Categories */}
      <div className="bg-card rounded-lg p-6">
        <h3 className="text-xl font-headline font-bold text-foreground mb-4">Categories</h3>
        
        <div className="space-y-2">
          {Object.entries(categoryDisplayNames).map(([key, displayName]) => (
            <Link key={key} href={`/category/${key}`}>
              <div className="flex items-center justify-between text-muted-foreground hover:text-primary transition-colors py-1 cursor-pointer" data-testid={`link-category-${key}`}>
                <span>{displayName}</span>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded" data-testid={`text-count-${key}`}>
                  {categoryCounts[key] || 0}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
