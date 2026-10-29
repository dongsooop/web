import BottomNav from '@/components/layout/BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-shell-content">{children}</div>
      <BottomNav />
    </div>
  );
}
