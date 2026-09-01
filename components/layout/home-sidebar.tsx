'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const anchorSections = [
  { id: 'official-picks', label: '官方精选' },
  { id: 'category-office', label: '办公效率' },
  { id: 'category-comic', label: '短漫剧创作' },
  { id: 'category-ecommerce', label: '电商资产设计室' },
] as const;

export function HomeSidebar() {
  const [activeId, setActiveId] = useState<string>(anchorSections[0].id);

  useEffect(() => {
    const sectionElements = anchorSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const element of sectionElements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="首页目录"
      className="hidden w-44 shrink-0 lg:block xl:w-48"
    >
      <div className="sticky top-[4.5rem] space-y-1 py-6 pl-2 pr-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          目录
        </p>
        {anchorSections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className={cn(
              'block w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
              activeId === section.id
                ? 'bg-primary/10 font-medium text-primary'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            {section.label}
          </button>
        ))}
        <div className="my-2 border-t" />
        <Link
          href="/owned"
          className="block rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary"
        >
          官方能力
        </Link>
      </div>
    </nav>
  );
}
