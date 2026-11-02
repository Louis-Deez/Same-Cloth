"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { CurrentProfile, loadProfile } from "@/lib/supabase/loadProfile";

/**
 * Keeps track of who is logged in for as long as the site is open (and across page refreshes, because Supabase saves
 * the session in the browser). Any page can read it with useAuth():
 * user    - the Supabase account (user.id is the ID used in every table), or null when nobody is logged in
 * profile - handle / display name / bio / first + last name, or null while loading or if it can't be read
 * loading - true until we know whether someone is logged in; wait for this before redirecting
 * signOut - logs out and clears the user
 *
 */

interface AuthContextValue {
  user: User | null;
  profile: CurrentProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<{ userId: string; profile: CurrentProfile | null } | null>(null);

  // who is logged in and keep it up to date (login, logout, expired session, other tabs)
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // logged in person changes, load their profile
  const userId = user?.id ?? null;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    loadProfile(userId).then((profile) => {
      if (!cancelled) setLoaded({ userId, profile });
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      // only shows a profile that belongs to the person who is logged in right now
      profile: user && loaded?.userId === user.id ? loaded.profile : null,
      loading,
      signOut: async () => {
        await createClient().auth.signOut();
        setUser(null);
      },
    }),
    [user, loaded, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
