import SocialConnect from './_components/SocialConnect';

export default function SocialConnectionsPage() {
  const kakaoJsKey = process.env.KAKAO_JS_KEY?.trim() ?? '';

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full flex-col items-center py-6 lg:min-h-[calc(100dvh-3rem)]">
      <SocialConnect kakaoJsKey={kakaoJsKey} />
    </div>
  );
}
