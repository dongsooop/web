'use client';

import { createContext, useContext } from 'react';

import type { ScheduleCreateRequest } from '@/features/schedule/types/request';

type ScheduleCreateContextValue = {
  closeCreate: () => void;
  saveCreate: (payload: ScheduleCreateRequest) => Promise<void>;
};

const ScheduleCreateContext = createContext<ScheduleCreateContextValue | null>(null);

export function ScheduleCreateProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ScheduleCreateContextValue;
}) {
  return <ScheduleCreateContext.Provider value={value}>{children}</ScheduleCreateContext.Provider>;
}

export function useScheduleCreate() {
  const value = useContext(ScheduleCreateContext);

  if (!value) {
    throw new Error('useScheduleCreate must be used within ScheduleCreateProvider');
  }

  return value;
}
