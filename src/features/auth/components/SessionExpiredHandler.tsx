'use client';

import { useRouter } from 'next/navigation';

import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function SessionExpiredHandler() {
  const router = useRouter();
  const { isExpired, clearExpired } = useAuth();

  const handleConfirm = () => {
    clearExpired();
    router.replace('/sign-in');
  };

  return (
    <ConfirmDialog
      open={isExpired}
      title="세션 만료"
      content={'세션이 만료되었습니다.\n다시 로그인해주세요.'}
      confirm="확인"
      onConfirm={handleConfirm}
      isSingleAction
      variant="primary"
    />
  );
}
