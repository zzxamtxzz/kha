import ClientCardLoading from "./client-loading";

export function CustomerCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <ClientCardLoading key={index} />
        ))}
    </div>
  );
}
