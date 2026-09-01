import { SearchBar } from '@/components/search/search-bar';
import { QuickTags } from '@/components/home/quick-tags';
import { DailyNewsPanel } from '@/components/home/daily-news-panel';
import { getFeaturedNewsItems, getPublicTools } from '@/lib/data';

export function HeroSearchNewsRow() {
  const featuredNews = getFeaturedNewsItems(5);
  const toolCount = getPublicTools().length;

  return (
    <section className="border-b bg-white pb-6 pt-8 sm:pb-8 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              AgentFlow Guide
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              办公 · 短漫剧 · 电商 AI 工具与流程向导
            </p>
            <div className="mt-5">
              <SearchBar
                size="lg"
                placeholder="搜索 AI 工具、任务场景或流程…"
              />
            </div>
            <QuickTags />
            <p className="mt-3 text-xs text-muted-foreground">
              已收录 {toolCount} 个工具 · 自研与第三方并列对比 · 人工核验
            </p>
          </div>
          <DailyNewsPanel items={featuredNews} />
        </div>
      </div>
    </section>
  );
}
