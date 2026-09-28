import React, { useState } from 'react';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackAspect?: string;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({
  src,
  alt = 'VESTRA garment',
  className = '',
  fallbackTitle = 'VESTRA Atelier',
  fallbackAspect = 'aspect-[3/4]',
  ...rest
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`w-full ${fallbackAspect} bg-[#F5F5F0] flex flex-col items-center justify-center p-6 text-center text-[#78716C] border border-[#E7E5E4] select-none ${className}`}
      >
        <span className="font-serif text-lg tracking-widest uppercase text-[#44403C]">VESTRA</span>
        <span className="text-xs text-[#A8A29E] mt-1 tracking-wider">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
      className={className}
      {...rest}
    />
  );
};
