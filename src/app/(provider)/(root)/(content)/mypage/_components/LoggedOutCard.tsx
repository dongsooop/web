import Link from 'next/link';
import { ArrowUpRight, LogIn, UserRound } from 'lucide-react';

export default function LoggedOutCard() {
  return (
    <section className="home-card" aria-labelledby="login-title">
      <div className="home-card-head">
        <div className="flex items-center gap-2">
          <span
            className="bg-surface-blue flex h-9 w-9 items-center justify-center rounded-lg text-sky-700"
            aria-hidden="true"
          >
            <UserRound className="h-5 w-5" />
          </span>
          <h2 id="login-title">내 정보</h2>
        </div>
      </div>

      <div className="bg-surface-soft mt-5 flex min-h-52 flex-col items-center justify-center gap-3 rounded-xl px-5 py-8 text-center">
        <span
          className="bg-surface-blue flex h-14 w-14 items-center justify-center rounded-xl text-sky-700"
          aria-hidden="true"
        >
          <LogIn className="h-7 w-7" />
        </span>
        <p className="text-body font-semibold text-black">로그인하고 나의 동숲을 시작해요.</p>
        <p className="text-bodySm text-surface-muted">
          학업과 계정 설정을 한곳에서 관리할 수 있어요.
        </p>
        <Link
          href="/sign-in"
          className="bg-primary focus-visible:ring-primary mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-5 font-semibold text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          동숲 로그인하기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
