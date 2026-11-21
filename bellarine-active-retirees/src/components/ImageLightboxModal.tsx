import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  alt: string;
  onClose: () => void;
}

export function ImageLightboxModal({
  isOpen,
  imageUrl,
  alt,
  onClose,
}: ImageLightboxModalProps) {
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

  if (!isOpen || !imageUrl) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged photo of ${alt}`}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-5xl flex justify-end mb-3">
        <button
          type="button"
          onClick={onClose}
          className="min-h-[48px] inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg px-5 py-2.5 shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400"
        >
          <X className="w-6 h-6" aria-hidden="true" />
          <span>Close Photo</span>
        </button>
      </div>

      <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-slate-900 shadow-2xl">
        <img
          src={imageUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full max-h-[80vh] object-contain mx-auto"
        />
      </div>
    </div>
  );
}
