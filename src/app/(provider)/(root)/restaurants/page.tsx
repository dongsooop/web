import AdsenseScript from '@/components/layout/AdsenseScript';
import RestaurantsList from './_components/RestaurantsList';

export default function RestaurantsPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center py-3">
      <AdsenseScript />
      <RestaurantsList />
    </div>
  );
}
