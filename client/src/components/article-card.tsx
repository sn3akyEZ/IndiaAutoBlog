import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsDown, Share2, Eye } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { toast } = useToast();

  const likeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/articles/${article.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Article liked!" });
    },
    onError: () => {
      toast({ title: "Failed to like article", variant: "destructive" });
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/articles/${article.id}/dislike`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Article disliked!" });
    },
    onError: () => {
      toast({ title: "Failed to dislike article", variant: "destructive" });
    },
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: `${window.location.origin}/article/${article.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/article/${article.id}`);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  const categoryColors: Record<string, string> = {
    "car-news": "bg-primary text-primary-foreground",
    "bike-news": "bg-accent text-accent-foreground",
    "reviews": "bg-secondary text-secondary-foreground",
    "technology": "bg-chart-2 text-white",
    "industry": "bg-chart-3 text-black",
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <article className="bg-card rounded-lg overflow-hidden shadow-lg hover-lift" data-testid={`card-article-${article.id}`}>
      <Link href={`/article/${article.id}`}>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover cursor-pointer"
          data-testid={`img-article-${article.id}`}
        />
      </Link>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span 
            className={`px-2 py-1 rounded text-xs font-semibold ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}
            data-testid={`text-category-${article.id}`}
          >
            {article.category.replace("-", " ").toUpperCase()}
          </span>
          <time 
            className="text-sm text-muted-foreground"
            data-testid={`text-time-${article.id}`}
          >
            {formatTimeAgo(article.createdAt)}
          </time>
        </div>
        
        <h3 className="text-xl font-headline font-bold text-foreground mb-3 hover:text-primary transition-colors">
          <Link 
            href={`/article/${article.id}`}
            data-testid={`link-article-${article.id}`}
          >
            {article.title}
          </Link>
        </h3>
        
        <p 
          className="text-muted-foreground mb-4"
          data-testid={`text-excerpt-${article.id}`}
        >
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                likeMutation.mutate();
              }}
              disabled={likeMutation.isPending}
              data-testid={`button-like-${article.id}`}
            >
              <Heart className="w-4 h-4 mr-1" />
              <span data-testid={`text-likes-${article.id}`}>{article.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                dislikeMutation.mutate();
              }}
              disabled={dislikeMutation.isPending}
              data-testid={`button-dislike-${article.id}`}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              <span data-testid={`text-dislikes-${article.id}`}>{article.dislikes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleShare();
              }}
              data-testid={`button-share-${article.id}`}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <Eye className="w-4 h-4 mr-1" />
            <span data-testid={`text-views-${article.id}`}>
              {article.views > 1000 ? `${(article.views / 1000).toFixed(1)}K` : article.views}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
