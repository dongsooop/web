import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';

export default function StudyRoomBanner() {
  return (
    <Link
      href="/library"
      className="flex h-full items-center justify-between rounded-lg bg-white p-4 shadow-sm"
    >
      {/* 왼쪽 영역 */}
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

      {/* 오른쪽 아이콘 */}
      <ChevronRight className="text-gray5 h-6 w-6" />
    </Link>
  );
}
