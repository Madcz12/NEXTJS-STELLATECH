"use client";

import Link from "next/link";
import { Star, Shield, Zap } from "lucide-react";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ProductCard } from "@/components/products/ProductCard";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: any;
  image: string;
  isNew: boolean;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  _count: {
    products: number;
  };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products/featured'),
          fetch('/api/categories')
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category.id === selectedCategory)
    : products;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Trust Indicators */}
      <section className="py-16 border-y border-border/40 bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-dots opacity-10 pointer-events-none" />
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.05)]">
              <div className="p-3.5 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Ultra Fast Shipping</h3>
              <p className="text-sm text-muted-foreground font-body-tech leading-relaxed">
                Next day delivery on all cargo orders over $100.
              </p>
            </div>

            <div className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.05)]">
              <div className="p-3.5 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">24/7 Technical Support</h3>
              <p className="text-sm text-muted-foreground font-body-tech leading-relaxed">
                Expert tech support ready to assist with deployment.
              </p>
            </div>

            <div className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.05)]">
              <div className="p-3.5 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Premium Warranty</h3>
              <p className="text-sm text-muted-foreground font-body-tech leading-relaxed">
                Full 2-year warranty on all Stella Certified products.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-sans tracking-widest text-primary font-bold">RELEASE_LOG</span>
              <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight uppercase">
                New Arrivals
              </h2>
            </div>
            <Link 
              href="/catalog" 
              className="group inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <span>Browse entire catalog</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Category Filter Container */}
          <div className="mb-10 p-2 rounded-2xl border border-border/35 bg-card/30 backdrop-blur-sm max-w-max">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          
          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border border-border/40 bg-card/40 aspect-[3/4] animate-pulse flex flex-col justify-between p-5">
                  <div className="aspect-square bg-muted/50 rounded-xl w-full" />
                  <div className="space-y-3 pt-4">
                    <div className="h-5 bg-muted/50 rounded w-3/4" />
                    <div className="h-4 bg-muted/50 rounded w-1/2" />
                    <div className="h-8 bg-muted/50 rounded w-1/3 pt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border/40 rounded-2xl bg-muted/5">
              <p className="text-muted-foreground font-mono text-sm">NO_PRODUCTS_FOUND_IN_SELECTION</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
