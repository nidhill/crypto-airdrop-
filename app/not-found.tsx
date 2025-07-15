import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4">🪂</div>
        <h1 className="text-4xl font-bold mb-4">
          Airdrop not found!
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          This airdrop seems to have landed elsewhere. Let's get you back to discovering new opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/airdrops">
              <Search className="w-5 h-5 mr-2" />
              Browse Airdrops
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}