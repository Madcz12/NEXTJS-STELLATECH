"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  productId: string;
}

export function BuyNowButton({ productId }: BuyNowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBuyNow = () => {
    if (!session) {
      // Redirect to login with callback to return to this product page after login
      router.push(`/login?callbackUrl=/product/${productId}`);
    } else {
      // If logged in, go directly to checkout
      router.push(`/checkout`);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      className="cursor-pointer flex-1 h-12 border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      Buy Now
    </button>
  );
}
