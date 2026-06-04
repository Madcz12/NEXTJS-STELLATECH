"use client";

import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  _count: {
    products: number;
  };
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {/* All Products Button */}
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            "px-4 py-2 rounded-full border font-medium text-sm transition-all whitespace-nowrap",
            selectedCategory === null
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
          )}
        >
          Todos los productos
          <span className={cn(
            "ml-2 px-2 py-0.5 rounded-full text-xs font-semibold",
            selectedCategory === null
              ? "bg-primary-foreground/20"
              : "bg-muted"
          )}>
            {categories.reduce((acc, cat) => acc + cat._count.products, 0)}
          </span>
        </button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "px-4 py-2 rounded-full border font-medium text-sm transition-all whitespace-nowrap",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {category.name}
            <span className={cn(
              "ml-2 px-2 py-0.5 rounded-full text-xs font-semibold",
              selectedCategory === category.id
                ? "bg-primary-foreground/20"
                : "bg-muted"
            )}>
              {category._count.products}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
