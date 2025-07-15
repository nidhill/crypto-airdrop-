"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Droplets, 
  Menu, 
  X, 
  Home, 
  Gift, 
  Newspaper, 
  Users, 
  Shield,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const pathname = usePathname();
  const auth = useAuth();
  const user = auth?.user;
  const loading = auth?.loading;
  const signOut = auth?.signOut;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Only show Admin button if on /admin and (optionally) a fake admin token exists or user is admin
    const hasFakeToken = typeof window !== 'undefined' && localStorage.getItem('fake_admin_token');
    const isAdminEmail = user && (user.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@claimex.com'));
    setShowAdmin(pathname === '/admin' && (hasFakeToken || isAdminEmail));
  }, [pathname, user]);

  const baseNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/airdrops', label: 'Airdrops', icon: Gift },
    { href: '/news', label: 'News', icon: Newspaper },
    { href: '/crypto', label: 'Crypto', icon: BarChart3 },
    { href: '/community', label: 'Community', icon: Users },
  ];

  const navItems = showAdmin
    ? [...baseNavItems, { href: '/admin', label: 'Admin', icon: Shield }]
    : baseNavItems;
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-background/80 backdrop-blur-lg border-b border-border/50" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-gradient">Claimex</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth UI */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {loading ? null : user ? (
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url || undefined} alt={user.email} />
                  <AvatarFallback>{user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Logout
                </Button>
              </div>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}