'use client';

import Image from 'next/image';
import type { ButtonHTMLAttributes } from 'react';

export type SocialPlatform = 'KAKAO' | 'GOOGLE' | 'APPLE';

type SocialLoginCardProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  platform: SocialPlatform;
  isConnected: boolean;
};

const PLATFORM_META: Record<SocialPlatform, { label: string; imageSrc: string; imageAlt: string }> =
  {
    KAKAO: {
      label: '카카오',
      imageSrc: '/img/kakao_symbol.png',
      imageAlt: '카카오 로고',
    },
    GOOGLE: {
      label: '구글',
      imageSrc: '/img/google_symbol.png',
      imageAlt: '구글 로고',
    },
    APPLE: {
      label: '애플',
      imageSrc: '/img/apple_symbol.png',
      imageAlt: '애플 로고',
    },
  };

export default function SocialLoginCard({
  platform,
  isConnected,
  className = '',
  type = 'button',
  ...props
}: SocialLoginCardProps) {
  const meta = PLATFORM_META[platform];

  return (
    <div className="flex items-center gap-4 px-1 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        <Image
          src={meta.imageSrc}
          alt={meta.imageAlt}
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-large font-bold text-black">{meta.label}</div>
      </div>

      <button
        type={type}
        {...props}
        className={`text-small min-w-11 cursor-pointer rounded-3xl px-4 py-2 font-semibold ${className} ${
          isConnected ? 'border-warning-100 text-warning-100 border' : 'bg-primary text-white'
        }`}
      >
        {isConnected ? '연동 해제' : '연동하기'}
      </button>
    </div>
  );
}
