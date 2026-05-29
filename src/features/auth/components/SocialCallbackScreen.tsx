'use client';

type SocialCallbackScreenProps = {
  message: string;
  wide?: boolean;
};

export function SocialCallbackScreen({ message, wide = false }: SocialCallbackScreenProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-8">
      <div
        className={`flex w-full flex-col items-center justify-center text-center ${
          wide ? 'max-w-[800px]' : 'max-w-[480px]'
        }`}
      >
        <div className="text-primary mb-4 h-10 w-10 animate-spin rounded-full border-4 border-current/90 border-t-transparent" />
        <p className="text-body text-black">{message}</p>
      </div>
    </div>
  );
}
