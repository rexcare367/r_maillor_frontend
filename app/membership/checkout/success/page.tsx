'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MembershipCheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/profile');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-lg border border-border/60 shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-3 text-center">
            <span className="rounded-full bg-primary/10 p-3 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <CardTitle className="text-2xl font-semibold">Payment confirmed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-center text-sm text-muted-foreground">
            <p>Your membership is being activated. You will receive a confirmation email shortly.</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/80">
              Thank you for supporting our collector community.
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/80">
              Redirecting to your profile in 5 seconds.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="default">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/membership">Browse plans</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}


