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
import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  ExternalLink,
  Hash,
  Loader2,
  Mail,
  RefreshCw,
  User2,
  XCircle,
} from 'lucide-react';
import { axiosAuth } from '@/lib/axios';

type Primitive = string | number | boolean | null | undefined;

interface CancelSubscriptionPayload {
  reason?: string;
  stripe_invoice_url?: string;
}

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

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfilePayload | null>(profile as ProfilePayload | null);
  const [isLoading, setIsLoading] = useState(!profile);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
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

const activeSubscriptionId = useMemo(() => {
    if (!activeSubscription) return null;
    const candidates = [
      activeSubscription['id'],
      activeSubscription['subscription_id'],
      activeSubscription['stripe_subscription_id'],
      activeSubscription['stripe_id'],
      activeSubscription['subscriptionId'],
    ];

    const idCandidate = candidates.find((candidate) => {
      if (typeof candidate === 'number') return true;
      if (typeof candidate === 'string') return candidate.trim().length > 0;
      return false;
    });

    if (typeof idCandidate === 'number') {
      return String(idCandidate);
    }

    if (typeof idCandidate === 'string') {
      return idCandidate.trim();
    }

    return null;
  }, [activeSubscription]);

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

  const subscriptionStartDate = useMemo(() => {
    if (!activeSubscription) return null;
    const candidates = [
      activeSubscription['current_period_start'],
      activeSubscription['start_date'],
      activeSubscription['started_at'],
      activeSubscription['created'],
    ];
    const value = candidates.find((candidate) => typeof candidate === 'string') as string | undefined;
    return value ?? null;
  }, [activeSubscription]);

  const subscriptionInvoiceUrl = useMemo(() => {
    if (!activeSubscription) return null;
    const directUrlCandidates = [
      activeSubscription['latest_invoice_url'],
      activeSubscription['invoice_url'],
      activeSubscription['hosted_invoice_url'],
      activeSubscription['stripe_invoice_url'],
    ];
    const directUrl = directUrlCandidates.find(
      (candidate) => typeof candidate === 'string' && candidate.trim().length > 0,
    ) as string | undefined;
    if (directUrl) return directUrl;

    const latestInvoice = activeSubscription['latest_invoice'];
    if (latestInvoice && typeof latestInvoice === 'object') {
      const invoiceRecord = latestInvoice as Record<string, Primitive>;
      const nestedCandidates = [
        invoiceRecord['hosted_invoice_url'],
        invoiceRecord['invoice_pdf'],
        invoiceRecord['url'],
      ];
      const nestedUrl = nestedCandidates.find(
        (candidate) => typeof candidate === 'string' && candidate.trim().length > 0,
      ) as string | undefined;
      if (nestedUrl) return nestedUrl;
    }

    return null;
  }, [activeSubscription]);

  const handleCancelSubscription = useCallback(async () => {
    if (!activeSubscription) return;
    if (!activeSubscriptionId) {
      setError('Unable to identify your subscription. Please contact support.');
      return;
    }
    setIsCancelling(true);
    setError(null);
    try {
      const payload: CancelSubscriptionPayload = {};
      if (subscriptionInvoiceUrl) {
        payload.stripe_invoice_url = subscriptionInvoiceUrl;
      }

      await axiosAuth.post(`/subscriptions/${encodeURIComponent(activeSubscriptionId)}/cancel`, payload);
      const updatedProfile = await refreshProfile();
      setProfileData(updatedProfile as ProfilePayload | null);
      toast({
        title: 'Subscription canceled',
        description: 'Your membership will remain active until the current period ends.',
      });
    } catch (err) {
      console.error('Unable to cancel subscription:', err);
      setError('Unable to cancel your subscription right now. Please try again shortly.');
      toast({
        variant: 'destructive',
        title: 'Cancellation failed',
        description: 'Please try again in a moment or contact support.',
      });
    } finally {
      setIsCancelling(false);
    }
  }, [activeSubscription, activeSubscriptionId, refreshProfile, subscriptionInvoiceUrl, toast]);

  const emailVerified = useMemo(() => {
    if (!userInfo) return false;
    const metadataValue =
      (userInfo.user_metadata?.email_verified as Primitive) ??
      (userInfo.user_metadata?.email_confirmed as Primitive) ??
      (userInfo.email_verified as Primitive);
    if (typeof metadataValue === 'boolean') return metadataValue;
    if (typeof metadataValue === 'string') {
      const normalized = metadataValue.trim().toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
    if (typeof metadataValue === 'number') {
      return metadataValue === 1;
    }
    return Boolean(metadataValue);
  }, [userInfo]);

  const displayName = useMemo(() => {
    if (stripeCustomer?.name) return stripeCustomer.name;
    if (userInfo?.email) return userInfo.email.split('@')[0]?.replace(/\./g, ' ') ?? 'Member';
    return 'Member';
  }, [stripeCustomer, userInfo]);

  const emailValue = userInfo?.email ?? stripeCustomer?.email ?? 'No email on file';
  const primaryName = stripeCustomer?.name ?? displayName;
  const createdAtDisplay = formatDate(userInfo?.created_at);
  const lastSignInDisplay = formatDate(userInfo?.last_sign_in_at);
  const stripeCustomerId = stripeCustomer?.stripe_customer_id ?? stripeCustomer?.id ?? '—';
  const relatedUserId = stripeCustomer?.user_id ?? userInfo?.id ?? '—';
  const emailStatusLabel = emailVerified ? 'Verified' : 'Not Verified';

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
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Mail className="h-4 w-4 text-primary" />
                          {emailValue}
                        </span>
                        <Badge
                          variant={emailVerified ? 'default' : 'outline'}
                          className="flex items-center gap-1 text-xs font-medium"
                        >
                          {emailVerified ? (
                            <BadgeCheck className="h-3.5 w-3.5" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5" />
                          )}
                          {emailStatusLabel}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Name</p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <User2 className="h-4 w-4 text-primary" />
                        {primaryName}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Created</p>
                      <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
                        <Clock3 className="h-4 w-4 text-primary" />
                        {createdAtDisplay}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Last Sign-In
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {lastSignInDisplay}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Stripe Customer
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Hash className="h-4 w-4 text-primary" />
                        {stripeCustomerId}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        User ID
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Hash className="h-4 w-4 text-primary" />
                        {relatedUserId}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Subscription Detail</CardTitle>
              </CardHeader>
              <CardContent>
                {activeSubscription ? (
                  <div className="flex flex-col gap-6">
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-6 shadow-inner">
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                            Active Plan
                          </p>
                          <h3 className="mt-2 text-2xl font-semibold text-foreground">{subscriptionPlanName}</h3>
                          <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-primary" />
                              <span>Started {formatDate(subscriptionStartDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-3 md:items-end">
                          {subscriptionInvoiceUrl ? (
                            <Button variant="outline" size="sm" asChild>
                              <a href={subscriptionInvoiceUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View latest invoice
                              </a>
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground">No invoice available</span>
                          )}
                          <Button
                            variant="destructive"
                            onClick={handleCancelSubscription}
                            disabled={isCancelling}
                          >
                            {isCancelling ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              'Cancel subscription'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
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
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
