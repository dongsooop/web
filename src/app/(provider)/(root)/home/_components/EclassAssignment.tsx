'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

type EclassAssignmentItem = {
  id: number;
  eclassId: string;
  courseId: string;
  courseName: string;
  title: string;
  dueDate: string;
  isSubmitted: boolean;
  status: string;
  link: string;
};

async function fetchAssignments(): Promise<EclassAssignmentItem[]> {
  try {
    return await clientRequestAuth<EclassAssignmentItem[]>('/api/eclass/assignments', {
      method: 'GET',
    });
  } catch {
    return [];
  }
}

export default function EclassAssignment() {
  const [assignments, setAssignments] = useState<EclassAssignmentItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const popupRef = useRef<Window | null>(null);

  // 저장된 과제 목록 불러오기
  useEffect(() => {
    fetchAssignments().then(setAssignments);
  }, []);

  // 팝업 스크립트로부터 스크래핑 데이터를 받아 저장
  const handleMessage = useCallback(async (event: MessageEvent) => {
    if (event.data?.type !== 'ECLASS_DATA_SCRAPED') return;

    try {
      const saved = await clientRequestAuth<EclassAssignmentItem[]>('/api/eclass/sync', {
        method: 'POST',
        body: JSON.stringify({ assignments: event.data.assignments ?? [] }),
      });
      setAssignments(saved ?? []);
      setLastSynced(new Date());
    } catch (error) {
      console.error('과제 저장 실패:', error);
    } finally {
      setIsSyncing(false);
      popupRef.current = null;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  // 팝업이 닫혔는지 주기적으로 확인
  useEffect(() => {
    if (!isSyncing) return;
    const timer = setInterval(() => {
      if (popupRef.current?.closed) {
        setIsSyncing(false);
        popupRef.current = null;
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isSyncing]);

  function openSyncPopup() {
    if (isSyncing) return;
    setIsSyncing(true);
    const popup = window.open(
      '/api/eclass/proxy?path=%2Flogin%2Findex.php',
      'eclass-sync',
      'width=1200,height=800,scrollbars=yes',
    );
    if (!popup) {
      setIsSyncing(false);
      alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
      return;
    }
    popupRef.current = popup;
  }

  const pending = assignments.filter((a) => !a.isSubmitted);
  const submitted = assignments.filter((a) => a.isSubmitted);

  return (
    <Card
      title="이클래스 과제"
      right={
        <button
          onClick={openSyncPopup}
          disabled={isSyncing}
          className="text-normal text-gray5 inline-flex min-h-11 items-center gap-2 px-2 font-semibold hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? '동기화 중...' : '과제 갱신'}
        </button>
      }
    >
      <div className="border-gray2 rounded-2xl bg-white px-2">
        {isSyncing && (
          <div className="text-gray4 flex h-12 items-center justify-center gap-2 text-sm">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>이클래스에서 과제를 가져오는 중입니다...</span>
          </div>
        )}

        {!isSyncing && assignments.length === 0 && (
          <div className="text-gray4 flex h-[200px] flex-col items-center justify-center gap-2">
            <p className="text-normal font-medium">과제 갱신 버튼을 눌러 이클래스 과제를 불러오세요.</p>
            {lastSynced && (
              <p className="text-xs text-gray-400">
                마지막 동기화: {lastSynced.toLocaleTimeString('ko-KR')}
              </p>
            )}
          </div>
        )}

        {!isSyncing && assignments.length > 0 && (
          <>
            {pending.length > 0 && (
              <div className="py-2">
                <p className="mb-1 px-2 text-xs font-semibold text-red-500">미제출 ({pending.length})</p>
                {pending.map((item, idx) => (
                  <AssignmentRow key={item.id} item={item} isFirst={idx === 0} />
                ))}
              </div>
            )}
            {submitted.length > 0 && (
              <div className="py-2">
                <p className="mb-1 px-2 text-xs font-semibold text-green-600">
                  제출 완료 ({submitted.length})
                </p>
                {submitted.map((item, idx) => (
                  <AssignmentRow key={item.id} item={item} isFirst={idx === 0} />
                ))}
              </div>
            )}
            {lastSynced && (
              <p className="px-2 pb-2 text-xs text-gray-400">
                마지막 동기화: {lastSynced.toLocaleTimeString('ko-KR')}
              </p>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

function AssignmentRow({
  item,
  isFirst,
}: {
  item: EclassAssignmentItem;
  isFirst: boolean;
}) {
  return (
    <div className={isFirst ? '' : 'border-gray2 border-t'}>
      <a
        href={item.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start justify-between gap-2 rounded-xl px-2 py-3 hover:bg-gray-50"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-normal truncate text-sm font-medium text-gray-800 group-hover:text-black">
            {item.title}
          </p>
          <p className="text-xs text-gray-500">{item.courseName}</p>
          {item.dueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{item.dueDate}</span>
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {item.isSubmitted ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
              미제출
            </span>
          )}
          <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-gray-500" />
        </div>
      </a>
    </div>
  );
}
