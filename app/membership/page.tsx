'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { axiosAuth } from '@/lib/axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Crown, Loader2, RefreshCw } from 'lucide-react';

type Primitive = string | number | boolean | null | undefined;

interface PlanRecord extends Record<string, Primitive | Record<string, Primitive>> {
  id?: string;
  name?: string;
  nickname?: string;
  description?: string;
  currency?: string;
  unit_amount?: number;
  amount?: number;
  interval?: string;
  interval_count?: number;
  metadata?: Record<string, Primitive>;
  [key: string]: Primitive | Record<string, Primitive>;
}

interface PlanDetail {
  name: string;
  description?: string;
  features?: string[];
}

function formatCurrency(amount?: Primitive, currency?: Primitive) {
  if (typeof amount !== 'number') {
    return amount ? String(amount) : 'Custom pricing';
  }
  const upperCurrency = typeof currency === 'string' ? currency.toUpperCase() : 'USD';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: upperCurrency,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 2,
    }).format(amount / (amount > 999 ? 100 : 1));
  } catch (error) {
    console.warn('Unable to format currency', error);
    return `${amount} ${upperCurrency}`;
  }
}

export default function MembershipPage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoadingPlan, setCheckoutLoadingPlan] = useState<string | null>(null);

  const planDetails: PlanDetail[] = [
    {
      name: 'startner',
      description: 'For those who are just starting out',
      features: [
        'Access to all coins',
        'Access to all coins',
        'Add 3 coins to your favorites',
        'receive weekly updates',
      ],
    },
  ];

  const fetchPlans = useCallback(async () => {
    setError(null);
    try {
      const { data } = await axiosAuth.get('/billing/plans/all');
      const extractedPlans: PlanRecord[] = Array.isArray(data)
        ? data
        : Array.isArray((data as Record<string, unknown>)?.plans)
        ? ((data as Record<string, unknown>).plans as PlanRecord[])
        : [];

      setPlans(extractedPlans);
      if (extractedPlans.length === 0) {
        toast({
          title: 'No plans available yet',
          description: 'Check back soon for new membership options.',
        });
      }
    } catch (err) {
      console.error('Failed to fetch billing plans:', err);
      setError('Unable to load membership plans right now.');
    }
  }, [toast]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPlans();
    setIsRefreshing(false);
  }, [fetchPlans]);

  useEffect(() => {
    setIsLoading(true);
    fetchPlans().finally(() => setIsLoading(false));
  }, [fetchPlans]);

  const handleCheckout = useCallback(
    async (plan: PlanRecord, planKey: string) => {
      const stripePriceId =
        (plan.stripe_price_id as string | undefined) ??
        (plan.metadata?.stripe_price_id as string | undefined) ??
        (plan.metadata?.price_id as string | undefined) ??
        (typeof plan.id === 'string' ? plan.id : undefined);

      if (!stripePriceId) {
        toast({
          variant: 'destructive',
          title: 'Plan unavailable',
          description: 'Unable to find a Stripe price for this plan.',
        });
        return;
      }

      try {
        setCheckoutLoadingPlan(planKey);
        const origin = window.location.origin;
        const { data } = await axiosAuth.post('/billing/checkout/session', {
          stripe_price_id: stripePriceId,
          success_url: `${origin}/membership/checkout/success`,
          cancel_url: `${origin}/membership/checkout/cancel`,
        });

        const sessionUrl =
          (data && typeof data === 'object'
            ? ((data as { url?: string; session_url?: string }).url ??
              (data as { url?: string; session_url?: string }).session_url)
            : undefined) ?? (typeof data === 'string' ? data : undefined);

        if (!sessionUrl) {
          throw new Error('Missing checkout session URL');
        }

        window.location.href = sessionUrl;
      } catch (checkoutError) {
        console.error('Failed to create checkout session:', checkoutError);
        toast({
          variant: 'destructive',
          title: 'Checkout unavailable',
          description: 'Please try again in a moment.',
        });
      } finally {
        setCheckoutLoadingPlan(null);
      }
    },
    [toast]
  );

  const highlightPlanId = useMemo(() => plans[0]?.id, [plans]);

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <Card className="border border-border/60 shadow-md">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge variant="outline" className="mb-2 w-fit items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                Membership
              </Badge>
              <CardTitle className="text-2xl font-semibold">Upgrade Your Collection Experience</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a membership plan to unlock premium analytics, early coin drops, and concierge support.
              </p>
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh plans
            </Button>
          </CardHeader>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <Loading message="Loading membership plans..." />
        ) : plans.length === 0 ? (
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No membership plans are available at the moment.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const planId = (plan.id ?? plan.nickname ?? plan.name ?? 'plan') as string;
              const planName = (plan.name ?? plan.nickname ?? 'Membership Plan') as string;
              const planDetail = planDetails.find(
                ({ name }) => name.trim().toLowerCase() === planName.trim().toLowerCase()
              );
              const planInterval =
                (plan.interval_count && plan.interval
                  ? `${plan.interval_count} ${plan.interval}`
                  : plan.interval) || (plan.metadata?.interval as Primitive) || 'Flexible';
              const price = formatCurrency(
                (plan.unit_amount as number | undefined) ?? (plan.amount as number | undefined),
                plan.currency ?? (plan.metadata?.currency as Primitive)
              );
              const description =
                (typeof plan.description === 'string' && plan.description.trim().length > 0
                  ? plan.description
                  : planDetail?.description) ?? undefined;
              const features = planDetail?.features ?? [];

              const isHighlight = highlightPlanId && plan.id === highlightPlanId;

              return (
                <Card
                  key={planId}
                  className={`border border-border/60 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    isHighlight ? 'ring-2 ring-primary/30' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold">{planName}</CardTitle>
                      {isHighlight && (
                        <Badge className="bg-primary text-primary-foreground uppercase">Recommended</Badge>
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{price}</span>
                      <span className="text-sm text-muted-foreground">/ {planInterval}</span>
                    </div>
                    {description && (
                      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    {/* {plan.metadata && Object.keys(plan.metadata).length > 0 && (
                      <div className="space-y-2 rounded-lg border border-border/60 bg-muted/40 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                          Plan highlights
                        </p>
                        <ul className="space-y-2">
                          {Object.entries(plan.metadata).map(([key, value]) => (
                            <li key={key} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">
                                <span className="font-medium text-foreground">{key.replace(/_/g, ' ')}:</span>{' '}
                                {typeof value === 'boolean'
                                  ? value
                                    ? 'Yes'
                                    : 'No'
                                  : value ?? 'Not specified'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )} */}
                    {features.length > 0 && (
                      <ul className="space-y-2">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                    className='w-full'
                      size="sm"
                      disabled={checkoutLoadingPlan === planId}
                      onClick={() => handleCheckout(plan, planId)}
                    >
                      {checkoutLoadingPlan === planId ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redirecting...
                        </>
                      ) : (
                        'Choose plan'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

