import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MonitorSmartphone } from 'lucide-react';

type WebPlaceholderContentProps = {
  title: string;
  description: string;
  googlePlayHref?: string;
  appStoreHref?: string;
};

const DEFAULT_GOOGLE_PLAY_HREF = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ?? '';
const DEFAULT_APP_STORE_HREF = process.env.NEXT_PUBLIC_APP_STORE_URL ?? '';

type StoreButtonProps = {
  href: string;
  src: string;
  alt: string;
  label: string;
};

function StoreButton({ href, src, alt, label }: StoreButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="border-gray2 flex min-h-12 w-full items-center justify-between rounded-xl border bg-white px-6 py-3 text-left transition"
    >
      <span className="flex items-center gap-4">
        <Image
          src={src}
          alt={alt}
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <span className="text-large font-semibold text-black">{label}</span>
      </span>
      <ChevronRight className="text-gray5 h-5 w-5" />
    </Link>
  );
}

export default function WebPlaceholderContent({
  title,
  description,
  googlePlayHref = DEFAULT_GOOGLE_PLAY_HREF,
  appStoreHref = DEFAULT_APP_STORE_HREF,
}: WebPlaceholderContentProps) {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 lg:px-6">
        <section className="flex flex-col gap-3 px-1 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-title mr-1 font-bold text-black">{title}</h1>
            <span className="border-primary/15 bg-primary/5 text-normal text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 font-semibold">
              <MonitorSmartphone className="text-large h-4 w-4" />웹 준비 중
            </span>
          </div>
          <p className="text-large text-gray6">{description}</p>
        </section>

        <section className="border-gray2/70 flex rounded-xl border bg-white p-4 shadow-[0_10px_30px_rgba(31,41,55,0.04)] md:p-8 lg:px-12 lg:py-16">
          <div className="mx-auto flex w-full max-w-[760px] flex-col items-center text-center">
            <Image
              src="/img/placeholder.png"
              alt="웹 미지원 기능 안내 일러스트"
              width={760}
              height={494}
              priority
              className="h-auto w-full max-w-[520px]"
            />

            <div className="mt-4 flex flex-col items-center gap-4">
              <h2 className="md:text-title text-lg font-bold text-black">
                웹에서는 아직 사용할 수 없는 기능이에요
              </h2>
              <p className="text-normal md:text-large text-gray6 whitespace-pre-line">
                이 기능은 앱에서 먼저 이용할 수 있어요.{'\n'}웹 버전에서도 순차적으로 지원될
                예정이에요.
              </p>
            </div>

            <div className="mt-10 grid w-full max-w-[760px] grid-cols-1 gap-4 md:grid-cols-2">
              <StoreButton
                href={googlePlayHref}
                src="/img/google_symbol.png"
                alt="Google Play Store"
                label="Google Play Store"
              />
              <StoreButton
                href={appStoreHref}
                src="/img/apple_symbol.png"
                alt="App Store"
                label="App Store"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
