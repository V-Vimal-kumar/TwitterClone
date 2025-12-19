export default function TweetComposer() {
  return (
    <div className="flex gap-3 px-4 py-4 border-b border-[var(--border)]">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[var(--border)]" />

      {/* Input */}
      <input
        placeholder="What is happening?!"
        className="flex-1 bg-transparent outline-none text-xl text-[var(--text)] placeholder-[var(--muted)]"/>
    </div>
  );
}
