type LoginRequiredGuardProps = {
  isLoggedIn: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function LoginRequiredGuard({
  isLoggedIn,
  children,
  className,
}: LoginRequiredGuardProps) {
  return (
    <div className={`relative ${className ?? ''}`.trim()}>
      {!isLoggedIn ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl">
          <div className="absolute inset-0 rounded-xl bg-white/35" aria-hidden="true" />
          <div
            className="text-caption text-gray6 relative rounded-full bg-white/90 px-4 py-2 font-semibold shadow-sm backdrop-blur-sm"
            role="note"
            aria-live="polite"
          >
            로그인이 필요한 서비스예요!
          </div>
        </div>
      ) : null}

      <div
        className={`${!isLoggedIn ? 'pointer-events-none blur-[3px] select-none' : ''}`}
        aria-hidden={!isLoggedIn}
      >
        {children}
      </div>
    </div>
  );
}
