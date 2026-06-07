import SignInForm from './_components/SignInForm';

export default function SignInPage() {
  const kakaoJsKey = process.env.KAKAO_JS_KEY?.trim() ?? '';

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center bg-white px-4">
      <SignInForm kakaoJsKey={kakaoJsKey} />
    </div>
  );
}
