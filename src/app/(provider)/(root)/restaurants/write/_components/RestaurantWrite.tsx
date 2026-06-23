'use client';

import PageHeader from '@/components/ui/PageHeader';
import { useRestaurantWrite } from '@/features/restaurant/hooks/useRestaurantWrite';
import type { RestaurantSearchItem } from '@/features/restaurant/types/ui-model';

import { RestaurantWriteForm } from './RestaurantWriteForm';

type RestaurantWriteProps = {
  selectedPlace: RestaurantSearchItem | null;
};

export default function RestaurantWrite({ selectedPlace }: RestaurantWriteProps) {
  const {
    category,
    selectedTags,
    tagCount,
    isSubmitting,
    isCheckingDuplicate,
    isDuplicate,
    displayErrorMessage,
    selectCategory,
    toggleTag,
    submit,
  } = useRestaurantWrite(selectedPlace);

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col py-4">
      <div className="max-w-content mx-auto flex w-full flex-col gap-4">
        <PageHeader
          title="학교 근처 맛집 추천"
          description="동미대 학생들에게 추천할 맛집 정보를 입력해주세요"
          backHref="/restaurants"
          backLabel="맛집 목록으로 돌아가기"
        />
        <RestaurantWriteForm
          selectedPlace={selectedPlace}
          category={category}
          selectedTags={selectedTags}
          tagCount={tagCount}
          isSubmitting={isSubmitting}
          isCheckingDuplicate={isCheckingDuplicate}
          isDuplicate={isDuplicate}
          displayErrorMessage={displayErrorMessage}
          selectCategoryAction={selectCategory}
          toggleTagAction={toggleTag}
          onSubmitAction={() => {
            void submit();
          }}
        />
      </div>
    </div>
  );
}
