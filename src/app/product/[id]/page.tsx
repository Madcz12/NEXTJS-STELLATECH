import { notFound } from "next/navigation";
import { Check, Star, Truck } from "lucide-react";
import { getProductById } from "@/lib/actions/products";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted border">
            <img 
              src={product.image} 
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-md bg-muted border overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary">
                <img 
                  src={product.image} 
                  alt="Thumbnail"
                  className="h-full w-full object-cover opacity-75 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 text-sm font-medium text-primary">
              {product.category.name}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>
          </div>

          <div className="text-4xl font-bold">
            ${product.price.toString()}
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-green-500">
                <Check className="h-4 w-4" /> <span>In Stock</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-4 w-4" /> <span>Free Shipping</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: parseFloat(product.price.toString()),
                  image: product.image
                }}
              />
              <button className="cursor-pointer flex-1 h-12 border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Buy Now
              </button>
            </div>
          </div>

          {/* Specs */}
          {product.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0 && (
            <div className="pt-8 space-y-4">
              <h3 className="font-semibold text-lg">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(product.specs as Record<string, string>).map(([key, value]) => (
                  <div key={key} className="p-3 bg-muted/50 rounded-lg">
                    <span className="block text-muted-foreground text-xs capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
