import type { Metadata } from 'next';
import Link from 'next/link';
import { OwnedBadge } from '@/components/badges/owned-badge';
import { AgencyBadge } from '@/components/badges/agency-badge';

export const metadata: Metadata = {
  title: '关于推荐',
  description: 'AgentFlow Guide 推荐原则与透明披露说明',
};

export default function AboutRecommendationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">关于推荐</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        我们如何做工具推荐，以及标识含义与您的选择权。
      </p>

      {/* 标识图例 */}
      <div className="mt-8 flex flex-wrap gap-4 rounded-xl border bg-white p-5">
        <div className="flex items-center gap-2">
          <OwnedBadge />
          <span className="text-sm text-muted-foreground">自研 · 归属标识</span>
        </div>
        <div className="flex items-center gap-2">
          <AgencyBadge />
          <span className="text-sm text-muted-foreground">代理 · 合作优惠</span>
        </div>
      </div>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">1. 同样的核验标准</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            自研工具与第三方工具执行<strong>同一套</strong>人工核验流程。我们会定期复核能力描述、费用、教程链接等信息。超过 90 天未复核的工具将自动标注为「待复核」，并提示用户以官方最新说明为准。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. 「自研」仅表示归属</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            <OwnedBadge className="mr-1 inline-flex align-middle" />
            角标表示该工具由我们团队自主研发或深度合作。
            <strong className="text-foreground">不代表唯一推荐，也不意味着第三方工具劣后或不可用。</strong>
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· 流程候选与搜索结果中，自研工具可能排序优先并展示「自研推荐」</li>
            <li>· 第三方工具始终并列可见，不会被屏蔽、隐藏或删除</li>
            <li>· 首页「自研工具流」专区仅为方便发现，非排他性推荐</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. 「代理优惠」说明</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            <AgencyBadge className="mr-1 inline-flex align-middle" />
            标注为代理合作产品。通过本站导流链接注册或采购，可能享有专属折扣（以活动页为准）。代理关系<strong>不影响</strong>我们对工具能力的客观描述与对比展示。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. 您可关闭「优先自研」</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            在
            <Link href="/tools" className="mx-1 text-primary hover:underline">
              工具库
            </Link>
            左侧筛选栏，可随时关闭「优先自研」开关。关闭后：
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>· 搜索结果排序恢复中立（按名称等默认规则）</li>
            <li>· 自研工具不再自动置顶</li>
            <li>· 「自研推荐」标签不再额外展示</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. 不做站内计费</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            AgentFlow Guide 是导航与向导网站，不提供站内付费或订阅闭环。所有「前往产品页」链接将导流至各工具官方页面，具体费用与条款以官方为准。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. 成人向内容披露</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            含成人向内容的工具（如 Emtional lab）不在大众首页无差别曝光，详情页有年龄提示，仅面向合规用户群体。
          </p>
        </section>

        <section className="rounded-xl border bg-slate-50 p-6">
          <h2 className="text-lg font-semibold">我们的承诺</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>✓ 自研工具同样经人工核验</li>
            <li>✓ 不隐藏第三方，不暗示「唯一推荐」</li>
            <li>✓ 标注归属，客观对比</li>
            <li>✓ 用户可自主关闭排序加权</li>
            <li>✓ 代理关系透明披露</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/tools" className="text-sm text-primary hover:underline">
              浏览工具库 →
            </Link>
            <Link href="/owned" className="text-sm text-primary hover:underline">
              查看自研工具 →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
