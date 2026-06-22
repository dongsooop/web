'use client';

import { useRestaurantWrite } from '@/features/restaurant/hooks/useRestaurantWrite';
import type { RestaurantSearchItem } from '@/features/restaurant/types/ui-model';

import { RestaurantWriteForm } from './RestaurantWriteForm';
import { RestaurantWriteHeader } from './RestaurantWriteHeader';

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
      <div className="max-w-content mx-auto flex w-full flex-col sm:gap-5">
        <RestaurantWriteHeader />
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
