import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Eye, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: featuredArticles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles/featured"],
  });

  // Auto-rotate featured articles every 5 seconds
  useEffect(() => {
    if (featuredArticles.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredArticles.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  if (isLoading) {
    return (
      <section className="bg-gradient-to-r from-background via-card to-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-12 bg-muted rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden shadow-xl animate-pulse">
                <div className="w-full h-48 bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-16 bg-muted rounded"></div>
                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <div className="h-4 bg-muted rounded w-12"></div>
                      <div className="h-4 bg-muted rounded w-12"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredArticles.length === 0) {
    return (
      <section className="bg-gradient-to-r from-background via-card to-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-headline font-black text-foreground mb-4">Latest Reviews</h2>
            <p className="text-muted-foreground">No featured reviews available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-background via-card to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-headline font-black text-foreground mb-4">Latest Reviews</h2>
          <p className="text-lg text-muted-foreground">In-depth reviews of the latest cars and bikes in India</p>
        </div>
        
        <div className="relative">
          {/* Navigation Arrows */}
          {featuredArticles.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                onClick={prevSlide}
                data-testid="button-prev-review"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                onClick={nextSlide}
                data-testid="button-next-review"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}
          
          {/* Featured Articles Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div
                key={article.id}
                className={`bg-card rounded-lg overflow-hidden shadow-xl hover-lift transition-all duration-500 ${
                  index === currentIndex ? "ring-2 ring-primary" : ""
                }`}
                data-testid={`featured-article-${index}`}
              >
                <Link href={`/article/${article.id}`}>
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover cursor-pointer"
                  />
                </Link>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                      REVIEW
                    </span>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      <span data-testid={`text-views-featured-${index}`}>
                        {article.views > 1000 ? `${(article.views / 1000).toFixed(1)}K` : article.views}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-headline font-bold text-foreground mb-2">
                    <Link 
                      href={`/article/${article.id}`}
                      className="hover:text-primary transition-colors"
                      data-testid={`link-featured-${index}`}
                    >
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-muted-foreground mb-4" data-testid={`text-excerpt-featured-${index}`}>
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-muted-foreground">
                        <Heart className="w-4 h-4 mr-1" />
                        <span data-testid={`text-likes-featured-${index}`}>{article.likes}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`text-readtime-featured-${index}`}>
                      {article.readTime} min read
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dots Indicator */}
          {featuredArticles.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {featuredArticles.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  data-testid={`dot-indicator-${index}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
