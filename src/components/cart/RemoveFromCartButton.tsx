"use client"

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { useAppDispatch } from "@/store/hooks";
import { removeFromCart } from "@/store/cartSlice";
import { useState } from "react";
import { toast } from "sonner";

interface RemoveFromCartButtonProps {
  productId: string;
  productName: string;
  variant?: "default" | "icon";
  className?: string;
}

export function RemoveFromCartButton({ 
  productId, 
  productName, 
  variant = "default",
  className = ""
}: RemoveFromCartButtonProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = () => {
    setIsLoading(true);
    
    // Simulating a small delay for better UX, similar to AddToCartButton
    setTimeout(() => {
      dispatch(removeFromCart(productId));
      setIsLoading(false);
      toast.error(`${productName}`, {
        description: "Removed from your cart.",
      });
    }, 400);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleRemove}
        disabled={isLoading}
        className={`
          group relative h-10 w-10 overflow-hidden rounded-xl border border-input 
          bg-background/50 backdrop-blur-sm transition-all duration-300
          hover:border-destructive hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        title="Remove item"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading ? (
            <Spinner size="sm" className="text-destructive" />
          ) : (
            <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          )}
        </div>
      </button>
    );
  }

  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleRemove} 
      disabled={isLoading}
      className={`
        relative overflow-hidden rounded-lg border-destructive/20
        text-destructive hover:bg-destructive/10 hover:text-destructive
        transition-all duration-300
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Spinner size="sm" className="text-current" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        <span>Remove</span>
      </div>
    </Button>
  );
}
