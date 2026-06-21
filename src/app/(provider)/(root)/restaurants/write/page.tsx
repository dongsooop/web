import RestaurantWriteContent from './_components/RestaurantWriteContent';

type RestaurantWritePageProps = {
  searchParams?: Promise<{
    externalMapId?: string;
    name?: string;
    address?: string;
    placeUrl?: string;
    distance?: string;
  }>;
};

function parseDistance(value?: string) {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default async function RestaurantWritePage({ searchParams }: RestaurantWritePageProps) {
  const params = await searchParams;
  const selectedPlace =
    params?.externalMapId && params?.name && params?.placeUrl
      ? {
          externalMapId: params.externalMapId,
          name: params.name,
          address: params.address ?? '',
          placeUrl: params.placeUrl,
          distance: parseDistance(params.distance),
        }
      : null;

  return (
    <RestaurantWriteContent
      key={selectedPlace?.externalMapId ?? 'empty'}
      selectedPlace={selectedPlace}
    />
  );
}
