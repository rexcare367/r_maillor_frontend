import { getSupabaseFrontendClient } from '@/lib/supabase/client';

/**
 * Get the current user session
 * @returns Promise with user data or null
 */
export async function getCurrentUser() {
  const supabase = getSupabaseFrontendClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current access token
 * @returns Promise with access token or null
 */
export async function getAccessToken(): Promise<string | null> {
  const supabase = getSupabaseFrontendClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Check if user is authenticated
 * @returns Promise with boolean indicating if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = getSupabaseFrontendClient();
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

/**
 * Get user ID from session
 * @returns Promise with user ID or null
 */
export async function getUserId(): Promise<string | null> {
  const supabase = getSupabaseFrontendClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = getSupabaseFrontendClient();
  await supabase.auth.signOut();
}

/**
 * Refresh the current session
 */
export async function refreshSession() {
  const supabase = getSupabaseFrontendClient();
  await supabase.auth.refreshSession();
}

/**
 * Get user metadata from the session
 */
export async function getUserMetadata() {
  const supabase = getSupabaseFrontendClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.user_metadata || null;
}



