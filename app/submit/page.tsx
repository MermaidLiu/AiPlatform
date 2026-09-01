import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '提交工具',
  description: '向 AgentFlow Guide 提交 AI 工具收录申请',
};

export default function SubmitToolPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">提交工具</h1>
      <p className="mt-2 text-muted-foreground">
        欢迎推荐优质 AI 工具，我们会按统一标准人工核验后收录。
      </p>

      <div className="mt-8 space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          请准备以下信息并通过邮件提交：
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm text-slate-700">
          <li>工具名称与一句话简介</li>
          <li>产品链接与所属品类（办公 / 短漫剧 / 电商）</li>
          <li>适用场景、定价说明、是否有中文与教程</li>
          <li>联系人邮箱（用于核验反馈）</li>
        </ul>
        <p className="text-sm">
          提交邮箱：
          <a
            href="mailto:tools@agentflow.guide"
            className="ml-1 text-primary hover:underline"
          >
            tools@agentflow.guide
          </a>
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          返回首页
        </Link>
      </p>
    </div>
  );
}
