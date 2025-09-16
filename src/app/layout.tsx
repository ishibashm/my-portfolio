'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Globals/Navigation/Navigation';
// import { PreviewNotice } from '@/components/Globals/PreviewNotice/PreviewNotice';
import { InteractiveBackground } from '@/components/Globals/InteractiveBackground/InteractiveBackground';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <InteractiveBackground />
        {/* <PreviewNotice /> */}
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}