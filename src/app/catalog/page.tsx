import { Filter, Search } from "lucide-react";
import { getAllProducts } from "@/lib/actions/products";
import { ProductCard } from "@/components/products/ProductCard";

export default async function CatalogPage() {
  const rawProducts = await getAllProducts();

  // Serialize Prisma Decimal objects to plain strings
  // Required because Next.js cannot pass class instances across the Server → Client boundary
  const products = rawProducts.map((p) => ({
    ...p,
    price: p.price.toString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
  return (
    <div className="container py-12 px-4 md:px-6 mx-auto relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-tech-grid opacity-5 pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6 p-6 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm h-fit">
          <div className="flex items-center gap-2 pb-4 border-b border-border/40">
            <Filter className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-mono tracking-widest font-bold uppercase text-foreground">Filters</h2>
          </div>

          {/* Search bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="search"
              placeholder="Search database..."
              className="h-9 w-full rounded-xl border border-input/60 bg-background/50 pl-9 pr-4 text-xs font-mono tracking-wider shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
            />
          </div>
          
          {/* Categories list */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Categories</h3>
            <div className="space-y-2.5">
              {['Laptops', 'Components', 'Peripherals', 'Monitors', 'Accessories'].map((cat) => (
                <label 
                  key={cat} 
                  className="flex items-center gap-2 text-xs font-mono tracking-wide text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <input 
                    type="checkbox" 
                    className="rounded border-border/60 bg-background/50 text-primary focus:ring-primary h-3.5 w-3.5" 
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Price Threshold</h3>
            <input 
              type="range" 
              min="0" 
              max="5000" 
              className="cursor-pointer w-full accent-primary bg-muted/50 rounded-lg appearance-none h-1" 
            />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>$0</span>
              <span>$5000+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 space-y-6">
          
          {/* Grid Header */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/30 bg-muted/15">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">INVENTORY_INDEX</span>
              <h1 className="text-xl font-display font-black tracking-tight uppercase">All Products</h1>
            </div>
            <select className="cursor-pointer h-9 rounded-xl border border-input/60 bg-background/50 px-3 text-xs font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Newest Release</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {/* Product cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} showDescription={true} />
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
