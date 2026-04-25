import Image from 'next/image';

interface SocialLoginButtonsProps {
  onLogin: (platform: 'kakao' | 'google' | 'apple') => void | Promise<void>;
}

const socialItems = [
  {
    key: 'kakao' as const,
    label: '카카오 로그인',
    src: '/img/kakao_symbol.png',
  },
  {
    key: 'google' as const,
    label: '구글 로그인',
    src: '/img/google_symbol.png',
  },
  {
    key: 'apple' as const,
    label: '애플 로그인',
    src: '/img/apple_symbol.png',
  },
];

export default function SocialLoginButtons({ onLogin }: SocialLoginButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6 pt-2">
      {socialItems.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onLogin(item.key)}
          aria-label={item.label}
          className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full"
        >
          <Image
            src={item.src}
            alt={item.label}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}
