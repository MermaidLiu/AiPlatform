import type { Metadata } from 'next';
import { getAllNews } from '@/lib/data';

export const metadata: Metadata = {
  title: '快讯',
  description: 'AI 工具与行业动态快讯',
};

export default function NewsPage() {
  const news = getAllNews();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">快讯</h1>
      <p className="mt-2 text-muted-foreground">行业动态与产品更新</p>

      <div className="mt-8 space-y-6">
        {news.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <time className="text-xs text-muted-foreground">
              {new Date(item.publishedAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-muted-foreground">{item.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
