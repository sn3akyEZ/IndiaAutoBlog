import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Article } from "@shared/schema";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsDown, Share2, Eye, Clock } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ArticlePage() {
  const [, params] = useRoute("/article/:id");
  const { toast } = useToast();
  
  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ["/api/articles", params?.id],
    enabled: !!params?.id,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/articles/${params?.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles", params?.id] });
      toast({ title: "Article liked!" });
    },
    onError: () => {
      toast({ title: "Failed to like article", variant: "destructive" });
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/articles/${params?.id}/dislike`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles", params?.id] });
      toast({ title: "Article disliked!" });
    },
    onError: () => {
      toast({ title: "Failed to dislike article", variant: "destructive" });
    },
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded w-32 mb-8"></div>
            <div className="w-full h-96 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-headline font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    "car-news": "bg-primary text-primary-foreground",
    "bike-news": "bg-accent text-accent-foreground",
    "reviews": "bg-secondary text-secondary-foreground",
    "technology": "bg-chart-2 text-white",
    "industry": "bg-chart-3 text-black",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article>
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded text-sm font-semibold ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}>
                {article.category.replace("-", " ").toUpperCase()}
              </span>
              <div className="flex items-center text-muted-foreground text-sm space-x-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTime} min read
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {article.views.toLocaleString()} views
                </span>
              </div>
            </div>
            
            <h1 className="text-4xl font-headline font-black text-foreground mb-4">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                By {article.author} • {new Date(article.createdAt).toLocaleDateString()}
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeMutation.mutate()}
                  disabled={likeMutation.isPending}
                  data-testid="button-like"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {article.likes}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dislikeMutation.mutate()}
                  disabled={dislikeMutation.isPending}
                  data-testid="button-dislike"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  {article.dislikes}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  data-testid="button-share"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </header>
          
          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
