import Link from 'next/link';
import { SearchBar } from '@/components/search/search-bar';
import { QuickTags } from '@/components/home/quick-tags';
import { SectionHeader } from '@/components/home/section-header';
import { OwnedToolsSection } from '@/components/home/owned-tools-section';
import { CategoryToolSection } from '@/components/home/category-tool-section';
import { FlowCard } from '@/components/flows/flow-card';
import { ToolCard } from '@/components/tools/tool-card';
import { categories } from '@/data/categories';
import { getFeaturedFlows } from '@/data/flows';
import {
  getAllNews,
  getHotTools,
  getLatestTools,
  getPublicTools,
  isToolNew,
} from '@/lib/data';
import type { Category } from '@/types';

export default function HomePage() {
  const hotTools = getHotTools(10);
  const latestTools = getLatestTools(8);
  const featuredFlows = getFeaturedFlows(5);
  const latestNews = getAllNews().slice(0, 3);
  const toolCount = getPublicTools().length;

  return (
    <div className="bg-[#f5f7fa]">
      {/* Hero — ai-bot 风格：搜索为核心 */}
      <section className="border-b bg-white pb-8 pt-10 sm:pb-10 sm:pt-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            AgentFlow Guide
            <span className="mt-1 block text-base font-normal text-muted-foreground sm:text-lg">
              办公 · 短漫剧 · 电商 AI 工具与流程向导
            </span>
          </h1>
          <div className="mx-auto mt-6 max-w-xl">
            <SearchBar
              size="lg"
              placeholder="搜索 AI 工具、任务场景或流程…"
            />
          </div>
          <QuickTags />
          <p className="mt-4 text-xs text-muted-foreground">
            已收录 {toolCount} 个工具 · 自研与第三方并列对比 · 人工核验
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* 品类快捷入口 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/owned"
            className="rounded-lg border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm hover:border-violet-300"
          >
            自研工具
          </Link>
          <Link
            href="/flow"
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:text-primary"
          >
            流程向导
          </Link>
        </div>

        {/* 自研工具流专区 — Phase 2 */}
        <OwnedToolsSection />

        {/* 热门工具 — 横向紧凑 */}
        <section className="rounded-2xl border bg-white p-4 sm:p-5">
          <SectionHeader title="热门工具" href="/tools" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {hotTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} variant="compact" />
            ))}
          </div>
        </section>

        {/* 最新收录 */}
        <section className="rounded-2xl border bg-white p-4 sm:p-5">
          <SectionHeader title="最新收录" href="/tools" linkLabel="全部工具" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                variant="compact"
                isNew={isToolNew(tool)}
              />
            ))}
          </div>
        </section>

        {/* 按品类分块 — ai-bot 核心布局 */}
        {(categories.map((c) => c.id) as Category[]).map((catId) => (
          <CategoryToolSection key={catId} category={catId} limit={12} />
        ))}

        {/* 热门流程 */}
        <section className="rounded-2xl border bg-white p-4 sm:p-5">
          <SectionHeader
            title="热门流程"
            subtitle="场景 → 步骤 → 工具，手把手走完任务"
            href="/flow"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFlows.slice(0, 6).map((flow) => (
              <FlowCard key={flow.id} flow={flow} compact />
            ))}
          </div>
        </section>

        {/* 快讯 */}
        <section className="rounded-2xl border bg-white p-4 sm:p-5">
          <SectionHeader title="每日快讯" href="/news" />
          <div className="divide-y">
            {latestNews.map((item) => (
              <article key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                <time className="shrink-0 text-xs text-muted-foreground pt-0.5">
                  {new Date(item.publishedAt).toLocaleDateString('zh-CN', {
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </time>
                <div>
                  <h3 className="text-sm font-medium leading-snug hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {item.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
