import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Article, InsertArticle } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Edit, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertArticleSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function AdminPanel() {
  const { toast } = useToast();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const form = useForm<InsertArticle>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "car-news",
      imageUrl: "",
      author: "Admin",
      status: "published",
      likes: 0,
      dislikes: 0,
      views: 0,
      readTime: 5,
      featured: false,
    },
  });

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", "admin", categoryFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      
      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      return apiRequest("POST", "/api/articles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Article created successfully!" });
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to create article", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertArticle> }) => {
      return apiRequest("PUT", `/api/articles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Article updated successfully!" });
      setEditingArticle(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to update article", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Article deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete article", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertArticle) => {
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    form.reset({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      imageUrl: article.imageUrl,
      author: article.author,
      status: article.status,
      likes: article.likes,
      dislikes: article.dislikes,
      views: article.views,
      readTime: article.readTime,
      featured: article.featured,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id);
    }
  };

  const categoryDisplayNames: Record<string, string> = {
    "car-news": "Car News",
    "bike-news": "Bike News",
    "reviews": "Reviews",
    "technology": "Technology",
    "industry": "Industry",
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-card shadow-xl">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-2xl font-headline font-bold text-foreground flex items-center">
              <Shield className="text-primary mr-3" />
              RevLimits Admin Panel
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs defaultValue="articles" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="articles" data-testid="tab-articles">Articles</TabsTrigger>
                <TabsTrigger value="create" data-testid="tab-create">
                  {editingArticle ? "Edit Article" : "Create New"}
                </TabsTrigger>
                <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Articles Management */}
              <TabsContent value="articles" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-headline font-semibold text-foreground">Manage Articles</h3>
                  <div className="flex space-x-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40" data-testid="select-category-filter">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="car-news">Car News</SelectItem>
                        <SelectItem value="bike-news">Bike News</SelectItem>
                        <SelectItem value="reviews">Reviews</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="industry">Industry</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32" data-testid="select-status-filter">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Article List */}
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
                          <div className="h-6 bg-background rounded mb-2"></div>
                          <div className="h-4 bg-background rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : articles.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No articles found.</p>
                    </div>
                  ) : (
                    articles.map((article) => (
                      <div 
                        key={article.id} 
                        className="bg-muted rounded-lg p-4 flex items-center justify-between"
                        data-testid={`admin-article-${article.id}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-foreground" data-testid={`text-title-${article.id}`}>
                              {article.title}
                            </h4>
                            <Badge variant={article.category === "reviews" ? "default" : "secondary"}>
                              {categoryDisplayNames[article.category]}
                            </Badge>
                            <Badge variant={article.status === "published" ? "default" : "secondary"}>
                              {article.status}
                            </Badge>
                            {article.featured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                            <span>By {article.author}</span>
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {article.views.toLocaleString()} views
                            </span>
                            <span>{article.likes} likes</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(article)}
                            data-testid={`button-edit-${article.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/article/${article.id}`, '_blank')}
                            data-testid={`button-view-${article.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-${article.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Create/Edit Article Form */}
              <TabsContent value="create">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-headline font-semibold text-foreground">
                      {editingArticle ? "Edit Article" : "Create New Article"}
                    </h3>
                    {editingArticle && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingArticle(null);
                          form.reset();
                        }}
                        data-testid="button-cancel-edit"
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-category">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="car-news">Car News</SelectItem>
                                  <SelectItem value="bike-news">Bike News</SelectItem>
                                  <SelectItem value="reviews">Reviews</SelectItem>
                                  <SelectItem value="technology">Technology</SelectItem>
                                  <SelectItem value="industry">Industry</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} data-testid="textarea-excerpt" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={10} data-testid="textarea-content" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Featured Image URL</FormLabel>
                              <FormControl>
                                <Input {...field} type="url" data-testid="input-image-url" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-status">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="readTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Read Time (minutes)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  min="1" 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  data-testid="input-read-time"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <Button 
                          type="submit" 
                          disabled={createMutation.isPending || updateMutation.isPending}
                          data-testid="button-submit-article"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {editingArticle ? "Update Article" : "Create Article"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>

              {/* Analytics */}
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-total-articles">
                        {articles.length}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-total-views">
                        {articles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-total-likes">
                        {articles.reduce((sum, article) => sum + article.likes, 0)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
