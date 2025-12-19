export default function NewsItem({ item }) {
  return (
    <div className="px-4 py-3 hover:bg-[var(--hover)] cursor-pointer">
      <p className="text-xs text-[#71767B]">
        {item.category}
      </p>
      <p className="mt-1 font-semibold leading-snug">
        {item.title}
      </p>
    </div>
  );
}
