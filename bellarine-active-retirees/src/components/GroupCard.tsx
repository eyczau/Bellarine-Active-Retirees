import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CircleDollarSign, MapPin } from 'lucide-react';
import type { GroupRecord } from '../types/group.ts';
import { useGroups } from '../context/GroupsContext.tsx';
import { CategoryBadges } from './CategoryBadges.tsx';
import { GroupImage } from './GroupImage.tsx';

interface GroupCardProps {
  group: GroupRecord;
}

function formatCardLocation(location: string, townLocation: string): string {
  if (townLocation && location) {
    if (townLocation.toLowerCase().includes(location.toLowerCase())) {
      return townLocation;
    }
    return `${location} — ${townLocation}`;
  }
  return location || townLocation;
}

export function GroupCard({ group }: GroupCardProps) {
  const { saveDirectoryScrollPosition } = useGroups();
  const displayLocation = formatCardLocation(group.location, group.townLocation);

  return (
    <Link
      to={`/group/${encodeURIComponent(group.id)}`}
      state={{ fromDirectory: true }}
      onClick={() => saveDirectoryScrollPosition(window.scrollY)}
      className="group flex flex-col sm:grid sm:row-span-7 sm:grid-rows-subgrid sm:gap-y-0 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-400 transition-all duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
    >
      {/* Track 1: Full-width 4:3 Photo with overlaid Category Pills */}
      <div className="relative overflow-hidden bg-slate-100">
        <GroupImage
          src={group.imageUrl}
          alt={group.groupName}
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/70 via-slate-950/25 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
          <CategoryBadges categories={group.categories} compact />
        </div>
      </div>

      {/* Track 2: Group Name (aligned horizontally across each row on sm+) */}
      <div className="px-4 sm:px-5 pt-3.5 pb-1.5">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
          {group.groupName}
        </h3>
      </div>

      {/* Track 3: About the Group */}
      <div className="px-4 sm:px-5 pb-2.5">
        {group.aboutTheGroup && (
          <p className="text-base sm:text-lg text-slate-700 leading-snug sm:leading-relaxed">
            {group.aboutTheGroup}
          </p>
        )}
      </div>

      {/* Track 4: Separator + Location (aligned horizontally across each row on sm+) */}
      <div className="px-4 sm:px-5 mt-auto sm:mt-0">
        <div className="border-t border-slate-200 pt-2.5 pb-1 flex items-start gap-2 text-base sm:text-lg text-slate-700">
          {displayLocation && (
            <>
              <MapPin
                className="w-5 h-5 text-teal-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span className="font-semibold leading-snug">{displayLocation}</span>
            </>
          )}
        </div>
      </div>

      {/* Track 5: Days (aligned horizontally across each row on sm+) */}
      <div className="px-4 sm:px-5 pb-1 flex items-start gap-2 text-base sm:text-lg text-slate-700">
        {group.daysText && (
          <>
            <CalendarDays
              className="w-5 h-5 text-teal-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span className="leading-snug">{group.daysText}</span>
          </>
        )}
      </div>

      {/* Track 6: Cost Category (aligned horizontally across each row on sm+) */}
      <div className="px-4 sm:px-5 pb-3 flex items-start gap-2 text-base sm:text-lg text-slate-700">
        {group.costCategoryText && (
          <>
            <CircleDollarSign
              className="w-5 h-5 text-teal-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span className="leading-snug">{group.costCategoryText}</span>
          </>
        )}
      </div>

      {/* Track 7: Call-to-action button (aligned horizontally across each row on sm+) */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
        <span className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 border-2 border-teal-600 text-white active:bg-teal-700 sm:group-hover:bg-teal-50 sm:group-hover:text-teal-800 font-bold text-base sm:text-lg px-4 py-2.5 shadow-xs transition-colors duration-200">
          <span>View Group</span>
          <ArrowRight
            className="w-5 h-5 shrink-0 transition-transform duration-200 sm:group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
