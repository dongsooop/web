import Image from 'next/image';
import type { LoginPlatform } from '@/features/auth/types/ui-model';

type SocialLoginCardProps = {
  platform: LoginPlatform;
  isConnected: boolean;
  date: string | null;
  onClick?: () => void;
  isLoading?: boolean;
};

const platformMeta: Record<LoginPlatform, { label: string; imageSrc: string; imageAlt: string }> = {
  kakao: {
    label: '카카오',
    imageSrc: '/img/kakao_symbol.png',
    imageAlt: '카카오 로고',
  },
  google: {
    label: '구글',
    imageSrc: '/img/google_symbol.png',
    imageAlt: '구글 로고',
  },
  apple: {
    label: '애플',
    imageSrc: '/img/apple_symbol.png',
    imageAlt: '애플 로고',
  },
};

export default function SocialLoginCard({
  platform,
  isConnected,
  date,
  onClick,
  isLoading = false,
}: SocialLoginCardProps) {
  const meta = platformMeta[platform];
  const statusText = date ? `${date}. 연동됨` : '미연동';
  const text = isConnected ? '연동 해제' : '연동하기';

  return (
    <div className="flex min-h-12 w-full items-center gap-4 py-2 py-4">
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
        <div className="text-small text-gray5 mt-1">{statusText}</div>
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className={`text-small min-w-11 rounded-3xl px-4 py-2 font-semibold ${
          isLoading ? 'cursor-wait opacity-70' : 'cursor-pointer'
        } ${isConnected ? 'border-warning-100 text-warning-100 border' : 'bg-primary text-white'}`}
      >
        {text}
      </button>
    </div>
  );
}
