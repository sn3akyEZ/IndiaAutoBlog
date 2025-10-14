import { useQuery, useMutation } from "@tanstack/react-query";
import { Article, InsertArticle } from "@shared/schema";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import AdminPanel from "@/components/admin-panel";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AdminPanel />
    </div>
  );
}
