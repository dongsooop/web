import { GraduationCap } from 'lucide-react';

type TimetablePanelEmptyProps = {
  onCreateAction: () => void;
};

export default function TimetablePanelEmpty({ onCreateAction }: TimetablePanelEmptyProps) {
  void onCreateAction;

  return (
    <aside className="flex min-h-0 flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-15 text-center">
        <div className="bg-gray1 flex h-18 w-18 items-center justify-center rounded-full">
          <GraduationCap className="text-gray5 h-8 w-8" />
        </div>

        <div className="text-heading mt-6 font-bold text-black">강의를 선택해주세요</div>
        <p className="text-bodySm text-gray5 mt-4 leading-7">
          시간표에서 강의를 선택하면
          <br />
          상세 정보를 확인할 수 있어요.
        </p>
      </div>
    </aside>
  );
}
