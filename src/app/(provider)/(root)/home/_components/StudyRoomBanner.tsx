import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';

export default function StudyRoomBanner() {
  // TODO: 다음 브랜치에서 학교 스터디룸 예약 페이지로 연결
  return (
    <Link
      href="/library"
      className="flex h-full min-h-14 items-center justify-between rounded-lg bg-white p-4 shadow-sm"
    >
      <div className="flex items-center gap-6">
        <BookOpen className="text-gray6 h-6 w-6" />

        <div>
          <div className="text-normal text-black">팀원들과 시너지를 올릴 공간이 필요하신가요?</div>
          <div className="text-normal">
            <span className="text-primary font-semibold">도서관 스터디룸</span>
            <span className="text-black">을 예약해 보세요</span>
          </div>
        </div>
      </div>

      <ChevronRight className="text-gray5 h-6 w-6" />
    </Link>
  );
}
