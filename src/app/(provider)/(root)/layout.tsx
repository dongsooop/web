import Script from 'next/script';
import AppShell from '@/components/layout/AppShell';

export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="adsense-script"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9706697545903881"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <AppShell>{children}</AppShell>
    </>
  );
}
