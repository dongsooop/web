import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QueryProvider from '@/providers/QueryProvider';
import FirebaseProvider from '@/providers/FirebaseProvider';

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '동숲 | Dongsoop',
  description: '동양미래대학교 대학생들을 위한 소셜 네트워크 플랫폼',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-pretendard flex min-h-dvh flex-col`}>
        <QueryProvider>
          <FirebaseProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </FirebaseProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
