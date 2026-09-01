import { HomeSidebar } from '@/components/layout/home-sidebar';

export function HomePageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-0 px-4 sm:px-6">
      <HomeSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
