export default function CartLoading() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="h-9 w-48 bg-muted rounded animate-pulse mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg bg-card">
              <div className="w-24 h-24 bg-muted rounded-md animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              </div>
              <div className="w-9 h-9 bg-muted rounded-md animate-pulse" />
            </div>
          ))}
        </div>

        {/* Order Summary Skeleton */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-card space-y-4">
            <div className="h-7 w-40 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-full bg-muted rounded animate-pulse" />
              <div className="h-5 w-full bg-muted rounded animate-pulse" />
            </div>
            <div className="border-t pt-4">
              <div className="h-6 w-full bg-muted rounded animate-pulse" />
            </div>
            <div className="h-12 w-full bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
