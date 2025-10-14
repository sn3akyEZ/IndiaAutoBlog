import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gauge, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Mock newsletter subscription
    toast({ title: "Successfully subscribed to newsletter!" });
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/">
              <h3 className="text-xl font-headline font-black gradient-text mb-4 flex items-center cursor-pointer" data-testid="link-footer-home">
                <Gauge className="mr-2" />
                RevLimits
              </h3>
            </Link>
            <p className="text-muted-foreground mb-4">
              India's premier destination for automotive journalism, reviews, and industry insights.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-social-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-social-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-social-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-social-youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="link-about">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="link-contact">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="link-advertise">
                  Advertise
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/category/car-news">
                  <span className="hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-car-news">
                    Car News
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/category/bike-news">
                  <span className="hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-bike-news">
                    Bike News
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/category/reviews">
                  <span className="hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-reviews">
                    Reviews
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/category/technology">
                  <span className="hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-technology">
                    Technology
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Newsletter</h4>
            <p className="text-muted-foreground text-sm mb-3">
              Stay updated with latest automotive news
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border"
                data-testid="input-footer-newsletter"
              />
              <Button 
                type="submit" 
                className="w-full"
                size="sm"
                data-testid="button-footer-newsletter"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 RevLimits. All rights reserved. | Professional automotive journalism for India</p>
        </div>
      </div>
    </footer>
  );
}
