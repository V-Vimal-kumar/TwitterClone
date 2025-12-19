import TweetActions from "./TweetActions";

export default function TweetCard({ post }) {
  return (
    <article className="flex gap-3 px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors cursor-pointer">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[var(--border)] flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 text-[15px] leading-5">
          <span className="font-bold truncate">{post.name}</span>
          <span className="text-[#71767B] truncate">@{post.username}</span>
          <span className="text-[#71767B]">·</span>
          <span className="text-[#71767B]">{post.time}</span>
        </div>

        {/* Tweet text */}
        <p className="mt-1 text-[15px] leading-[20px] whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Actions */}
        <TweetActions />
      </div>
    </article>
  );
}
