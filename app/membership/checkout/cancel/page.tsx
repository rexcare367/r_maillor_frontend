'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MembershipCheckoutCancelPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-lg border border-border/60 shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-3 text-center">
            <span className="rounded-full bg-destructive/10 p-3 text-destructive">
              <XCircle className="h-8 w-8" />
            </span>
            <CardTitle className="text-2xl font-semibold">Checkout canceled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-center text-sm text-muted-foreground">
            <p>Your payment was not completed. You can resume the checkout whenever you are ready.</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/80">
              Need help? Contact support and we&apos;ll get you back on track.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="default">
              <Link href="/membership">Retry checkout</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard">Return to dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}


