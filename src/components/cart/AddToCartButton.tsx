"use client"

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { useState } from "react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  variant?: "default" | "icon";
}

// ... imports

export function AddToCartButton({ product, variant = "default" }: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }));
      setIsLoading(false);
      setAdded(true);
      toast.success(`${product.name}`, {
        description: "Successfully added to your cargo.",
        action: {
          label: "View Cart",
          onClick: () => console.log("Navigate to cart"),
        },
      });
      setTimeout(() => setAdded(false), 2000);
    }, 600);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isLoading || added}
        className={`
          group relative h-10 w-10 overflow-hidden rounded-xl border border-input 
          bg-background/50 backdrop-blur-sm transition-all duration-300
          hover:border-primary hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]
          disabled:cursor-not-allowed disabled:opacity-50
          ${added ? "border-green-500 bg-green-500/10" : ""}
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading ? (
            <Spinner size="sm" className="text-primary" />
          ) : added ? (
            <span className="text-green-500 font-bold">✓</span>
          ) : (
            <span className="text-lg text-foreground group-hover:text-primary transition-colors">+</span>
          )}
        </div>
      </button>
    );
  }

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isLoading || added}
      className={`
        relative w-full overflow-hidden rounded-xl border-0
        bg-foreground bg-blue-600 text-background font-bold tracking-wide
        hover:bg-foreground/90 transition-all duration-300
        active:scale-[0.98]
        ${added ? "!bg-green-600 !text-white" : ""}
      `}
    >
      <div className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2 text-current" />
            <span className="animate-pulse">PROCESSING...</span>
          </>
        ) : added ? (
          <>
            <span>ACQUIRED</span>
            <span className="scale-125">✓</span>
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            <span>ADD TO CART</span>
          </>
        )}
      </div>
      
      {/* Bio-mechanical scan effect on hover */}
      {!isLoading && !added && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      )}
    </Button>
  );
}
