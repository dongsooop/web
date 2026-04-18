import Image from 'next/image';
import Link from 'next/link';

export default function RestaurantBanner() {
  return (
    <Link
      href="/restaurant"
      className="relative block min-h-16 w-full overflow-hidden rounded-2xl bg-[#0047A7] lg:h-full"
    >
      <Image
        src="/img/restaurant_banner.png"
        alt="오늘 뭐먹지 배너"
        fill
        sizes="100vw"
        className="object-contain object-bottom"
        priority
      />
    </Link>
  );
}
