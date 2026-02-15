import { getAllProducts } from "@/lib/actions/products";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await getAllProducts();
  const availableCount = products.length;

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Full Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Browse through our entire collection of premium tech.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-lg w-fit">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">
            {availableCount} Products available now
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="group relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
          >
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
      
      {products.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground italic">Restocking soon...</p>
        </div>
      )}
    </div>
  );
}
