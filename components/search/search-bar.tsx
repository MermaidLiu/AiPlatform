'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  action?: string;
  size?: 'default' | 'lg';
  className?: string;
}

export function SearchBar({
  defaultValue = '',
  placeholder = '搜索任务、工具或场景…',
  action = '/tools',
  size = 'default',
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`${action}?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(action);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex w-full gap-2', className)}
    >
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={size === 'lg' ? 'h-12 text-base' : undefined}
      />
      <Button type="submit" size={size === 'lg' ? 'lg' : 'default'}>
        搜索
      </Button>
    </form>
  );
}
