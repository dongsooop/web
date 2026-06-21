import RestaurantsPageContent from './_components/RestaurantsPageContent';

export default function RestaurantsPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-4 lg:min-h-[calc(100dvh-3rem)]">
      <RestaurantsPageContent />
    </div>
  );
}
