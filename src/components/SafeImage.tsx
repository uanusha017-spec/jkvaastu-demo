import React, { useState } from 'react';
import { Compass } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: 'lazy' | 'eager';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
  loading = 'lazy',
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-500 border border-slate-200 select-none p-6 text-center ${className}`}
      >
        <Compass className="w-7 h-7 text-orange-600/70 mb-2" />
        <span className="text-xs font-medium text-slate-600 max-w-[180px] truncate">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
