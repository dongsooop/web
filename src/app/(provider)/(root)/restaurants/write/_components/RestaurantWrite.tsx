'use client';

import { useRestaurantWrite } from '@/features/restaurant/hooks/useRestaurantWrite';
import type { RestaurantSearchItem } from '@/features/restaurant/types/ui-model';

import { RestaurantWriteForm } from './RestaurantWriteForm';
import { RestaurantWriteHeader } from './RestaurantWriteHeader';

type RestaurantWriteProps = {
  selectedPlace: RestaurantSearchItem | null;
};

export default function RestaurantWrite({
  selectedPlace,
}: RestaurantWriteProps) {
  const {
    category,
    selectedTags,
    tagCount,
    isSubmitting,
    displayErrorMessage,
    selectCategory,
    toggleTag,
    submit,
  } = useRestaurantWrite(selectedPlace);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col py-4 lg:min-h-[calc(100dvh-3rem)]">
      <div className="max-w-timetable mx-auto w-full">
        <RestaurantWriteHeader />
        <RestaurantWriteForm
          selectedPlace={selectedPlace}
          category={category}
          selectedTags={selectedTags}
          tagCount={tagCount}
          isSubmitting={isSubmitting}
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
