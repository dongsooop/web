import WebPlaceholder from '@/components/placeholder/WebPlaceholder';

export default function NoticePage() {
  // TODO: 다음 브랜치 브랜치에서 라우트 폴더명을 `notices`로 변경
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center py-6">
      <WebPlaceholder
        title="공지"
        description="최신 학교 공지와 학과 공지를 빠르게 확인할 수 있어요."
      />
    </div>
  );
}
