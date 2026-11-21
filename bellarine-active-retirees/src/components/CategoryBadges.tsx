import { getCategoryPillClass, getDisplayCategories } from '../utils/categories.ts';

interface CategoryBadgesProps {
  categories: string[];
  className?: string;
  compact?: boolean;
}

export function CategoryBadges({
  categories,
  className = '',
  compact = false,
}: CategoryBadgesProps) {
  const displayCategories = getDisplayCategories(categories);

  return (
    <div className={`flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'} ${className}`}>
      {displayCategories.map((category) => (
        <span
          key={category}
          className={`inline-flex items-center rounded-full font-bold uppercase tracking-wide whitespace-nowrap shrink-0 shadow-xs ${
            compact
              ? 'px-2.5 py-0.5 text-xs'
              : 'px-3 py-1 text-xs sm:text-sm'
          } ${getCategoryPillClass(category)}`}
        >
          {category}
        </span>
      ))}
    </div>
  );
}
