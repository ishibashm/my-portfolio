"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Globals/Navigation/Navigation";
// import { Footer } from '@/components/Globals/Footer/Footer';
// import { PreviewNotice } from '@/components/Globals/PreviewNotice/PreviewNotice';
import { InteractiveBackground } from "@/components/Globals/InteractiveBackground/InteractiveBackground";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <InteractiveBackground />
          {/* <PreviewNotice /> */}
          <Navigation />
          <main>{children}</main>
          {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
