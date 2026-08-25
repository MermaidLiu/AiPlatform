import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SiteLayout } from '@/components/layout/site-layout';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'AgentFlow Guide · AI 工具向导',
    template: '%s · AgentFlow Guide',
  },
  description:
    '覆盖办公效率、短漫剧创作、电商资产设计室的 AI 工具导航与场景化向导网站',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
