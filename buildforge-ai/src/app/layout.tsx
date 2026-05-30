import type { Metadata } from 'next';
import './globals.css';
import Background from '@/components/Background';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ReferralCapture from '@/components/ReferralCapture';

export const metadata: Metadata = {
  title: 'BuildForge AI — Plan Your Dream Build Before Spending a Dollar',
  description:
    'Realistic modification roadmaps, cost estimates, and horsepower projections for your car build — generated in seconds.',
  keywords: ['car build planner', 'horsepower calculator', 'mod cost estimator', 'tuning'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain min-h-screen antialiased">
        <Background />
        <ReferralCapture />
        <Nav />
        <main className="relative z-10 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
