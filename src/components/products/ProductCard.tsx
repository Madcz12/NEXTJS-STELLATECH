"use client"

import Link from "next/link"
import { AddToCartButton } from "@/components/cart/AddToCartButton"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: any;
    image: string;
    isNew?: boolean;
    category: {
      id: string;
      name: string;
    };
    description?: string;
  };
  showDescription?: boolean;
  className?: string;
}

export function ProductCard({ product, showDescription = false, className }: ProductCardProps) {
  const priceValue = parseFloat(product.price?.toString() || "0").toFixed(2)

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]",
        className
      )}
    >
      {/* Decorative mechanical corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-muted-foreground/20 group-hover:border-primary/40 transition-colors duration-300" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-muted-foreground/20 group-hover:border-primary/40 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-muted-foreground/20 group-hover:border-primary/40 transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-muted-foreground/20 group-hover:border-primary/40 transition-colors duration-300" />

      {/* Cyber Grid pattern inside card background */}
      <div className="absolute inset-0 bg-tech-dots opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-300" />

      <div>
        {/* Product Image Area */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted/30 border-b border-border/20">
          <Link href={`/product/${product.id}`} className="block h-full w-full">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </Link>
          
          {/* Status Badge */}
          {product.isNew && (
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold tracking-wider bg-primary/10 text-primary border border-primary/20 backdrop-blur-md shadow-sm">
              NEW_RELEASE
            </span>
          )}

          {/* Category Tag */}
          <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[9px] font-sans tracking-widest bg-neutral-950/70 text-neutral-300 border border-white/5 backdrop-blur-sm uppercase">
            {product.category.name}
          </span>
        </div>

        {/* Content Info */}
        <div className="p-5 space-y-2 relative">
          <Link href={`/product/${product.id}`} className="block group/link">
            <h3 className="font-sans font-bold text-base leading-tight tracking-tight text-foreground transition-colors group-hover/link:text-primary line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {showDescription && product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-sans">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-border/10 bg-muted/10">
        <div className="flex flex-col">
          <span className="text-[10px] font-sans tracking-wider text-muted-foreground uppercase">PRICE</span>
          <span className="text-lg font-sans font-bold text-foreground tracking-tight">${priceValue}</span>
        </div>

        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            price: parseFloat(priceValue),
            image: product.image,
          }}
          variant="icon"
        />
      </div>
    </div>
  )
}
