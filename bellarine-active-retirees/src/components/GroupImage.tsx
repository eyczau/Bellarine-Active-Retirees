import { useState } from 'react';
import { Compass } from 'lucide-react';

interface GroupImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function GroupImage({ src, alt, className = '' }: GroupImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`aspect-[4/3] w-full bg-gradient-to-br from-teal-50 via-slate-100 to-teal-100 flex flex-col items-center justify-center p-6 text-center text-teal-800 ${className}`}
      >
        <div className="w-14 h-14 rounded-2xl bg-white/90 border border-teal-200 flex items-center justify-center mb-3 shadow-xs">
          <Compass className="w-7 h-7 text-teal-600" aria-hidden="true" />
        </div>
        <p className="text-base font-semibold text-slate-700 max-w-xs line-clamp-2">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`aspect-[4/3] w-full object-cover object-center block ${className}`}
    />
  );
}
