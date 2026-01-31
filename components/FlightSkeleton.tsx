export default function FlightSkeleton() {
  return (
    <div className="border border-card-border p-4 rounded-xl bg-card-bg animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
        <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded" />
        <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
      </div>
      <div className="mt-4 h-10 w-full bg-zinc-200 dark:bg-zinc-700 rounded" />
    </div>
  );
}