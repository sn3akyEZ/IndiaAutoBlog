import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Article } from "@shared/schema";
import Navigation from "@/components/navigation";
import ArticleCard from "@/components/article-card";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:category");
  const category = params?.category || "";
  
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", category],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (category && category !== "all") {
        searchParams.append("category", category);
      }
      searchParams.append("status", "published");
      
      const response = await fetch(`/api/articles?${searchParams}`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
    enabled: !!category,
  });

  const getCategoryTitle = (cat: string) => {
    const titles: Record<string, string> = {
      "car-news": "Car News",
      "bike-news": "Bike News", 
      "reviews": "Reviews",
      "technology": "Technology",
      "industry": "Industry News",
    };
    return titles[cat] || "Articles";
  };

  const getCategoryDescription = (cat: string) => {
    const descriptions: Record<string, string> = {
      "car-news": "Latest news and updates from the automotive world",
      "bike-news": "Breaking news and updates from the motorcycle industry",
      "reviews": "In-depth reviews of the latest cars and bikes",
      "technology": "Automotive technology and innovation news",
      "industry": "Industry trends and business news",
    };
    return descriptions[cat] || "Browse our collection of articles";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-headline font-black text-foreground mb-4">
            {getCategoryTitle(category)}
          </h1>
          <p className="text-xl text-muted-foreground">
            {getCategoryDescription(category)}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
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
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-headline font-bold text-foreground mb-4">
                  No Articles Found
                </h2>
                <p className="text-muted-foreground">
                  No articles available in the {getCategoryTitle(category)} category at the moment.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
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