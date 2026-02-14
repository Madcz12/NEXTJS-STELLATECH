export default function ProductLoading() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted border animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-md bg-muted border animate-pulse" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div>
            <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
            <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
            <div className="mt-2 h-4 w-32 bg-muted rounded animate-pulse" />
          </div>

          <div className="h-12 w-32 bg-muted rounded animate-pulse" />

          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
            
            <div className="flex gap-4">
              <div className="h-12 flex-1 bg-muted rounded animate-pulse" />
              <div className="h-12 flex-1 bg-muted rounded animate-pulse" />
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
