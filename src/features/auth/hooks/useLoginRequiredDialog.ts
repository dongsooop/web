'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useDialogStore } from '@/store/useDialogStore';

export function useLoginRequiredDialog() {
  const router = useRouter();
  const showDialog = useDialogStore((state) => state.showDialog);

  return useCallback(() => {
    showDialog({
      title: '로그인이 필요한 서비스예요',
      content: '로그인 화면으로 이동하시겠어요?',
      cancel: '취소',
      confirm: '확인',
      color: 'primary',
      onConfirm: () => {
        router.push('/sign-in');
      },
    });
  }, [router, showDialog]);
}
