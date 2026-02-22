import Link from 'next/link';

const FOOTER_LINKS = [
  {
    href: 'https://zircon-football-529.notion.site/Dongsoop-2333ee6f2561800cb85fdc87fbe9b4c2',
    label: '서비스 이용약관',
    external: true,
  },
  {
    href: 'https://zircon-football-529.notion.site/Dongsoop-2333ee6f256180a0821fdbf087345a1d',
    label: '개인정보 처리방침',
    external: true,
  },
  {
    href: 'https://zircon-football-529.notion.site/Q-A-2803ee6f2561804cb106c6cceedd57ac',
    label: '자주 묻는 질문',
    external: true,
  },
  {
    href: 'https://zircon-football-529.notion.site/2883ee6f256180a49d5edf214bc61003?pvs=74',
    label: '오픈소스 라이선스',
    external: true,
  },
  // 추후에 추가
  { href: '/contact', label: '문의하기', external: false },
] as const;

export default function Footer() {
  return (
    <footer className="border-gray1 border-t bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-8">
        <div className="mb-6">
          <p className="text-normal font-semibold text-black">동양미래대숲</p>
          <p className="text-small text-gray4 mt-1">
            본 서비스는 동양미래대학교의 비공식 서비스로 <br />
            제공 정보는 학교 홈페이지/공식 안내를 기반으로 합니다.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Footer">
            <ul className="text-small font-regular text-gray4 flex flex-wrap items-center gap-y-2">
              {FOOTER_LINKS.map((item, index) => (
                <li key={item.label} className="flex items-center">
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:underline"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="transition-colors hover:underline">
                      {item.label}
                    </Link>
                  )}

                  {index !== FOOTER_LINKS.length - 1 && <span className="text-gray3 mx-3">|</span>}
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-small font-regular text-gray5">
            © {new Date().getFullYear()} Dongsoop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}