"use client";

import Link from "next/link";
import { Star, Shield, Zap } from "lucide-react";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CategoryFilter } from "@/components/products/CategoryFilter";
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
      <section className="py-12 border-y bg-accent/5">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Ultra Fast Shipping</h3>
              <p className="text-sm text-muted-foreground">Next day delivery on all orders over $100.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Expert technicians ready to help anytime.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Premium Warranty</h3>
              <p className="text-sm text-muted-foreground">2-year warranty on all Stella Certified products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
            <Link href="/catalog" className="text-primary hover:underline underline-offset-4">
              View all
            </Link>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
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
                <div key={i} className="rounded-lg border bg-card animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-6 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-muted relative">
                    <Link href={`/product/${product.id}`}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                      />
                    </Link>
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold leading-none tracking-tight truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category.name}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold">${product.price.toString()}</span>
                      <AddToCartButton
                        product={{
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.price.toString()),
                          image: product.image,
                        }}
                        variant="icon"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
