import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, HeartHandshake, X } from 'lucide-react';

interface AdvertiserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdvertiserModal({ isOpen, onClose }: AdvertiserModalProps) {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/advertiser-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          businessName,
          email,
          phone,
          message,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Could not send your inquiry. Please check your details.');
      }
      setSubmittedMessage(
        data.message ||
          'Thank you for your interest in advertising with Bellarine Active Retirees.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleResetAndClose() {
    setSubmittedMessage(null);
    setError(null);
    setName('');
    setBusinessName('');
    setEmail('');
    setPhone('');
    setMessage('');
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="advertiser-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border-t-[6px] border-t-amber-400 p-6 sm:p-8 my-auto">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-sm font-bold uppercase tracking-wide mb-2">
              <HeartHandshake className="w-4 h-4" aria-hidden="true" />
              Local Advertising
            </span>
            <h2
              id="advertiser-modal-title"
              className="text-2xl sm:text-3xl font-bold text-slate-900"
            >
              Advertise With Us
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close advertising inquiry window"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {submittedMessage ? (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-slate-900">Inquiry Received</h3>
            <p className="text-lg text-slate-700 leading-relaxed">{submittedMessage}</p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="min-h-[48px] w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg px-8 py-3 transition-colors cursor-pointer"
            >
              Return to Directory
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-lg text-slate-700 leading-relaxed">
              Help keep this directory free for every retiree across Drysdale, Ocean Grove, Portarlington, Queenscliff, and the wider Bellarine Peninsula.
            </p>

            {error && (
              <div
                role="alert"
                className="rounded-xl bg-rose-50 border border-rose-300 text-rose-900 px-4 py-3 text-base font-medium"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="advertiser-name"
                className="block text-base font-bold text-slate-800 mb-1.5"
              >
                Your Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                id="advertiser-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Mitchell"
                className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 bg-white focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
              />
            </div>

            <div>
              <label
                htmlFor="advertiser-business"
                className="block text-base font-bold text-slate-800 mb-1.5"
              >
                Business or Organisation <span className="text-rose-600">*</span>
              </label>
              <input
                id="advertiser-business"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Bellarine Coastal Living"
                className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 bg-white focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="advertiser-email"
                  className="block text-base font-bold text-slate-800 mb-1.5"
                >
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  id="advertiser-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com.au"
                  className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 bg-white focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
                />
              </div>
              <div>
                <label
                  htmlFor="advertiser-phone"
                  className="block text-base font-bold text-slate-800 mb-1.5"
                >
                  Phone Number
                </label>
                <input
                  id="advertiser-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0400 000 000"
                  className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 bg-white focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="advertiser-message"
                className="block text-base font-bold text-slate-800 mb-1.5"
              >
                Message (Optional)
              </label>
              <textarea
                id="advertiser-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us a little about your business or how you'd like to advertise with us."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 bg-white focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="min-h-[48px] inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-lg px-6 py-3 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="min-h-[48px] inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold text-lg px-6 py-3 shadow-sm transition-colors cursor-pointer"
              >
                {submitting ? 'Sending...' : 'Send Advertising Inquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
