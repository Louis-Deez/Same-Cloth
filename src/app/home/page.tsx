"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/Button";
import { rankGroups } from "@/lib/groups/matching";
import { sampleGroups } from "@/lib/groups/sampleGroups";
import { loadSelectedOptionIds } from "@/lib/supabase/loadSelectedOptionIds";
import GroupRecommendations from "./_components/GroupRecommendations";

/**
 * placeholder home page: it only exists so there is somewhere to land after logging in, and to show that the current
 * user is available. replace the contents when the real home page is built
 * anyone who is not logged in gets sent back to login
 */
export default function HomePage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // the picks that belong to the logged in user, kept with their id so a stale result is never shown
  const userId = user?.id ?? null;
  const [picks, setPicks] = useState<{ userId: string; optionIds: number[]; error?: string } | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    loadSelectedOptionIds(userId).then((result) => {
      if (!cancelled) setPicks({ userId, ...result });
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  // rank the groups once the picks for this user are loaded
  const currentPicks = picks?.userId === user.id ? picks : null;
  const recommendedGroups = currentPicks ? rankGroups(currentPicks.optionIds, sampleGroups) : [];

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-y-6 p-4">
      <h3>Welcome, {profile?.displayName ?? profile?.firstName ?? user.email}</h3>
      {profile?.handle && <p>@{profile.handle}</p>}
      {currentPicks?.error && <p>Could not load your group recommendations.</p>}
      <GroupRecommendations groups={recommendedGroups} />
      <div className="w-full max-w-xs">
        <Button primary label="Sign out" onClick={handleSignOut} />
      </div>
    </div>
  );
}
