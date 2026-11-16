// Instant placeholder shown by route-level loading.tsx while the next page's
// code and data load, so switching menus responds immediately.
export default function PageLoading() {
  return (
    <div
      className="animate-pulse space-y-5"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="h-[110px] rounded-[20px] bg-white/30" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[110px] rounded-[16px] bg-gray-100" />
        ))}
      </div>
      <div className="h-[360px] rounded-[20px] bg-gray-100" />
    </div>
  );
}
