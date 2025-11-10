'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Loading from '@/components/Loading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Loader2, RefreshCw, User2, Wallet } from 'lucide-react';

type Primitive = string | number | boolean | null | undefined;

interface ProfilePayload {
  user: {
    id: string;
    email?: string;
    email_verified?: boolean;
    created_at?: string;
    last_sign_in_at?: string;
    user_metadata?: Record<string, Primitive | Record<string, Primitive>>;
    app_metadata?: Record<string, Primitive | Record<string, Primitive>>;
    [key: string]: unknown;
  } | null;
  stripe_customer?: {
    id?: string;
    user_id?: string;
    stripe_customer_id?: string;
    email?: string;
    name?: string;
    created_at?: string;
    updated_at?: string;
    metadata?: Record<string, Primitive | Record<string, Primitive>>;
    [key: string]: unknown;
  } | null;
  subscriptions?: {
    active?: Record<string, Primitive | Record<string, Primitive>> | null;
    all?: Array<Record<string, Primitive | Record<string, Primitive>>>;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

function formatDate(value?: Primitive) {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function renderKeyValue(data?: Record<string, Primitive | Record<string, Primitive>>) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-sm text-muted-foreground">No data available.</p>;
  }

  return (
    <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Object.entries(data).map(([key, rawValue]) => {
        const label = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (letter) => letter.toUpperCase());

        let displayValue: string;
        if (rawValue === null || rawValue === undefined) {
          displayValue = '—';
        } else if (typeof rawValue === 'boolean') {
          displayValue = rawValue ? 'Yes' : 'No';
        } else if (typeof rawValue === 'object') {
          displayValue = JSON.stringify(rawValue, null, 2);
        } else if (key.toLowerCase().includes('date') || key.toLowerCase().includes('period')) {
          displayValue = formatDate(rawValue);
        } else {
          displayValue = String(rawValue);
        }

        return (
          <div
            key={key}
            className="rounded-lg border border-border/60 bg-background px-4 py-3 shadow-sm transition hover:border-border"
          >
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-sm text-foreground">
              {typeof rawValue === 'object' && rawValue !== null ? (
                <pre className="whitespace-pre-wrap break-words text-xs text-muted-foreground">
                  {displayValue}
                </pre>
              ) : (
                displayValue
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfilePayload | null>(profile as ProfilePayload | null);
  const [isLoading, setIsLoading] = useState(!profile);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProfileData(profile as ProfilePayload | null);
  }, [profile]);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const freshProfile = await refreshProfile();
        if (isMounted) {
          setProfileData(freshProfile as ProfilePayload | null);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        if (isMounted) {
          setError('Unable to load your profile information right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [refreshProfile]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const data = await refreshProfile();
      setProfileData(data as ProfilePayload | null);
      toast({
        title: 'Profile refreshed',
        description: 'Your account details are now up to date.',
      });
    } catch (err) {
      console.error('Unable to refresh profile:', err);
      setError('Unable to refresh your profile. Please try again later.');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshProfile, toast]);

  const userInfo = profileData?.user ?? null;
  const stripeCustomer = profileData?.stripe_customer ?? null;
  const subscriptions = profileData?.subscriptions ?? null;

  const activeSubscription = useMemo(() => {
    return (subscriptions?.active ?? null) as Record<string, Primitive | Record<string, Primitive>> | null;
  }, [subscriptions]);

  const subscriptionList = useMemo(() => {
    return (subscriptions?.all ?? []) as Array<Record<string, Primitive | Record<string, Primitive>>>;
  }, [subscriptions]);

  const subscriptionStatus = useMemo(() => {
    const statusValue = activeSubscription?.['status'] as Primitive;
    if (typeof statusValue === 'string') {
      return statusValue;
    }
    if (activeSubscription) {
      const candidate =
        (activeSubscription['subscription_status'] as Primitive) ??
        (activeSubscription['state'] as Primitive);
      if (typeof candidate === 'string') {
        return candidate;
      }
    }
    return 'Not Active';
  }, [activeSubscription]);

  const subscriptionPlanName = useMemo(() => {
    if (!activeSubscription) return 'No plan';
    const candidates = [
      activeSubscription['plan'],
      activeSubscription['plan_name'],
      activeSubscription['price_name'],
      activeSubscription['product_name'],
    ];
    const plan = candidates.find((candidate) => typeof candidate === 'string') as string | undefined;
    return plan ?? 'No plan';
  }, [activeSubscription]);

  const subscriptionRenewal = useMemo(() => {
    if (!activeSubscription) return null;
    const candidates = [
      activeSubscription['current_period_end'],
      activeSubscription['current_period_end_at'],
      activeSubscription['renewal_date'],
    ];
    const value = candidates.find((candidate) => typeof candidate === 'string') as string | undefined;
    return value ?? null;
  }, [activeSubscription]);

  const customerSummary = useMemo(() => {
    if (!stripeCustomer) return null;
    const { metadata, ...rest } = stripeCustomer;
    console.log(metadata);
    return rest as Record<string, Primitive | Record<string, Primitive>>;
  }, [stripeCustomer]);

  const primaryInfo = useMemo(() => {
    if (!userInfo) return null;
    const emailVerified =
      (userInfo.user_metadata?.email_verified as Primitive) ??
      (userInfo.user_metadata?.email_confirmed as Primitive) ??
      (userInfo.email_verified as Primitive) ??
      false;

    return {
      email: userInfo.email ?? '—',
      email_verified: typeof emailVerified === 'boolean' ? emailVerified : emailVerified ?? false,
      created_at: userInfo.created_at ?? null,
      last_sign_in_at: userInfo.last_sign_in_at ?? null,
    } as Record<string, Primitive>;
  }, [userInfo]);

  const displayName = useMemo(() => {
    if (stripeCustomer?.name) return stripeCustomer.name;
    if (userInfo?.email) return userInfo.email.split('@')[0]?.replace(/\./g, ' ') ?? 'Member';
    return 'Member';
  }, [stripeCustomer, userInfo]);

  const emailValue = userInfo?.email ?? stripeCustomer?.email ?? 'No email on file';

  const initials = useMemo(() => {
    const [first = '', second = ''] = displayName.split(' ');
    const fallback = emailValue?.charAt(0) ?? 'U';
    const generated = `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
    return generated.trim() || fallback.toUpperCase();
  }, [displayName, emailValue]);

  const statusVariant =
    subscriptionStatus.toLowerCase() === 'active'
      ? 'default'
      : subscriptionStatus.toLowerCase() === 'canceled'
      ? 'destructive'
      : 'secondary';

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <Card className="border border-border/60 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border border-border bg-gradient-to-br from-slate-900 to-slate-700 text-white">
                <AvatarFallback className="bg-gradient-to-br from-gold-500 to-yellow-400 text-lg font-semibold text-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold text-foreground">{displayName}</h1>
                  <Badge variant={statusVariant} className="uppercase tracking-wide">
                    {subscriptionStatus}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{emailValue}</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <Badge variant="outline" className="gap-2 text-xs uppercase tracking-widest">
                <User2 className="h-4 w-4" />
                Profile ID: {userInfo?.id ?? 'N/A'}
              </Badge>
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-border/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-slate-200">
                <Wallet className="h-4 w-4" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold capitalize">{subscriptionPlanName}</p>
              <p className="mt-2 text-sm text-slate-300">
                Status: <span className="capitalize">{subscriptionStatus}</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Next renewal: {formatDate(subscriptionRenewal)}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
                <CreditCard className="h-4 w-4 text-primary" />
                Stripe Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {stripeCustomer?.stripe_customer_id ?? stripeCustomer?.id ?? 'Not created'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Email: {stripeCustomer?.email ?? '—'}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Name: {stripeCustomer?.name ?? displayName}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
                <User2 className="h-4 w-4 text-primary" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold capitalize">{displayName}</p>
              <p className="mt-2 text-sm text-muted-foreground">Email: {emailValue}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Subscriptions on file: {subscriptionList.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <Loading message="Loading your profile..." />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <Card className="border border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Primary Information</CardTitle>
              </CardHeader>
              <CardContent>{renderKeyValue(primaryInfo ?? undefined)}</CardContent>
            </Card>

            <Card className="border border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Subscription Detail</CardTitle>
              </CardHeader>
              <CardContent>
                {activeSubscription ? (
                  renderKeyValue(activeSubscription)
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                      No active subscription found. Upgrade to unlock premium membership.
                    </p>
                    <Button className="w-fit" onClick={() => router.push('/membership')}>
                      Upgrade membership
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                {customerSummary ? (
                  renderKeyValue(customerSummary)
                ) : (
                  <p className="text-sm text-muted-foreground">No Stripe customer information is available yet.</p>
                )}
              </CardContent>
            </Card>

            {!activeSubscription && subscriptionList.length > 0 && (
              <Card className="border border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Available Subscription History</CardTitle>
                </CardHeader>
                <CardContent>
                  {subscriptionList.map((item, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="mb-2 text-sm font-semibold text-muted-foreground">
                        Subscription #{index + 1}
                      </div>
                      {renderKeyValue(item)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
