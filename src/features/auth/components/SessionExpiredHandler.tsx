'use client';

import { useRouter } from 'next/navigation';

import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function SessionExpiredHandler() {
  const router = useRouter();
  const { isSessionExpired, clearSessionExpired } = useAuth();

  const handleConfirm = () => {
    clearSessionExpired();
    router.replace('/sign-in');
  };

  return (
    <ConfirmDialog
      open={isSessionExpired}
      title="세션 만료"
      content={'세션이 만료되었습니다.\n다시 로그인해주세요.'}
      confirmText="확인"
      onConfirm={handleConfirm}
      isSingleAction
      confirmVariant="primary"
    />
  );
}