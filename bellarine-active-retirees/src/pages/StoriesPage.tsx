import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import { AdvertiserBanner } from '../components/AdvertiserBanner.tsx';

interface StoriesPageProps {
  onOpenAdvertiserModal: () => void;
}

const STORY_PLACEHOLDERS = [
  {
    id: 'drysdale-morning-tea',
    town: 'Drysdale',
    date: 'Spring Spotlight',
    title: 'How a Tuesday Morning Walk Grew Into 30 Neighbours Planting Native Gums',
    excerpt:
      'When Margaret and Ron started inviting walkers to linger for a thermos cuppa beside Lake Lorne, nobody expected half the street to join in. Now the reserve thrives year-round.',
    image: '/src/assets/images/drysdale_bushcare_walkers_1795225133991.jpg',
  },
  {
    id: 'queenscliff-harbour-guides',
    town: 'Queenscliff',
    date: 'Volunteer Story',
    title: 'Passing On Port Phillip Maritime Stories From One Generation to the Next',
    excerpt:
      'Every Friday morning at the Queenscliff boathouse, retired mariners and history lovers welcome visiting families with tales of lighthouse keepers and wooden fishing boats.',
    image: '/src/assets/images/queenscliff_harbour_volunteers_1795225134179.jpg',
  },
  {
    id: 'ocean-grove-watercolours',
    town: 'Ocean Grove',
    date: 'Creative Community',
    title: 'Picking Up a Paint Brush at 72: Finding Calm and Confidence by the Dunes',
    excerpt:
      'At Surfside Community Hub, first-time painters sit alongside lifelong artists, proving it is never too late to try something creative over a relaxed morning tea.',
    image: '/src/assets/images/ocean_grove_art_studio_1795225133824.jpg',
  },
];

export function StoriesPage({ onOpenAdvertiserModal }: StoriesPageProps) {
  return (
    <main className="pb-16">
      <section className="bg-gradient-to-b from-teal-50 to-slate-50 border-b border-teal-100 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <Link
            to="/"
            className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 hover:border-teal-600 text-slate-800 font-bold text-base px-4 py-2 transition-colors"
          >
            <span>← Back to Directory</span>
          </Link>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 leading-tight pt-2">
            Feel-Good Stories From Across the Bellarine
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-3xl">
            Celebrating local volunteers, welcoming hosts, and everyday friendships making retirement vibrant across our Peninsula towns.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORY_PLACEHOLDERS.map((story) => (
            <article
              key={story.id}
              className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <img
                src={story.image}
                alt={story.title}
                referrerPolicy="no-referrer"
                className="aspect-[4/3] w-full object-cover object-center"
              />
              <div className="flex flex-col flex-1 p-6 space-y-4">
                <div className="flex items-center gap-4 text-base font-semibold text-teal-700">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    {story.town}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <CalendarDays className="w-4 h-4" aria-hidden="true" />
                    {story.date}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold text-slate-900 leading-snug">
                  {story.title}
                </h2>

                <p className="text-lg text-slate-700 leading-relaxed flex-1">
                  {story.excerpt}
                </p>

                <div className="pt-2">
                  <Link
                    to="/"
                    className="min-h-[44px] inline-flex items-center font-bold text-lg text-teal-700 hover:text-teal-800 underline underline-offset-4"
                  >
                    Explore local groups →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Know a Bellarine volunteer worth celebrating?
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              This space is ready for local volunteer spotlight articles and community stories from Drysdale, Clifton Springs, Portarlington, Indented Head, St Leonards, Ocean Grove, Barwon Heads, and Queenscliff.
            </p>
          </div>
          <Link
            to="/"
            className="min-h-[48px] shrink-0 inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg px-6 py-3 shadow-sm transition-colors"
          >
            Browse All Groups
          </Link>
        </div>

        <AdvertiserBanner onAdvertise={onOpenAdvertiserModal} />
      </div>
    </main>
  );
}
