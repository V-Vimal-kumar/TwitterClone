import { MessageCircle, Heart } from "lucide-react";

const Action = ({ children, hover }) => (
  <div className={`flex items-center gap-2 group cursor-pointer ${hover}`}>
    {children}
  </div>
);

export default function TweetActions() {
  return (
    <div className="flex justify-between max-w-[300px] mt-3 text-[#71767B] text-sm">
      <Action hover="hover:text-[#1D9BF0]">
        <MessageCircle size={18} className="group-hover:stroke-[#1D9BF0]" />
      </Action>

      <Action hover="hover:text-pink-500">
        <Heart size={18} className="group-hover:stroke-pink-500" />
      </Action>
    </div>
  );
}
