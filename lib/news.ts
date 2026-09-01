import type { NewsItem } from '@/types';

export function getPublishedNews(items: NewsItem[]): NewsItem[] {
  return items
    .filter((item) => item.status !== 'draft' && item.status !== 'offline')
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function formatNewsPanelDate(publishedAt: string): string {
  return new Date(publishedAt).toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  });
}

export function formatNewsGroupDate(item: NewsItem): string {
  if (item.dateLabel) return item.dateLabel;
  const date = new Date(item.publishedAt);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${date.getMonth() + 1}月${date.getDate()}日 · ${weekdays[date.getDay()]}`;
}

export function groupNewsByDate(
  items: NewsItem[]
): { dateLabel: string; items: NewsItem[] }[] {
  const sorted = getPublishedNews(items);
  const groups = new Map<string, NewsItem[]>();

  for (const item of sorted) {
    const label = formatNewsGroupDate(item);
    const bucket = groups.get(label);
    if (bucket) {
      bucket.push(item);
    } else {
      groups.set(label, [item]);
    }
  }

  return Array.from(groups.entries()).map(([dateLabel, groupItems]) => ({
    dateLabel,
    items: groupItems,
  }));
}

export function getFeaturedNews(items: NewsItem[], limit = 5): NewsItem[] {
  return getPublishedNews(items).slice(0, limit);
}
