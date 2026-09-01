import Link from 'next/link';
import { categories } from '@/data/categories';

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-bold text-primary">AgentFlow Guide</p>
            <p className="mt-2 text-sm text-muted-foreground">
              AI 工具导航与场景化向导，覆盖办公、短漫剧、电商三大品类。
            </p>
            <Link
              href="/about-recommendation"
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              关于推荐 →
            </Link>
            <p className="mt-2 text-xs text-muted-foreground">
              自研标注仅表示归属，不影响客观对比
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">品类</p>
            <ul className="mt-3 space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.id}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">导航</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/flow" className="text-sm text-muted-foreground hover:text-primary">
                  流程向导
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-sm text-muted-foreground hover:text-primary">
                  工具库
                </Link>
              </li>
              <li>
                <Link href="/owned" className="text-sm text-muted-foreground hover:text-primary">
                  官方能力
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-muted-foreground hover:text-primary">
                  资讯
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-muted-foreground hover:text-primary">
                  提交工具
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">说明</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>自研标注仅表示归属</li>
              <li>第三方工具正常收录对比</li>
              <li>站内仅导流，不做计费闭环</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AgentFlow Guide. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
