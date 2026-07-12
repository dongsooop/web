'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
}

export default function AdSense({
  slot,
  style,
  className,
  format = 'auto',
  responsive = true,
}: AdSenseProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (!publisherId) return null;

  return (
    <ins
      className={`adsbygoogle${className ? ` ${className}` : ''}`}
      style={{ display: 'block', ...style }}
      data-ad-client={publisherId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
