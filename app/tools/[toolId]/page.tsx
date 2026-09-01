import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AgencyBadge } from '@/components/badges/agency-badge';
import { OwnedBadge } from '@/components/badges/owned-badge';
import { ToolAgencyEnhancement } from '@/components/tools/tool-agency-enhancement';
import { ToolOwnedEnhancement } from '@/components/tools/tool-owned-enhancement';
import { TokenBasePlayground } from '@/components/tools/token-base-playground';
import { ToolIcon } from '@/components/tools/tool-icon';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { getCategoryLabel } from '@/data/categories';
import { flows } from '@/data/flows';
import { getToolById, getAllTools } from '@/lib/data';
import { getVerificationHint, getVerificationLabel } from '@/lib/verification';

interface PageProps {
  params: { toolId: string };
}

export async function generateStaticParams() {
  return getAllTools().map((t) => ({ toolId: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolById(params.toolId);
  if (!tool) return { title: '工具未找到' };
  return {
    title: tool.name,
    description: tool.tagline,
  };
}

export default function ToolDetailPage({ params }: PageProps) {
  const tool = getToolById(params.toolId);
  if (!tool) notFound();

  const relatedFlows = flows.filter((f) =>
    f.steps.some((s) => s.candidateTools.includes(tool.id))
  );

  const verificationHint = getVerificationHint(tool);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <ToolIcon
          icon={tool.icon}
          name={tool.name}
          category={tool.category[0]}
          size="lg"
        />
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            {tool.owned && <OwnedBadge />}
            {tool.agencyDiscount && <AgencyBadge />}
            <Badge
              variant={
                tool.verificationStatus === 'verified' ? 'verified' : 'pending'
              }
            >
              {getVerificationLabel(tool.verificationStatus)}
            </Badge>
            <Badge variant="secondary">{tool.difficulty}</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{tool.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{tool.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tool.category.map((c) => (
              <Link key={c} href={`/category/${c}`}>
                <Badge variant="secondary" className="cursor-pointer">
                  {getCategoryLabel(c)}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {tool.ageRestricted && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          ⚠️ 本工具含成人向内容，仅限 18 岁以上且通过资质审核的用户使用。
        </div>
      )}

      {verificationHint && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {verificationHint}
        </div>
      )}

      {/* 自研 / 代理增强 — Phase 2 */}
      {tool.owned && <ToolOwnedEnhancement tool={tool} />}
      {tool.agencyDiscount && <ToolAgencyEnhancement tool={tool} />}

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={tool.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants('default')}
        >
          前往产品页 →
        </a>
        {tool.tutorialUrl && (
          <a
            href={tool.tutorialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants('outline')}
          >
            查看教程
          </a>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tool.isFree && <Badge variant="secondary">免费</Badge>}
        {tool.hasChinese && <Badge variant="secondary">有中文</Badge>}
        {tool.hasTutorial && <Badge variant="secondary">有教程</Badge>}
        {tool.mobileReady && <Badge variant="secondary">手机可用</Badge>}
      </div>

      <Section title="能力描述">
        <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      </Section>

      <Section title="适用场景">
        <div className="flex flex-wrap gap-2">
          {tool.scenarios.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="怎么用">
        <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
          {tool.howToUse.split('\n').map((line, i) => (
            <li key={i}>{line.replace(/^\d+\.\s*/, '')}</li>
          ))}
        </ol>
      </Section>

      <Section title="费用说明">
        <p className="text-muted-foreground">{tool.pricing}</p>
      </Section>

      {tool.faq.length > 0 && (
        <Section title="常见问题">
          <dl className="space-y-4">
            {tool.faq.map((item) => (
              <div key={item.q}>
                <dt className="font-medium">{item.q}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {relatedFlows.length > 0 && (
        <Section title="所属流程">
          <ul className="space-y-2">
            {relatedFlows.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/flow/${f.id}`}
                  className="text-primary hover:underline"
                >
                  {f.title}
                </Link>
                <span className="ml-2 text-sm text-muted-foreground">
                  · {f.scenario}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {tool.id === 'token-aggregator' && (
        <div id="playground">
          <TokenBasePlayground />
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        最后核验：{new Date(tool.lastVerified).toLocaleDateString('zh-CN')}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 border-t pt-8">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
