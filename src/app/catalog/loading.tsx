export default function CatalogLoading() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="h-10 w-64 bg-muted rounded animate-pulse mb-8" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="border rounded-lg overflow-hidden bg-card">
            <div className="aspect-square bg-muted animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-muted rounded animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
