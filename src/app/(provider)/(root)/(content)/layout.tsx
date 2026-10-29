export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center py-2">{children}</div>
  );
}
