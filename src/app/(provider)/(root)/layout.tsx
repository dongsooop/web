import AppShell from '@/components/layout/AppShell';

export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
