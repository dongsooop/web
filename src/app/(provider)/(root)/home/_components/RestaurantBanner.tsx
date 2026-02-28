import Image from 'next/image';
import Link from 'next/link';

export default function RestaurantBanner() {
  return (
    <Link
      href="/restaurant"
      className="border-gray2 relative block h-[140px] w-full overflow-hidden rounded-2xl border bg-[#0047A7]"
    >
      <Image
        src="/img/restaurant_banner.png"
        alt="오늘 뭐먹지 배너"
        fill
        sizes="100vw"
        className="object-contain"
        priority
      />

      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-white/15 via-transparent to-white/15" />
    </Link>
  );
}
