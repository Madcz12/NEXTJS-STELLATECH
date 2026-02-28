"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CheckoutButton() {
  const [isPending, startTransition] = useTransition();
  const cartItems = useAppSelector((state) => state.cart.items);
  const router = useRouter();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    startTransition(async () => {
      try {
        const { url } = await createCheckoutSession(
          cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }))
        );
        
        if (url) {
          // Redirect to Polar checkout
          window.location.href = url;
        } else {
          toast.error("Failed to generate checkout URL");
        }
      } catch (error) {
        toast.error("Checkout Failed", {
          description: error instanceof Error ? error.message : "An unexpected error occurred",
        });
      }
    });
  };

  return (
    <Button 
      className="w-full" 
      size="lg" 
      onClick={handleCheckout} 
      disabled={isPending || cartItems.length === 0}
    >
      {isPending ? (
        <>
          <Spinner size="sm" className="mr-2" />
          Processing...
        </>
      ) : (
        "Proceed to Checkout"
      )}
    </Button>
  );
}
