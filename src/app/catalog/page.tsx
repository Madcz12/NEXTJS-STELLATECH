import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { getAllProducts } from "@/lib/actions/products";

export default async function CatalogPage() {
  const products = await getAllProducts();
  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filters & Search</h2>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="search"
              placeholder="Search products..."
              className="h-9 w-full rounded-full border border-input bg-background/50 pl-9 pr-4 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Categories</h3>
            <div className="space-y-2">
              {['Laptops', 'Components', 'Peripherals', 'Monitors', 'Accessories'].map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  {cat}
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Price Range</h3>
            <input type="range" min="0" max="5000" className="cursor-pointer w-full accent-primary" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$5000+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">All Products</h1>
            <select className="cursor-pointer h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group relative rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
                 <div className="aspect-square overflow-hidden rounded-t-lg bg-muted relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold leading-none tracking-tight truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category.name}</p>
                  <p className="text-sm line-clamp-2 text-muted-foreground">{product.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold">${product.price.toString()}</span>
                    <span className="text-xs font-medium text-primary hover:underline">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
