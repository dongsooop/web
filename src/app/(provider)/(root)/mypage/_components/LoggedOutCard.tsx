'use client';

import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';

export default function LoggedOutCard() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg bg-white px-6 py-6">
        <p className="text-normal font-regular text-black">로그인으로 더 많은 동숲을 즐겨봐요</p>

        <div className="mt-4">
          <Button
            fullWidth
            height="cta"
            fontWeight="regular"
            onClick={() => router.push('/sign-in')}
          >
            <span className="text-normal flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              <span>동숲 로그인하기</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
