import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UIFORGE - AI駆動型インターフェースジェネレーター',
  description: 'AIを使って魅力的なUIデザインを生成するWebアプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
