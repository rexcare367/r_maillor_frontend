'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login',
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo, requireAuth]);

  if (isLoading) {
    return <Loading message="Loading..." fullHeight />;
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
}

