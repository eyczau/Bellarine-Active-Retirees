import { HeartHandshake } from 'lucide-react';

interface AdvertiserBannerProps {
  onAdvertise: () => void;
  headline?: string;
  description?: string;
}

export function AdvertiserBanner({
  onAdvertise,
  headline = 'Proudly Supported by Bellarine Coastal Living',
  description = 'Supporting active retirement, social connection, and local volunteering across the Peninsula.',
}: AdvertiserBannerProps) {
  return (
    <aside
      aria-label="Community Partner Advertising"
      className="border-2 border-amber-400 bg-amber-50/70 rounded-2xl p-3.5 sm:p-4 shadow-xs"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-slate-900 whitespace-nowrap">
              <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
              Community Partner
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {headline}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-slate-700 leading-snug max-w-3xl">
            {description}
          </p>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onAdvertise}
            className="w-full md:w-auto min-h-[44px] inline-flex items-center justify-center rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-slate-900 font-bold text-base sm:text-lg px-5 py-2 shadow-sm transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50"
          >
            Advertise with us
          </button>
        </div>
      </div>
    </aside>
  );
}
