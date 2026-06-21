'use client';

import {
  Coffee,
  ChevronDown,
  Hamburger,
  Heart,
  MapPin,
  Pizza,
  Plus,
  Search,
  Soup,
  UtensilsCrossed,
  Fish,
} from 'lucide-react';

type Category = {
  label: string;
  active?: boolean;
};

type RestaurantCategory =
  | 'KOREAN'
  | 'CHINESE'
  | 'JAPANESE'
  | 'WESTERN'
  | 'BUNSIK'
  | 'FAST_FOOD'
  | 'CAFE_DESSERT'
  | '한식'
  | '중식'
  | '일식'
  | '양식'
  | '분식'
  | '패스트푸드'
  | '카페/디저트';

function BowlChopsticksIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path d="M7 4.5 9.5 11" />
      <path d="M12.5 4.5 15 11" />
      <path d="M4 12.5c1.8-1.7 4.8-2.5 8-2.5s6.2.8 8 2.5" />
      <path d="M4 12.5c0 2.5 3.6 4.5 8 4.5s8-2 8-4.5" />
      <path d="M5 14c.8 3.4 3.7 5.5 7 5.5s6.2-2.1 7-5.5" />
    </svg>
  );
}

type Restaurant = {
  id: number;
  name: string;
  distance: number;
  likeCount: number;
  category: RestaurantCategory;
  notes: string[];
  likedByMe: boolean;
};

const categories: Category[] = [
  { label: '전체', active: true },
  { label: '한식' },
  { label: '중식' },
  { label: '일식' },
  { label: '양식' },
  { label: '분식' },
  { label: '패스트푸드' },
  { label: '카페/디저트' },
];

const categoryIcon: Record<RestaurantCategory, React.ReactNode> = {
  KOREAN: <UtensilsCrossed className="h-7 w-7" />,
  CHINESE: <BowlChopsticksIcon />,
  JAPANESE: <Fish className="h-7 w-7" />,
  WESTERN: <Pizza className="h-7 w-7" />,
  BUNSIK: <Soup className="h-7 w-7" />,
  FAST_FOOD: <Hamburger className="h-7 w-7" />,
  CAFE_DESSERT: <Coffee className="h-7 w-7" />,
  한식: <UtensilsCrossed className="h-7 w-7" />,
  중식: <BowlChopsticksIcon />,
  일식: <Fish className="h-7 w-7" />,
  양식: <Pizza className="h-7 w-7" />,
  분식: <Soup className="h-7 w-7" />,
  패스트푸드: <Hamburger className="h-7 w-7" />,
  '카페/디저트': <Coffee className="h-7 w-7" />,
};

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: '돈전성시',
    distance: 159,
    likeCount: 5,
    category: 'KOREAN',
    notes: ['점심으로 편안해요', '음식이 맛있어요'],
    likedByMe: false,
  },
  {
    id: 2,
    name: '고척칼국수',
    distance: 285,
    likeCount: 4,
    category: 'BUNSIK',
    notes: ['양이 많아요', '음식이 맛있어요', '가성비가 좋아요'],
    likedByMe: false,
  },
  {
    id: 3,
    name: '시골집',
    distance: 96,
    likeCount: 2,
    category: 'CHINESE',
    notes: ['음식이 맛있어요', '가성비가 좋아요', '양이 많아요'],
    likedByMe: true,
  },
  {
    id: 4,
    name: '지지고 동양미래대점',
    distance: 102,
    likeCount: 2,
    category: 'FAST_FOOD',
    notes: ['음식이 맛있어요', '점심으로 편안해요', '가성비가 좋아요'],
    likedByMe: false,
  },
  {
    id: 5,
    name: '전주식당',
    distance: 135,
    likeCount: 2,
    category: 'WESTERN',
    notes: ['음식이 맛있어요', '점심으로 편안해요', '혼밥하기 좋아요'],
    likedByMe: false,
  },
  {
    id: 6,
    name: '스시하루',
    distance: 210,
    likeCount: 3,
    category: 'JAPANESE',
    notes: ['깔끔해요', '혼밥하기 좋아요'],
    likedByMe: true,
  },
  {
    id: 7,
    name: '카페온',
    distance: 188,
    likeCount: 3,
    category: 'CAFE_DESSERT',
    notes: ['디저트가 맛있어요', '조용해요'],
    likedByMe: false,
  },
];

const categoryLabel: Record<RestaurantCategory, string> = {
  KOREAN: '한식',
  CHINESE: '중식',
  JAPANESE: '일식',
  WESTERN: '양식',
  BUNSIK: '분식',
  FAST_FOOD: '패스트푸드',
  CAFE_DESSERT: '카페/디저트',
  한식: '한식',
  중식: '중식',
  일식: '일식',
  양식: '양식',
  분식: '분식',
  패스트푸드: '패스트푸드',
  '카페/디저트': '카페/디저트',
};

function formatDistance(distance: number) {
  return `${distance}m`;
}

function formatLikes(likeCount: number) {
  return `${likeCount}명이 좋아하는 가게예요`;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gray1 text-caption text-gray6 rounded-full px-2.5 py-1 font-medium">
      {children}
    </span>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <article className="border-gray2 min-h-14 rounded-2xl border bg-white px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="text-primary bg-gray7 flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16">
          {categoryIcon[restaurant.category]}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-heading truncate font-bold text-black">{restaurant.name}</h2>
              <div className="text-caption text-gray5 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {formatDistance(restaurant.distance)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {formatLikes(restaurant.likeCount)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="text-primary hover:bg-primary/5 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
              aria-label={`${restaurant.name} 찜하기`}
            >
              <Heart className={`h-4 w-4 ${restaurant.likedByMe ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Tag>{categoryLabel[restaurant.category]}</Tag>
            {restaurant.notes.map((note) => (
              <Tag key={note}>{note}</Tag>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function RestaurantsPageContent() {
  return (
    <div className="w-full">
      <div className="max-w-content mx-auto flex w-full flex-col gap-4 px-4 pb-8 sm:gap-5">
        <section className="border-gray2 rounded-3xl border bg-white px-4 py-5 sm:px-6 sm:py-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-caption text-primary font-semibold uppercase">Dongsoop Picks</p>
                <div className="space-y-1">
                  <h1 className="text-title font-bold text-black">학교 근처 맛집 추천</h1>
                  <p className="text-bodySm text-gray6 sm:text-body">
                    동미대 학생들이 추천하는 맛집을 한 화면에서 살펴보세요.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:pt-4">
                <button
                  type="button"
                  className="text-primary border-primary/10 bg-primary/5 text-bodySm hover:bg-primary/10 hidden min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 font-semibold shadow-sm transition lg:inline-flex"
                >
                  <Plus className="h-4 w-4" />
                  맛집 추가하기
                </button>

                <label className="border-gray2 flex min-h-11 w-full cursor-text items-center gap-2 rounded-2xl border bg-white px-4 lg:w-[240px]">
                  <Search className="text-gray5 h-4 w-4 cursor-pointer" />
                  <input
                    type="search"
                    placeholder="가게 검색"
                    className="text-bodySm placeholder:text-gray5 w-full bg-transparent text-black outline-none"
                  />
                </label>
              </div>
            </div>

            <div className="scrollbar-hidden overflow-x-auto overflow-y-visible py-1">
              <div className="flex min-w-max gap-2">
                {categories.map((category) => (
                  <button
                    key={category.label}
                    type="button"
                    className={`text-bodySm h-11 cursor-pointer rounded-full border px-4 font-semibold transition ${
                      category.active
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray2 text-gray6 bg-white'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-gray2 rounded-3xl border bg-white px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex flex-col gap-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.name} restaurant={restaurant} />
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="border-gray2 text-bodySm hover:border-primary/20 hover:bg-primary/5 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl border bg-white px-6 font-semibold text-black transition"
            >
              더 많은 맛집 보기
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      <button
        type="button"
        className="bg-primary fixed right-5 bottom-6 z-30 inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-white lg:hidden"
        aria-label="맛집 추가하기"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
