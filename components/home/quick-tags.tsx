import Link from 'next/link';

const QUICK_TAGS = [
  { label: '商品主图', query: '商品主图' },
  { label: '会议纪要', query: '会议纪要' },
  { label: '分镜视频', query: '分镜' },
  { label: '文档写作', query: '文档写作' },
  { label: '营销海报', query: '营销海报' },
  { label: 'PPT 汇报', query: '汇报' },
  { label: '出海电商', query: '出海' },
  { label: '短剧剧本', query: '剧本' },
];

export function QuickTags() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      <span className="text-xs text-muted-foreground">热门搜索：</span>
      {QUICK_TAGS.map((tag) => (
        <Link
          key={tag.label}
          href={`/tools?q=${encodeURIComponent(tag.query)}`}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          {tag.label}
        </Link>
      ))}
    </div>
  );
}
