'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

import { restaurantCategories } from '@/features/restaurant/constants';
import {
  restaurantTags,
  type RestaurantCategoryKey,
  type RestaurantTagKey,
} from '@/features/restaurant/options';
import type { RestaurantSearchItem } from '@/features/restaurant/types/ui-model';

type FieldTitleProps = {
  children: React.ReactNode;
  required?: boolean;
};

function FieldTitle({ children, required = false }: FieldTitleProps) {
  return (
    <div className="text-bodySm font-semibold text-black">
      {children}
      {required ? <span className="text-primary ml-1">*</span> : null}
    </div>
  );
}

type FieldHeadProps = {
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
};

function FieldHead({ children, hint, required = false }: FieldHeadProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <FieldTitle required={required}>{children}</FieldTitle>
      {hint ? <p className="text-caption text-gray5">{hint}</p> : null}
    </div>
  );
}

type SelectChipProps = {
  label: string;
  selected: boolean;
  onClickAction: () => void;
};

function SelectChip({ label, selected, onClickAction }: SelectChipProps) {
  return (
    <button
      type="button"
      onClick={onClickAction}
      className={`text-bodySm inline-flex min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border px-3 py-2 font-semibold transition ${
        selected
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-gray2 text-gray4 hover:border-primary/20 hover:bg-primary/5 bg-white'
      }`}
    >
      {label}
    </button>
  );
}

function HorizontalChips({ children }: { children: React.ReactNode }) {
  return (
    <div className="scrollbar-hidden mt-3 overflow-x-auto overflow-y-visible">
      <div className="flex min-w-max gap-3">{children}</div>
    </div>
  );
}

const tagRows = [
  restaurantTags.slice(0, Math.ceil(restaurantTags.length / 2)),
  restaurantTags.slice(Math.ceil(restaurantTags.length / 2)),
];

type RestaurantCategoryOption = (typeof restaurantCategories)[number];
type WriteCategoryOption = RestaurantCategoryOption & {
  value: RestaurantCategoryKey;
};

function isWriteCategoryOption(item: RestaurantCategoryOption): item is WriteCategoryOption {
  return item.value !== 'ALL';
}

type RestaurantWriteFormProps = {
  selectedPlace: RestaurantSearchItem | null;
  category: RestaurantCategoryKey | null;
  selectedTags: RestaurantTagKey[];
  tagCount: number;
  isSubmitting: boolean;
  isCheckingDuplicate: boolean;
  isDuplicate: boolean;
  displayErrorMessage: string | null;
  selectCategoryAction: (category: RestaurantCategoryKey) => void;
  toggleTagAction: (tag: RestaurantTagKey) => void;
  onSubmitAction: () => void;
};

export function RestaurantWriteForm({
  selectedPlace,
  category,
  selectedTags,
  tagCount,
  isSubmitting,
  isCheckingDuplicate,
  isDuplicate,
  displayErrorMessage,
  selectCategoryAction,
  toggleTagAction,
  onSubmitAction,
}: RestaurantWriteFormProps) {
  const isSubmitDisabled = isSubmitting || isCheckingDuplicate || isDuplicate;

  return (
    <div className="max-w-content mx-auto flex w-full flex-col gap-4 sm:px-6 lg:px-8">
      <div className="border-gray2 rounded-3xl border bg-white px-4 py-5 sm:px-6 sm:py-6">
        <div className="space-y-6 sm:space-y-7">
          <section>
            <FieldHead required hint="학교 주변(1km) 가게만 등록 가능해요.">
              가게 검색
            </FieldHead>

            <Link
              href="/restaurants/write/search"
              className="border-gray2 mt-3 flex h-11 w-full cursor-pointer items-center gap-2 rounded-2xl border bg-white px-4"
            >
              <span
                className={`text-bodySm flex-1 truncate ${
                  selectedPlace ? 'text-black' : 'text-gray5'
                }`}
              >
                {selectedPlace ? selectedPlace.name : '가게 이름을 입력해주세요'}
              </span>
              <Search className="text-gray5 h-4 w-4 shrink-0" />
            </Link>

            {selectedPlace?.address ? (
              <p className="text-caption text-gray5 mt-2">{selectedPlace.address}</p>
            ) : null}

            {selectedPlace && isDuplicate ? (
              <p className="text-caption text-warning-100 mt-2">이미 등록된 맛집이에요.</p>
            ) : null}
          </section>

          <section>
            <FieldTitle required>카테고리</FieldTitle>

            <HorizontalChips>
              {restaurantCategories.filter(isWriteCategoryOption).map((item) => (
                <SelectChip
                  key={item.value}
                  label={item.label}
                  selected={category === item.value}
                  onClickAction={() => selectCategoryAction(item.value)}
                />
              ))}
            </HorizontalChips>
          </section>

          <section>
            <FieldHead hint="최대 3개까지 선택 가능해요.">태그</FieldHead>

            <div className="mt-3 space-y-3">
              {tagRows.map((row, index) => (
                <div key={index} className="scrollbar-hidden overflow-x-auto overflow-y-visible">
                  <div className="flex min-w-max gap-3">
                    {row.map((item) => (
                      <SelectChip
                        key={item.value}
                        label={item.label}
                        selected={selectedTags.includes(item.value)}
                        onClickAction={() => toggleTagAction(item.value)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-caption text-gray5 mt-4">{tagCount} / 3개 선택</p>
          </section>
        </div>
      </div>

      {displayErrorMessage ? (
        <p className="text-caption text-warning-100 px-1 whitespace-pre-line">
          {displayErrorMessage}
        </p>
      ) : null}

      <div className="hidden items-center justify-center gap-3 sm:flex">
        <Link
          href="/restaurants"
          className="border-gray2 text-bodySm text-gray6 inline-flex min-h-11 min-w-32 cursor-pointer items-center justify-center rounded-xl border bg-white px-4 font-semibold"
        >
          취소
        </Link>

        <button
          type="button"
          onClick={onSubmitAction}
          disabled={isSubmitDisabled}
          className="text-bodySm bg-primary inline-flex min-h-11 min-w-36 cursor-pointer items-center justify-center rounded-xl px-4 font-semibold text-white disabled:cursor-default disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-2">
            <span>추천하기</span>
            {isSubmitting ? (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
            ) : null}
          </span>
        </button>
      </div>

      <div className="sm:hidden">
        <button
          type="button"
          onClick={onSubmitAction}
          disabled={isSubmitDisabled}
          className="text-bodySm bg-primary inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl px-4 font-semibold text-white disabled:cursor-default disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-2">
            <span>추천하기</span>
            {isSubmitting ? (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
            ) : null}
          </span>
        </button>
      </div>
    </div>
  );
}
