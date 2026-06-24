'use client';

import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function LoggedOutCard() {
  const router = useRouter();

  return (
    <Card className="w-full gap-4 p-6">
      <p className="text-body font-regular text-black">로그인으로 더 많은 동숲을 즐겨봐요</p>
      <Button fullWidth height="large" fontWeight="regular" onClick={() => router.push('/sign-in')}>
        <span className="text-body flex items-center justify-center gap-2">
          <LogIn className="h-5 w-5" />
          <span>동숲 로그인하기</span>
        </span>
      </Button>
    </Card>
  );
}
