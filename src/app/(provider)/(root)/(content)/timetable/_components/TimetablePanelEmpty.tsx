import { GraduationCap } from 'lucide-react';

export default function TimetablePanelEmpty() {
  return (
    <aside className="flex min-h-0 flex-col bg-white" aria-label="선택 전 강의 안내">
      <div className="flex flex-1 px-6 pt-[5.625rem] pb-6">
        <section className="bg-surface-soft flex min-h-45 w-full flex-col items-center justify-center rounded-xl px-6 text-center sm:min-h-60">
          <div className="bg-surface-blue flex h-14 w-14 items-center justify-center rounded-xl text-sky-700 sm:h-16 sm:w-16">
            <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
          </div>

          <div className="sm:text-body text-bodySm mt-4 font-semibold text-black sm:mt-5">
            강의를 선택해주세요
          </div>

          <p className="text-caption text-surface-muted mt-2 leading-5 sm:leading-6">
            시간표에서 강의를 선택하면
            <br />
            상세 정보를 확인할 수 있어요.
          </p>
        </section>
      </div>
    </aside>
  );
}
