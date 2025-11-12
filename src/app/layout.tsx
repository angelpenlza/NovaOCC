import type { Metadata } from 'next';
import '../styles/globals.css';
import '../styles/map.css';
import '../styles/posts.css';

export const metadata: Metadata = {
  title: 'Cora - Safety Platform',
  description: 'Community-driven crime mapping ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
