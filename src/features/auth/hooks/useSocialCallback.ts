'use client';

import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppCheckStore } from '@/store/useAppCheckStore';
import { resolveSocialCallbackError, type SocialCallbackResult } from '../lib/socialCallback';
import { resolveSocialErrorKey } from '@/features/auth/lib/socialError';
import type { SocialErrorContext, SocialErrorKey } from '@/features/auth/types/error';

type UseSocialCallbackOptions<T> = {
  result: SocialCallbackResult<T>;
  pendingMessage: string;
  progressMessage: string;
  successPath: string;
  errorPath: string;
  cancelPath?: string;
  appCheckErrorKey?: SocialErrorKey;
  context: SocialErrorContext;
  validateAction?: (payload: T) => SocialErrorKey | null;
  runAction: (payload: T) => Promise<void>;
  clearAction?: () => void;
};

function buildErrorPath(path: string, errorKey: SocialErrorKey) {
  return `${path}?error=${encodeURIComponent(errorKey)}`;
}

export function useSocialCallback<T>({
  result,
  pendingMessage,
  progressMessage,
  successPath,
  errorPath,
  cancelPath = errorPath,
  appCheckErrorKey,
  context,
  validateAction,
  runAction,
  clearAction,
}: UseSocialCallbackOptions<T>) {
  const router = useRouter();
  const token = useAppCheckStore((state) => state.token);
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const [message, setMessage] = useState(pendingMessage);
  const didRun = useRef(false);

  const move = useEffectEvent((path: string) => {
    clearAction?.();
    router.replace(path, { scroll: false });
  });

  const validate = useEffectEvent((payload: T) => validateAction?.(payload) ?? null);
  const run = useEffectEvent(async (payload: T) => {
    await runAction(payload);
  });

  useEffect(() => {
    let active = true;

    const finish = async () => {
      if (result.error) {
        const nextMessage = resolveSocialCallbackError(result.error, result.errorDescription);

        if (!nextMessage) {
          move(cancelPath);
          return;
        }

        move(buildErrorPath(errorPath, nextMessage));
        return;
      }

      if (result.payload === null) {
        move(buildErrorPath(errorPath, 'SOCIAL_SDK'));
        return;
      }

      const validationMessage = validate(result.payload);

      if (validationMessage) {
        move(buildErrorPath(errorPath, validationMessage));
        return;
      }

      if (!isInitialized) {
        if (active) {
          setMessage(pendingMessage);
        }

        return;
      }

      if (!token) {
        move(
          buildErrorPath(
            errorPath,
            appCheckErrorKey ?? 'SOCIAL_SDK',
          ),
        );
        return;
      }

      try {
        if (active) {
          setMessage(progressMessage);
        }

        if (didRun.current) {
          return;
        }

        didRun.current = true;
        await run(result.payload);

        if (!active) {
          return;
        }

        move(successPath);
      } catch (error) {
        if (!active) {
          return;
        }

        move(buildErrorPath(errorPath, resolveSocialErrorKey(error, context)));
      }
    };

    void finish();

    return () => {
      active = false;
    };
  }, [
    appCheckErrorKey,
    cancelPath,
    context,
    errorPath,
    isInitialized,
    pendingMessage,
    progressMessage,
    result,
    successPath,
    token,
  ]);

  return message;
}
