import { useState, type FormEvent } from 'react';
import { CheckCircle2, MessageSquareText, PencilLine } from 'lucide-react';

interface GroupChangeFormSectionProps {
  groupId: string;
  groupName: string;
}

export function GroupChangeFormSection({
  groupId,
  groupName,
}: GroupChangeFormSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Group coordinator or organiser');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/group-change-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId,
          groupName,
          name,
          email,
          relationship,
          details,
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(
          data.error || 'Could not send your update request. Please check your details.'
        );
      }

      setSubmittedMessage(
        data.message ||
          `Thank you — your update request for ${groupName} has been received by our directory coordinator.`
      );
      setName('');
      setEmail('');
      setDetails('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setSubmittedMessage(null);
    setError(null);
    setIsFormOpen(false);
  }

  return (
    <section
      aria-labelledby="listing-update-heading"
      className="mt-8 pt-8 border-t border-dashed border-slate-300"
    >
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <PencilLine
                className="w-5 h-5 text-teal-600 shrink-0"
                aria-hidden="true"
              />
              <h2
                id="listing-update-heading"
                className="font-display text-xl sm:text-2xl font-bold text-slate-900"
              >
                Need to Update These Group Details?
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              If meeting times, contact details, or information for{' '}
              <span className="font-semibold text-slate-900">{groupName}</span>{' '}
              have changed, let us know and our coordinator will update this page.
            </p>
          </div>

          {!isFormOpen && !submittedMessage && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="min-h-[48px] shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-teal-600 text-teal-800 hover:bg-teal-600 hover:text-white font-bold text-base sm:text-lg px-5 py-2.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
            >
              <MessageSquareText className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>Suggest a Change</span>
            </button>
          )}
        </div>

        {submittedMessage && (
          <div
            role="status"
            className="bg-teal-50 border border-teal-200 rounded-xl p-5 space-y-3"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="w-6 h-6 text-teal-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Update Request Sent
                </h3>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  {submittedMessage}
                </p>
              </div>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[44px] inline-flex items-center justify-center rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-base px-4 py-2 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {isFormOpen && !submittedMessage && (
          <form onSubmit={handleSubmit} className="pt-2 space-y-4 border-t border-slate-200">
            {error && (
              <div
                role="alert"
                className="rounded-xl bg-rose-50 border border-rose-300 text-rose-900 px-4 py-3 text-base font-medium"
              >
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="change-request-name"
                  className="block text-base font-bold text-slate-800 mb-1.5"
                >
                  Your Name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="change-request-name"
                  type="text"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Margaret Henderson"
                  className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base sm:text-lg text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
                />
              </div>

              <div>
                <label
                  htmlFor="change-request-email"
                  className="block text-base font-bold text-slate-800 mb-1.5"
                >
                  Your Email <span className="text-rose-600">*</span>
                </label>
                <input
                  id="change-request-email"
                  type="email"
                  required
                  maxLength={160}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com.au"
                  className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base sm:text-lg text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="change-request-relationship"
                className="block text-base font-bold text-slate-800 mb-1.5"
              >
                Your Connection to This Group
              </label>
              <select
                id="change-request-relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base sm:text-lg text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
              >
                <option value="Group coordinator or organiser">
                  Group coordinator or organiser
                </option>
                <option value="Group member or volunteer">
                  Group member or volunteer
                </option>
                <option value="Community visitor">Community visitor</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="change-request-details"
                className="block text-base font-bold text-slate-800 mb-1.5"
              >
                What needs changing? <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="change-request-details"
                rows={4}
                required
                maxLength={2000}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us what needs updating (for example: new meeting day or time, updated phone number, venue change, or description)."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base sm:text-lg text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[48px] inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base sm:text-lg px-5 py-2.5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="min-h-[48px] inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold text-base sm:text-lg px-6 py-2.5 shadow-sm transition-colors cursor-pointer"
              >
                {submitting ? 'Sending...' : 'Send Update Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
