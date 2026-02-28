import Sidebar from '@/components/layout/Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray7 min-h-dvh">
      <div className="mx-auto flex w-full">
        <Sidebar />

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
