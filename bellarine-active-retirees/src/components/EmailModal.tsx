import { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, Mail, X } from 'lucide-react';
import { isValidEmail } from '../utils/categories.ts';

interface EmailModalProps {
  isOpen: boolean;
  email: string;
  groupName: string;
  onClose: () => void;
}

export function EmailModal({ isOpen, email, groupName, onClose }: EmailModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      return;
    }
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

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Clipboard fallback for restricted environments
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }

  const canOpenMailto = isValidEmail(email);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-t-[6px] border-t-teal-500 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-teal-600" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="email-modal-title"
                className="text-2xl font-bold text-slate-900 leading-tight"
              >
                Email {groupName}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close email window"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <p className="text-lg text-slate-700 mb-4">
          Copy the email address below to paste into Gmail, Outlook, or Apple Mail:
        </p>

        <div className="rounded-xl bg-slate-100 border border-slate-300 p-4 mb-5 text-center">
          <p className="text-xl sm:text-2xl font-bold text-slate-900 break-all select-all">
            {email}
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full min-h-[52px] inline-flex items-center justify-center gap-2.5 rounded-xl font-bold text-lg px-6 py-3.5 shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40 ${
              copied
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-6 h-6" aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-6 h-6" aria-hidden="true" />
                <span>Copy Email Address</span>
              </>
            )}
          </button>

          {canOpenMailto && (
            <div className="text-center pt-1">
              <a
                href={`mailto:${encodeURIComponent(email.trim())}`}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-lg font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-4 px-3 py-2"
              >
                <span>Or open in your email app</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
