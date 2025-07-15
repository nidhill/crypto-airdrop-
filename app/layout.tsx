import './globals.css';
import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth.tsx';

const sora = Sora({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Claimex - Claim smarter. Earn faster.',
  description: 'Discover the latest crypto airdrops and testnet opportunities. Join thousands of users claiming rewards daily.',
  keywords: 'crypto, airdrop, testnet, blockchain, cryptocurrency, rewards, claim',
  authors: [{ name: 'Claimex Team' }],
  openGraph: {
    title: 'Claimex - Crypto Airdrop Discovery',
    description: 'Claim smarter. Earn faster. Discover the latest airdrops.',
    url: 'https://claimex.com',
    siteName: 'Claimex',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Claimex - Crypto Airdrop Discovery Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claimex - Claim smarter. Earn faster.',
    description: 'Discover the latest crypto airdrops and testnet opportunities.',
    images: ['/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={sora.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}