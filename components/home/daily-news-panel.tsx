import Link from 'next/link';
import { SectionHeader } from '@/components/home/section-header';
import { formatNewsPanelDate } from '@/lib/news';
import type { NewsItem } from '@/types';

interface DailyNewsPanelProps {
  items: NewsItem[];
}

export function DailyNewsPanel({ items }: DailyNewsPanelProps) {
  return (
    <aside className="flex h-full flex-col rounded-2xl border bg-white p-4 sm:p-5">
      <SectionHeader title="每日 AI 资讯" href="/news" linkLabel="更多" />
      <ul className="flex-1 divide-y">
        {items.map((item) => (
          <li key={item.id}>
            <NewsPanelRow item={item} />
          </li>
        ))}
      </ul>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">暂无资讯</p>
      )}
    </aside>
  );
}

function NewsPanelRow({ item }: { item: NewsItem }) {
  const content = (
    <>
      <time className="shrink-0 text-xs text-muted-foreground">
        {formatNewsPanelDate(item.publishedAt)}
      </time>
      <h3 className="line-clamp-2 text-sm font-medium leading-snug text-slate-800 group-hover:text-primary">
        {item.title}
      </h3>
    </>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-3 py-3 first:pt-0 last:pb-0"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href="/news"
      className="group flex gap-3 py-3 first:pt-0 last:pb-0"
    >
      {content}
    </Link>
  );
}
