export default function TweetSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-[var(--border)] animate-pulse">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[var(--border)]" />

      {/* Content */}
      <div className="flex-1 space-y-2">
        {/* Header line */}
        <div className="flex gap-2">
          <div className="h-3 w-24 bg-[var(--border)] rounded" />
          <div className="h-3 w-16 bg-[var(--border)] rounded" />
        </div>

        {/* Tweet lines */}
        <div className="h-3 w-full bg-[var(--border)] rounded" />
        <div className="h-3 w-[90%] bg-[var(--border)] rounded" />

        {/* Actions */}
        <div className="flex gap-10 pt-2">
          <div className="h-3 w-6 bg-[var(--border)] rounded" />
          <div className="h-3 w-6 bg-[var(--border)] rounded" />
        </div>
      </div>
    </div>
  );
}
