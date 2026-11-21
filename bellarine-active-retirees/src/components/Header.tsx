import { Link, useLocation } from 'react-router-dom';
import { HeartHandshake, Info, X } from 'lucide-react';
import { useGroups } from '../context/GroupsContext.tsx';

interface HeaderProps {
  onOpenAdvertiserModal: () => void;
}

export function Header({ onOpenAdvertiserModal }: HeaderProps) {
  const location = useLocation();
  const {
    isFallback,
    bannerDismissed,
    dismissBanner,
    clearDirectoryScrollPosition,
  } = useGroups();

  const isDirectoryActive =
    location.pathname === '/' || location.pathname.startsWith('/group/');
  const isStoriesActive = location.pathname === '/stories';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-4 sm:gap-8">
          <Link
            to="/"
            onClick={clearDirectoryScrollPosition}
            className="font-display text-lg sm:text-2xl font-bold text-slate-900 hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 truncate max-w-[190px] sm:max-w-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40 rounded-lg py-1"
          >
            Bellarine Active Retirees
          </Link>

          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6"
          >
            <Link
              to="/"
              onClick={clearDirectoryScrollPosition}
              className={`min-h-[44px] inline-flex items-center px-3 py-1.5 rounded-lg text-lg font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40 ${
                isDirectoryActive
                  ? 'text-teal-700 underline decoration-teal-500 decoration-2 underline-offset-8'
                  : 'text-slate-700 hover:text-teal-700 hover:underline decoration-slate-300 decoration-2 underline-offset-8'
              }`}
            >
              Directory
            </Link>
            <Link
              to="/stories"
              className={`min-h-[44px] inline-flex items-center px-3 py-1.5 rounded-lg text-lg font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40 ${
                isStoriesActive
                  ? 'text-teal-700 underline decoration-teal-500 decoration-2 underline-offset-8'
                  : 'text-slate-700 hover:text-teal-700 hover:underline decoration-slate-300 decoration-2 underline-offset-8'
              }`}
            >
              Feel-Good Stories
            </Link>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onOpenAdvertiserModal}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-900 font-bold text-sm sm:text-lg px-3.5 sm:px-5 py-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50"
            >
              <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
              <span>Advertise with us</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-label navigation strip (visible without dropdowns, keeps sticky height compact) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden bg-teal-50 border-b border-teal-200 px-4 py-1.5"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-2.5">
          <Link
            to="/"
            onClick={clearDirectoryScrollPosition}
            className={`min-h-[44px] flex items-center justify-center rounded-xl text-base font-bold transition-colors whitespace-nowrap px-3 ${
              isDirectoryActive
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-800 border border-teal-200 hover:bg-teal-100/60'
            }`}
          >
            Directory
          </Link>
          <Link
            to="/stories"
            className={`min-h-[44px] flex items-center justify-center rounded-xl text-base font-bold transition-colors whitespace-nowrap px-3 ${
              isStoriesActive
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-800 border border-teal-200 hover:bg-teal-100/60'
            }`}
          >
            Feel-Good Stories
          </Link>
        </div>
      </nav>

      {/* Dismissible Preview Mode Banner when Airtable fallback is active */}
      {isFallback && !bannerDismissed && (
        <div
          role="status"
          className="bg-amber-50 border-b border-amber-300 text-slate-900 px-4 py-2.5"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5 text-sm sm:text-base font-medium">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
              <span>
                Preview Mode: Add AIRTABLE_API_KEY in AI Studio Settings → Secrets to load live Airtable records
              </span>
            </div>
            <button
              type="button"
              onClick={dismissBanner}
              aria-label="Dismiss preview mode notice"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-slate-700 hover:bg-amber-200/70 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/40"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
