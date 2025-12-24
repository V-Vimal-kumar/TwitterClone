import { MessageCircle, Heart } from "lucide-react";

export default function TweetActions({
  liked,
  likesCount,
  commentsCount,
  onLike,
  onComment,
}) {
  return (
    <div className="flex justify-between max-w-[320px] mt-3 text-[#71767B] text-sm">

      {/* COMMENTS */}
      <div
        onClick={onComment}
        className="flex items-center gap-2 cursor-pointer hover:text-[#1D9BF0]"
      >
        <MessageCircle size={18} />
        {commentsCount > 0 && <span>{commentsCount}</span>}
      </div>

      {/* LIKES */}
      <div
        onClick={onLike}
        className={`flex items-center gap-2 cursor-pointer ${
          liked ? "text-pink-500" : "hover:text-pink-500"
        }`}
      >
        <Heart size={18} fill={liked ? "currentColor" : "none"} />
        {likesCount > 0 && <span>{likesCount}</span>}
      </div>
    </div>
  );
}
