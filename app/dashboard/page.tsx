"use client"

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { getSupabaseFrontendClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react"
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const supabase = getSupabaseFrontendClient();
    const axiosAuth = useAxiosAuth();

    const getProtectedData = useCallback(async () => {
        const response = await axiosAuth.get('/protected');
        console.log('Protected data:', response.data);
    }, [axiosAuth]);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            console.log('Session:', data);

            if (!data.session) {
                router.push('/login');
            } else {
                setUser(data.session.user);
                getProtectedData();
            }
        }
        checkSession();
    }, [getProtectedData, router, supabase.auth]);

    const logout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    }
    return <div>

        <h1>Dashboard</h1>  
        <p>Welcome to the dashboard {user?.email}</p>
        <button onClick={logout}>Logout</button>
    </div>
}