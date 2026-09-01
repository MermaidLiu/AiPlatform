import { HeroSearchNewsRow } from '@/components/home/hero-search-news-row';
import { OfficialPicksSection } from '@/components/home/official-picks-section';
import { CategoryToolWall } from '@/components/home/category-tool-wall';
import { HomePageShell } from '@/components/layout/home-page-shell';
import { categories } from '@/data/categories';
import type { Category } from '@/types';

export default function HomePage() {
  return (
    <div className="bg-[#f5f7fa]">
      <HeroSearchNewsRow />

      <HomePageShell>
        <div className="space-y-6 py-6 sm:py-8">
          <OfficialPicksSection />

          {(categories.map((category) => category.id) as Category[]).map(
            (categoryId) => (
              <CategoryToolWall key={categoryId} category={categoryId} />
            )
          )}
        </div>
      </HomePageShell>
    </div>
  );
}
