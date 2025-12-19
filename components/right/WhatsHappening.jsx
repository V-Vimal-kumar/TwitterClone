import news from "@/data/news.json";
import NewsItem from "./NewsItem";

export default function WhatsHappening() {
  return (
    <section className="mt-4 rounded-2xl border border-[var(--border)] overflow-hidden">
      <h2 className="px-4 py-3 text-xl font-bold">
        What’s happening
      </h2>

      {news.map(item => (
        <NewsItem key={item.id} item={item} />
      ))}

      <div className="px-4 py-3 text-[#1D9BF0] hover:bg-[var(--hover)] cursor-pointer text-sm">
        Show more
      </div>
    </section>
  );
}
