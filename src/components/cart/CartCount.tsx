"use client";

import { useAppSelector } from "@/store/hooks";

export function CartCount() {
  const items = useAppSelector((state) => state.cart.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {itemCount}
    </span>
  );
}
