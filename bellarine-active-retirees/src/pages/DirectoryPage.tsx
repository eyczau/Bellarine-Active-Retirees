import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, RefreshCw, Search, X } from 'lucide-react';
import { useGroups } from '../context/GroupsContext.tsx';
import { GroupCard } from '../components/GroupCard.tsx';
import { AdvertiserBanner } from '../components/AdvertiserBanner.tsx';
import { MultiSelectDropdown } from '../components/MultiSelectDropdown.tsx';
import bellarineHeroImage from '../assets/images/bellarine_peninsula_hero_1795233539799.jpg';

interface DirectoryPageProps {
  onOpenAdvertiserModal: () => void;
}

const WEEKDAY_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function DirectoryPage({ onOpenAdvertiserModal }: DirectoryPageProps) {
  const location = useLocation();
  const scrollStorageKey = `bar_directory_scroll_${location.key}`;
  const isRestoringScrollRef = useRef(false);

  const {
    groups,
    loading,
    error,
    reload,
    selectedCategory,
    setSelectedCategory,
    selectedLocations,
    setSelectedLocations,
    selectedDays,
    setSelectedDays,
    selectedCostCategories,
    setSelectedCostCategories,
    searchQuery,
    setSearchQuery,
    clearAllFilters,
    peekDirectoryScrollPosition,
    clearDirectoryScrollPosition,
  } = useGroups();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (loading) return;

    let targetY: number | null = null;
    try {
      const stored = sessionStorage.getItem(scrollStorageKey);
      if (stored !== null) {
        const parsed = Number(stored);
        if (Number.isFinite(parsed) && parsed >= 0) {
          targetY = parsed;
        }
      }
    } catch {
      // Ignore storage errors
    }
    if (targetY === null) {
      targetY = peekDirectoryScrollPosition();
    }
    if (targetY === null) return;

    isRestoringScrollRef.current = true;
    window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
      raf2 = requestAnimationFrame(() => {
        isRestoringScrollRef.current = false;
        clearDirectoryScrollPosition();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      isRestoringScrollRef.current = false;
    };
  }, [
    loading,
    scrollStorageKey,
    peekDirectoryScrollPosition,
    clearDirectoryScrollPosition,
  ]);

  useEffect(() => {
    if (loading) return;

    function handleScroll() {
      if (isRestoringScrollRef.current) return;
      try {
        sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
      } catch {
        // Ignore storage errors
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, scrollStorageKey]);

  // Derive Category filter options dynamically from the Airtable Category field
  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    for (const group of groups) {
      for (const cat of group.categories) {
        const trimmed = cat.trim();
        if (trimmed) {
          categories.add(trimmed);
        }
      }
    }
    return ['All', ...Array.from(categories).sort((a, b) => a.localeCompare(b))];
  }, [groups]);

  // Derive Location options dynamically from the Airtable Location field
  const locationOptions = useMemo(() => {
    const locations = new Set<string>();
    for (const group of groups) {
      const raw = group.location.trim();
      if (!raw) continue;
      for (const part of raw.split(',')) {
        const trimmed = part.trim();
        if (trimmed) {
          locations.add(trimmed);
        }
      }
    }
    return Array.from(locations).sort((a, b) => a.localeCompare(b));
  }, [groups]);

  // Derive Days options dynamically from the Airtable Days field, sorted Monday-Sunday first
  const dayOptions = useMemo(() => {
    const daysSet = new Set<string>();
    for (const group of groups) {
      for (const day of group.days) {
        const trimmed = day.trim();
        if (trimmed) {
          daysSet.add(trimmed);
        }
      }
    }
    return Array.from(daysSet).sort((a, b) => {
      const idxA = WEEKDAY_ORDER.findIndex(
        (d) => d.toLowerCase() === a.toLowerCase()
      );
      const idxB = WEEKDAY_ORDER.findIndex(
        (d) => d.toLowerCase() === b.toLowerCase()
      );
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [groups]);

  // Derive Cost Category options dynamically from the Airtable Cost Category field
  const costCategoryOptions = useMemo(() => {
    const costs = new Set<string>();
    for (const group of groups) {
      for (const cost of group.costCategories) {
        const trimmed = cost.trim();
        if (trimmed) {
          costs.add(trimmed);
        }
      }
    }
    return Array.from(costs).sort((a, b) => a.localeCompare(b));
  }, [groups]);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return groups.filter((group) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        group.categories.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        );
      if (!matchesCategory) return false;

      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.some(
          (loc) =>
            group.location
              .split(',')
              .some((part) => part.trim().toLowerCase() === loc.toLowerCase()) ||
            group.townLocation.toLowerCase().includes(loc.toLowerCase())
        );
      if (!matchesLocation) return false;

      const matchesDay =
        selectedDays.length === 0 ||
        selectedDays.some(
          (day) =>
            group.days.some((d) => d.toLowerCase() === day.toLowerCase()) ||
            group.daysText.toLowerCase().includes(day.toLowerCase())
        );
      if (!matchesDay) return false;

      const matchesCostCategory =
        selectedCostCategories.length === 0 ||
        selectedCostCategories.some((cost) =>
          group.costCategories.some(
            (c) => c.toLowerCase() === cost.toLowerCase()
          )
        );
      if (!matchesCostCategory) return false;

      if (!query) return true;

      return (
        group.groupName.toLowerCase().includes(query) ||
        group.aboutTheGroup.toLowerCase().includes(query) ||
        group.location.toLowerCase().includes(query) ||
        group.townLocation.toLowerCase().includes(query) ||
        group.daysText.toLowerCase().includes(query) ||
        group.costCategoryText.toLowerCase().includes(query)
      );
    });
  }, [
    groups,
    selectedCategory,
    selectedLocations,
    selectedDays,
    selectedCostCategories,
    searchQuery,
  ]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedLocations.length > 0 ||
    selectedDays.length > 0 ||
    selectedCostCategories.length > 0 ||
    searchQuery.trim().length > 0;

  const firstSixGroups = filteredGroups.slice(0, 6);
  const remainingGroups = filteredGroups.slice(6);

  return (
    <main className="pb-12">
      {/* Compact Bellarine Coastal Hero Banner */}
      <section className="relative overflow-hidden bg-teal-950">
        <img
          src={bellarineHeroImage}
          alt="Foreshore timber pier and turquoise Port Phillip Bay along the Bellarine Peninsula"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-slate-950/35"
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
          <div className="max-w-2xl space-y-2">
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight drop-shadow-xs">
              Bellarine Active Retirees
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-snug font-medium drop-shadow-xs">
              Discover free and low-cost community groups, activities, and volunteering across the Bellarine Peninsula
            </p>
          </div>
        </div>
      </section>

      {/* Compact Filter Bar */}
      <section className="bg-gradient-to-b from-teal-50 via-teal-50/50 to-slate-50 border-b border-teal-100 py-4 sm:py-5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Filter Area: Category -> Location, Days, Cost Category -> Search at Bottom */}
          <div className="space-y-3 sm:space-y-4">
            {/* 1. Category Filter (single scrollable row on mobile, wraps cleanly on sm+) */}
            <div>
              <p className="text-base font-bold text-slate-800 mb-1.5">
                Category
              </p>
              <div
                role="group"
                aria-label="Filter groups by category"
                className="flex flex-nowrap overflow-x-auto sm:flex-wrap gap-2 pb-1"
              >
                {categoryOptions.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      aria-pressed={isActive}
                      className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-base font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40 ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-600'
                          : 'bg-white text-slate-800 border-2 border-slate-300 hover:border-teal-500 hover:bg-teal-50/60'
                      }`}
                    >
                      {isActive && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                      <span>{category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Location, Days & Cost Category Multi-Select Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
              <MultiSelectDropdown
                label="Location"
                placeholder="All locations"
                options={locationOptions}
                selected={selectedLocations}
                onChange={setSelectedLocations}
              />

              <MultiSelectDropdown
                label="Days"
                placeholder="All days"
                options={dayOptions}
                selected={selectedDays}
                onChange={setSelectedDays}
              />

              <MultiSelectDropdown
                label="Cost Category"
                placeholder="All costs"
                options={costCategoryOptions}
                selected={selectedCostCategories}
                onChange={setSelectedCostCategories}
                className="col-span-2 sm:col-span-1"
              />
            </div>

            {/* 3. Search at Bottom of Filter Area */}
            <div>
              <label
                htmlFor="directory-search"
                className="block text-base font-bold text-slate-800 mb-1"
              >
                Search by group name, topic, or town
              </label>
              <div className="relative">
                <Search
                  className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="directory-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try Drysdale, Ocean Grove, bocce, art..."
                  className="w-full min-h-[46px] rounded-xl border-2 border-slate-300 bg-white pl-11 pr-11 py-2 text-base sm:text-lg text-slate-900 placeholder:text-slate-500 shadow-xs focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search text"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 space-y-5 sm:space-y-6">
        {/* Top AdvertiserBanner below filter bar */}
        <AdvertiserBanner onAdvertise={onOpenAdvertiserModal} />

        {/* Status / Result Count */}
        {!loading && !error && (
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <p className="text-base sm:text-lg font-semibold text-slate-700 tabular-nums">
              Showing {filteredGroups.length}{' '}
              {filteredGroups.length === 1 ? 'local group' : 'local groups'}
              {selectedCategory !== 'All' ? ` · ${selectedCategory}` : ''}
              {selectedLocations.length > 0
                ? ` · ${selectedLocations.join(', ')}`
                : ''}
              {selectedDays.length > 0 ? ` · ${selectedDays.join(', ')}` : ''}
              {selectedCostCategories.length > 0
                ? ` · ${selectedCostCategories.join(', ')}`
                : ''}
              {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ''}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="min-h-[44px] inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base px-4 py-1.5 transition-colors cursor-pointer"
                >
                  Show All Groups
                </button>
              )}
              <button
                type="button"
                onClick={reload}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base px-4 py-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            aria-live="polite"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] w-full bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-28 bg-slate-200 rounded-full" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-full bg-slate-200 rounded-lg" />
                  <div className="h-4 w-2/3 bg-slate-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-2xl border-2 border-rose-200 p-6 text-center space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">
              Could not load local groups
            </h2>
            <p className="text-lg text-slate-700 max-w-xl mx-auto">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg px-6 py-3 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredGroups.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">
              No groups matched your filters
            </h2>
            <p className="text-lg text-slate-700 max-w-xl mx-auto">
              Try clearing your search or resetting Category, Location, Days, and Cost Category to see every Bellarine group and activity.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="min-h-[48px] inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg px-6 py-3 cursor-pointer"
            >
              Show All Groups
            </button>
          </div>
        )}

        {/* First 6 Group Cards */}
        {!loading && !error && firstSixGroups.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {firstSixGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>

            {/* Second AdvertiserBanner after the first 6 group cards */}
            <AdvertiserBanner
              onAdvertise={onOpenAdvertiserModal}
              headline="Local Businesses Supporting Bellarine Retirees"
              description="Want your local café, health clinic, or coastal service featured here? Partner with us to keep community connections thriving."
            />

            {/* Remaining Group Cards (7+) */}
            {remainingGroups.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {remainingGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
