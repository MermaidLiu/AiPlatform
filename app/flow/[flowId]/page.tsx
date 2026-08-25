import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolCard } from '@/components/tools/tool-card';
import { Badge } from '@/components/ui/badge';
import { getCategoryLabel } from '@/data/categories';
import { flows } from '@/data/flows';
import { getAllTools } from '@/lib/data';
import { sortCandidateTools } from '@/lib/search';

interface PageProps {
  params: { flowId: string };
}

export async function generateStaticParams() {
  return flows.map((f) => ({ flowId: f.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const flow = flows.find((f) => f.id === params.flowId);
  if (!flow) return { title: '流程未找到' };
  return { title: flow.title, description: flow.description };
}

export default function FlowDetailPage({ params }: PageProps) {
  const flow = flows.find((f) => f.id === params.flowId);
  if (!flow) notFound();

  const allTools = getAllTools();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{getCategoryLabel(flow.category)}</Badge>
        <Badge variant="secondary">{flow.scenario}</Badge>
        <Badge variant="secondary">{flow.difficulty}</Badge>
        {flow.fullOwnedFlow && <Badge variant="owned">全自研链路</Badge>}
      </div>

      <h1 className="mt-4 text-3xl font-bold">{flow.title}</h1>
      <p className="mt-3 text-muted-foreground">{flow.description}</p>

      <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
        <span>费用估算：{flow.estimatedCost}</span>
        <span>{flow.viewCount.toLocaleString()} 次浏览</span>
      </div>

      <section className="mt-10 space-y-8">
        {flow.steps.map((step, index) => {
          const candidates = sortCandidateTools(
            step.candidateTools,
            allTools,
            true
          );

          return (
            <div key={step.stepNumber} className="relative pl-8">
              {index < flow.steps.length - 1 && (
                <div className="absolute left-3 top-10 h-full w-px bg-border" />
              )}
              <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {step.stepNumber}
              </div>
              <h2 className="text-lg font-semibold">{step.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {candidates.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    showOwnedRecommend
                    className="text-sm"
                  />
                ))}
              </div>

              {step.handoffNote && (
                <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">
                  ↓ 衔接：{step.handoffNote}
                </p>
              )}
            </div>
          );
        })}
      </section>

      <div className="mt-10 border-t pt-6">
        <Link href="/flow" className="text-sm text-primary hover:underline">
          ← 返回流程列表
        </Link>
      </div>
    </div>
  );
}
