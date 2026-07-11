import { useAuth } from '@/features/auth/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';

export default function ChatbotButton() {
  const { isLoggedIn, isReady } = useAuth();

  if (!isReady || !isLoggedIn) {
    return null;
  }

  return (
    <Link
      href="/chatbot"
      className="group fixed right-4 bottom-6 z-30 flex flex-col items-center gap-3 lg:right-8 lg:bottom-8"
      aria-label="챗봇 동냥이 열기"
    >
      <div className="bg-primary text-bodySm font-regular rounded-2xl px-4 py-2 text-center text-white transition-transform duration-200 group-hover:-translate-y-1">
        무엇이든
        <br />
        물어봐요
      </div>

      <div className="bg-primary relative flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-200 group-hover:-translate-y-1">
        <Image
          src="/img/chatbot.png"
          alt="챗봇 동냥이"
          width={60}
          height={60}
          className="h-14 w-14 rounded-full object-cover"
          priority
        />
      </div>
    </Link>
  );
}
