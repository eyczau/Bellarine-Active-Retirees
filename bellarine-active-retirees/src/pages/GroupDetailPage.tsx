import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Share2,
  ZoomIn,
} from 'lucide-react';
import { useGroups } from '../context/GroupsContext.tsx';
import { CategoryBadges } from '../components/CategoryBadges.tsx';
import { GroupImage } from '../components/GroupImage.tsx';
import { AdvertiserBanner } from '../components/AdvertiserBanner.tsx';
import { EmailModal } from '../components/EmailModal.tsx';
import { ImageLightboxModal } from '../components/ImageLightboxModal.tsx';
import { GroupChangeFormSection } from '../components/GroupChangeFormSection.tsx';
import { sanitizeExternalUrl, sanitizeTelHref } from '../utils/categories.ts';

interface GroupDetailPageProps {
  onOpenAdvertiserModal: () => void;
}

export function GroupDetailPage({ onOpenAdvertiserModal }: GroupDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { groups, loading } = useGroups();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [id]);

  function handleBackToDirectory() {
    const state = location.state as { fromDirectory?: boolean } | null;
    if (state?.fromDirectory) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  const decodedId = id ? decodeURIComponent(id) : '';
  const group = groups.find((item) => item.id === decodedId);

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="h-12 w-56 bg-slate-200 rounded-xl animate-pulse mb-6" />
        <div className="bg-white rounded-2xl border-t-[6px] border-t-teal-500 shadow-xl p-6 sm:p-10 space-y-6 animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 aspect-[4/3] bg-slate-200 rounded-2xl" />
            <div className="w-full md:w-1/2 space-y-4">
              <div className="h-7 w-40 bg-slate-200 rounded-full" />
              <div className="h-10 w-3/4 bg-slate-200 rounded-lg" />
              <div className="h-6 w-2/3 bg-slate-200 rounded-lg" />
              <div className="h-6 w-1/2 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <button
          type="button"
          onClick={handleBackToDirectory}
          className="min-h-[48px] inline-flex items-center gap-2 rounded-xl bg-white border-2 border-slate-300 hover:border-teal-600 text-slate-900 font-bold text-lg px-5 py-3 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          <span>Back to Directory</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 border-t-[6px] border-t-teal-500 shadow-xl p-8 text-center space-y-4">
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Group Not Found
          </h1>
          <p className="text-lg text-slate-700">
            We could not find that group listing. It may have been updated or moved.
          </p>
          <button
            type="button"
            onClick={handleBackToDirectory}
            className="min-h-[48px] inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg px-6 py-3 cursor-pointer"
          >
            Browse All Bellarine Groups
          </button>
        </div>
      </main>
    );
  }

  const websiteUrl = sanitizeExternalUrl(group.website);
  const facebookUrl = sanitizeExternalUrl(group.facebook);
  const telHref = sanitizeTelHref(group.phone);
  const hasInvolvedOrMoreInfo = Boolean(
    group.getInvolved.trim() || group.moreInformation.trim()
  );
  const hasContactRow = Boolean(
    group.phone.trim() ||
      group.bestContact.trim() ||
      group.email.trim() ||
      websiteUrl ||
      facebookUrl
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 pb-16">
      {/* Prominent Back Button */}
      <div>
        <button
          type="button"
          onClick={handleBackToDirectory}
          className="min-h-[48px] inline-flex items-center gap-2 rounded-xl bg-white border-2 border-slate-300 hover:border-teal-600 hover:bg-teal-50/50 text-slate-900 font-bold text-lg px-5 py-3 shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Main White Card with Top Teal Accent Border */}
      <article className="bg-white border border-slate-200 border-t-[6px] border-t-teal-500 rounded-2xl shadow-xl p-6 sm:p-10">
        {/* 1. Top Header Row */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/2">
            {group.imageUrl ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Enlarge photo of ${group.groupName}`}
                className="relative w-full rounded-2xl overflow-hidden group cursor-pointer block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
              >
                <GroupImage src={group.imageUrl} alt={group.groupName} />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 text-white px-3.5 py-1.5 text-sm font-bold shadow-md group-hover:bg-teal-700 transition-colors">
                  <ZoomIn className="w-4 h-4" aria-hidden="true" />
                  <span>Tap to enlarge</span>
                </span>
              </button>
            ) : (
              <div className="rounded-2xl overflow-hidden">
                <GroupImage src={null} alt={group.groupName} />
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 space-y-5">
            <CategoryBadges categories={group.categories} />

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {group.groupName}
            </h1>

            <div className="space-y-3 text-lg sm:text-xl text-slate-800">
              {(group.location || group.townLocation) && (
                <div className="flex items-start gap-3">
                  <MapPin
                    className="w-6 h-6 text-teal-600 shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <span className="font-semibold leading-snug">
                    {group.townLocation && group.location && !group.townLocation.toLowerCase().includes(group.location.toLowerCase())
                      ? `${group.location} — ${group.townLocation}`
                      : group.townLocation || group.location}
                  </span>
                </div>
              )}

              {group.daysText && (
                <div className="flex items-start gap-3">
                  <CalendarDays
                    className="w-6 h-6 text-teal-600 shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <span className="font-semibold leading-snug">
                    {group.daysText}
                  </span>
                </div>
              )}

              {group.costCategoryText && (
                <div className="flex items-start gap-3">
                  <CircleDollarSign
                    className="w-6 h-6 text-teal-600 shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <span className="font-semibold leading-snug">
                    {group.costCategoryText}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Why Join Us? (Group Detailed Information) */}
        {group.groupDetailedInformation && (
          <section className="mt-8 pt-8 border-t border-dashed border-slate-300">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Why Join Us?
            </h2>
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed whitespace-pre-line">
              {group.groupDetailedInformation}
            </p>
          </section>
        )}

        {/* 3. How to Get Involved & More Information */}
        {hasInvolvedOrMoreInfo && (
          <section className="mt-8 pt-8 border-t border-dashed border-slate-300">
            <div
              className={`grid grid-cols-1 ${
                group.getInvolved.trim() && group.moreInformation.trim()
                  ? 'md:grid-cols-2'
                  : ''
              } gap-8`}
            >
              {group.getInvolved.trim() && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">
                    How to Get Involved
                  </h2>
                  <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                    {group.getInvolved}
                  </p>
                </div>
              )}

              {group.moreInformation.trim() && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">
                    More Information
                  </h2>
                  <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                    {group.moreInformation}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. Anxiety-Reduction Callout Box */}
        {group.yourFirstVisit.trim() && (
          <section
            aria-labelledby="first-visit-heading"
            className="mt-8 bg-teal-50 border-l-4 border-l-teal-500 rounded-r-xl p-6 sm:p-8"
          >
            <h2
              id="first-visit-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-3"
            >
              What to Expect on Your First Visit
            </h2>
            <p className="text-lg sm:text-xl text-slate-800 leading-relaxed whitespace-pre-line">
              {group.yourFirstVisit}
            </p>
          </section>
        )}

        {/* 5. Bottom Contact & Actions Row */}
        {hasContactRow && (
          <section
            aria-label="Contact and Group Links"
            className="mt-8 pt-8 border-t border-dashed border-slate-300 space-y-4"
          >
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Get in Touch
            </h2>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {/* Phone / Best Contact */}
              {telHref ? (
                <a
                  href={telHref}
                  className="min-h-[56px] w-full sm:w-auto inline-flex items-center gap-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-6 py-3.5 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
                >
                  <Phone className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <div className="text-left">
                    {group.bestContact && (
                      <div className="text-sm font-medium text-teal-100 leading-tight">
                        {group.bestContact}
                      </div>
                    )}
                    <div className="text-lg font-bold leading-tight">
                      Call {group.phone}
                    </div>
                  </div>
                </a>
              ) : group.bestContact ? (
                <div className="min-h-[56px] w-full sm:w-auto inline-flex items-center gap-3 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 px-6 py-3.5">
                  <Phone className="w-5 h-5 text-teal-600 shrink-0" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-semibold text-slate-600">
                      Best Contact
                    </div>
                    <div className="text-lg font-bold">{group.bestContact}</div>
                  </div>
                </div>
              ) : null}

              {/* Email Us Button (opens Modal, NOT direct mailto) */}
              {group.email.trim() && (
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(true)}
                  className="min-h-[56px] w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-lg px-6 py-3.5 shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
                >
                  <Mail className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Email Us</span>
                </button>
              )}

              {/* Visit Website */}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[56px] w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-white border-2 border-teal-600 hover:bg-teal-50 text-teal-800 font-bold text-lg px-6 py-3.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
                >
                  <Globe className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
              )}

              {/* Facebook Page */}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[56px] w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-6 py-3.5 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
                >
                  <Share2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Facebook Page</span>
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
              )}
            </div>
          </section>
        )}

        {/* 6. Listing Update / Change Request Section */}
        <GroupChangeFormSection groupId={group.id} groupName={group.groupName} />
      </article>

      {/* AdvertiserBanner below main detail card */}
      <AdvertiserBanner onAdvertise={onOpenAdvertiserModal} />

      {/* Modals */}
      <EmailModal
        isOpen={emailModalOpen}
        email={group.email}
        groupName={group.groupName}
        onClose={() => setEmailModalOpen(false)}
      />

      <ImageLightboxModal
        isOpen={lightboxOpen}
        imageUrl={group.imageUrl}
        alt={group.groupName}
        onClose={() => setLightboxOpen(false)}
      />
    </main>
  );
}
