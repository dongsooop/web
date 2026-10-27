import Link from 'next/link';

const contactHref = `mailto:rdyjun00@gmail.com?subject=${encodeURIComponent('동숲 문의')}`;

const links = [
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
  { href: contactHref, label: '문의하기', external: false },
] as const;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <strong>동숲</strong>
          <span>우리의 캠퍼스, 더 가깝게.</span>
        </div>
        <nav aria-label="서비스 정보">
          {links.map((link) =>
            link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
