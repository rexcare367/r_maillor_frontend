'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
import UserMenu from '@/components/UserMenu';

export default function Header() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogoClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gold-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 
          className="text-xl font-bold text-foreground cursor-pointer hover:text-gold-600 transition-colors"
          onClick={handleLogoClick}
        >
          Meillor
        </h1>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : user ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="default" className="hover:bg-gold-50 hover:border-gold-500">
                  Se connecter
                </Button>
              </Link>
              <Link href="/register">
                <Button size="default" className="bg-gold-500 hover:bg-gold-600 hover:text-black">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Devenir Membre
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

