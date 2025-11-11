import type { Metadata } from 'next';
import '../styles/globals.css';
import '../styles/map.css';
import '../styles/posts.css';

export const metadata: Metadata = {
  title: 'NovaOCC - Orange County Crime Mapping & Safety Platform',
  description: 'Community-driven crime mapping and safety reporting platform',
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

