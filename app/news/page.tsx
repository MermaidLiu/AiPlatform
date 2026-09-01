import type { Metadata } from 'next';
import Link from 'next/link';
import { newsItems } from '@/data/news';
import { groupNewsByDate } from '@/lib/news';

export const metadata: Metadata = {
  title: '每日资讯',
  description: 'AI 工具与行业动态每日资讯',
};

export default function NewsPage() {
  const groupedNews = groupNewsByDate(newsItems);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">每日资讯</h1>
      <p className="mt-2 text-muted-foreground">
        AI 工具与行业动态，按日期分组展示
      </p>

      <div className="mt-8 space-y-10">
        {groupedNews.map((group) => (
          <section key={group.dateLabel}>
            <h2 className="border-b pb-2 text-lg font-semibold text-slate-800">
              {group.dateLabel}
            </h2>
            <div className="mt-4 space-y-4">
              {group.items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border bg-card p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                  </div>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block text-lg font-semibold hover:text-primary"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  )}
                  <p className="mt-2 text-muted-foreground">{item.summary}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {groupedNews.length === 0 && (
        <p className="mt-8 text-muted-foreground">暂无已发布资讯</p>
      )}

      <p className="mt-10 text-center text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          返回首页
        </Link>
      </p>
    </div>
  );
}
