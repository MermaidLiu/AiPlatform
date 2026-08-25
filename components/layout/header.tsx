'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SearchBar } from '@/components/search/search-bar';
import { cn } from '@/lib/utils';
import { categories } from '@/data/categories';

const navLinks = [
  { href: '/flow', label: '流程向导' },
  { href: '/tools', label: '工具库' },
  { href: '/owned', label: '自研工具' },
  { href: '/news', label: '快讯' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold text-primary"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs text-white">
            AF
          </span>
          <span className="hidden text-sm sm:inline">AgentFlow</span>
        </Link>

        {/* 品类 Tab — ai-bot 风格 */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-slate-100',
                pathname === `/category/${cat.id}` &&
                  'bg-primary/10 font-medium text-primary'
              )}
            >
              {cat.name}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-slate-100',
                pathname.startsWith(link.href) &&
                  'font-medium text-primary'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 lg:block lg:max-w-sm xl:max-w-md">
          <SearchBar size="default" />
        </div>

        <button
          type="button"
          className="ml-auto rounded-md p-2 text-lg md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="菜单"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <SearchBar className="mb-4" />
          <div className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="block rounded-md px-2 py-2 text-sm hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-2 py-2 text-sm hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
