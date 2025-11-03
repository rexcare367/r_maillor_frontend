'use client';

import { useEffect, useRef } from "react";
import { axiosAuth } from "../axios";
import { getSupabaseFrontendClient } from "../supabase/client";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const useAxiosAuth = () => {
    const supabase = getSupabaseFrontendClient();
    const isRefreshing = useRef(false);
    const failedQueue = useRef<Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }>>([]);

    const processQueue = (error: Error | null, token: string | null = null) => {
        failedQueue.current.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue.current = [];
    };

    useEffect(() => {
        // Request interceptor - attach token to every request
        const requestIntercept = axiosAuth.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    console.log('session', session)
                    const accessToken = session?.access_token;

                    if (accessToken && config.headers) {
                        config.headers['Authorization'] = `Bearer ${accessToken}`;
                        console.log('✅ Auth token attached to request:', config.url);
                    } else {
                        console.warn('⚠️ No access token available for request:', config.url);
                    }
                } catch (error) {
                    console.error('❌ Error getting session in request interceptor:', error);
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handle 401 and refresh token
        const responseIntercept = axiosAuth.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

                // Handle 401 Unauthorized errors
                if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                    if (isRefreshing.current) {
                        // Wait for the current refresh to complete
                        return new Promise((resolve, reject) => {
                            failedQueue.current.push({ resolve, reject });
                        })
                            .then((token) => {
                                if (originalRequest.headers && token) {
                                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                                }
                                return axiosAuth(originalRequest);
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    isRefreshing.current = true;

                    try {
                        // Try to refresh the session
                        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

                        if (refreshError || !session) {
                            processQueue(refreshError as Error, null);
                            await supabase.auth.signOut();
                            window.location.href = '/auth/login';
                            return Promise.reject(refreshError);
                        }

                        const newToken = session.access_token;
                        processQueue(null, newToken);

                        // Retry the original request with new token
                        if (originalRequest.headers) {
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        }

                        isRefreshing.current = false;
                        return axiosAuth(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError as Error, null);
                        isRefreshing.current = false;
                        await supabase.auth.signOut();
                        window.location.href = '/auth/login';
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosAuth.interceptors.request.eject(requestIntercept);
            axiosAuth.interceptors.response.eject(responseIntercept);
        };
    }, [supabase.auth]);

    return axiosAuth;
};

export default useAxiosAuth;