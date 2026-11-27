"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { loadPublicProfile, type PublicProfile } from "@/lib/supabase/loadPublicProfile";
import { PostsGrid } from "@/app/(main)/profile/_components/PostsGrid";
import { useAuth } from "@/lib/auth/AuthProvider";
import { loadFollowStats, setFollowRelationship, type FollowStats } from "@/lib/supabase/follows";
import { Button } from "@/components/Button";

export function PublicProfileView({ handle }: { handle: string }) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [followStats, setFollowStats] = useState<FollowStats | null>(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;

    loadPublicProfile(handle)
      .then((result) => {
        if (!cancelled) setProfile(result);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Could not load this profile.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [handle]);

  useEffect(() => {
  if (!profile || !user || authLoading) return;

  let cancelled = false;

  loadFollowStats(profile.user_id, user.id)
    .then((stats) => {
      if (cancelled) return;
      setFollowStats(stats);
      setFollowError(null);
    })
    .catch((cause: unknown) => {
      if (!cancelled) {
        setFollowError(
          cause instanceof Error ? cause.message : "Could not load follow information.",
        );
      }
    });

  return () => {
    cancelled = true;
  };
}, [profile, user, authLoading]);

  const refreshFollowStats = async (profileUserId: string, currentUserId: string) => {
  setFollowLoading(true);
  setFollowError(null);

  try {
    setFollowStats(await loadFollowStats(profileUserId, currentUserId));
  } catch (cause) {
    setFollowError(cause instanceof Error ? cause.message : "Could not load follow information.");
  } finally {
    setFollowLoading(false);
  }
};

const handleToggleFollow = async () => {
  if (!profile || !user || !followStats || followLoading || profile.user_id === user.id) return;

  const shouldFollow = !followStats.isFollowing;
  setFollowLoading(true);
  setFollowError(null);

  try {
    await setFollowRelationship(profile.user_id, user.id, shouldFollow);
    await refreshFollowStats(profile.user_id, user.id);
  } catch (cause) {
    setFollowError(cause instanceof Error ? cause.message : "Could not update follow status.");
    setFollowLoading(false);
  }
};

  if (loading) return <p className="p-8">Loading profile...</p>;
  if (error) return <p className="p-8" role="alert">{error}</p>;
  if (!profile) return <p className="p-8">Profile not found.</p>;

  return (
    <div className="flex min-h-screen w-full">
      <aside className="bg-surface w-96 shrink-0 border-r">
        <Image
          src={profile.banner_url ?? "/images/placeholder_banner.jpeg"}
          width={1000}
          height={500}
          unoptimized
          alt={`${profile.handle ?? "User"} banner`}
          className="aspect-video w-full border-b object-cover"
        />
        <div className="flex flex-col gap-y-4 p-6 lg:px-8">
          <Image
            src={profile.profile_picture_url ?? "/images/default_pfp.svg"}
            width={128}
            height={128}
            unoptimized
            alt={`${profile.handle ?? "User"} profile`}
            className="bg-surface -mt-12 size-24 rounded-3xl border object-cover shadow-xl"
          />
          <div>
            <h3 className="text-accent">{profile.display_name}</h3>
            <h5>{profile.handle ? `@${profile.handle}` : "User"}</h5>
          </div>
          {profile.bio && <p>{profile.bio}</p>}

<div className="flex gap-x-4">
  <p>Followers: {followStats?.followerCount ?? "—"}</p>
  <p>Following: {followStats?.followingCount ?? "—"}</p>
</div>

{user && profile.user_id !== user.id && (
  <Button
    label={followStats?.isFollowing ? "Following" : "Follow"}
    primary={!followStats?.isFollowing}
    disabled={!followStats || followLoading}
    onClick={handleToggleFollow}
  />
)}

{followError && <p role="alert">{followError}</p>}
        </div>
      </aside>

      <div className="flex h-full w-full justify-center">
        <PostsGrid profileUserId={profile.user_id} publicView />
      </div>
    </div>
  );
}