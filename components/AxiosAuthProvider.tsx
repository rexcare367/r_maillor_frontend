'use client';

import { ReactNode, useEffect } from 'react';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';

export default function AxiosAuthProvider({ children }: { children: ReactNode }) {
  // Initialize axios auth interceptors for the entire app
  useAxiosAuth();

  useEffect(() => {
    console.log('🔐 AxiosAuthProvider initialized - Authentication interceptors are active');
  }, []);

  return <>{children}</>;
}

