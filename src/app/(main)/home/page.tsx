"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/Button";

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

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-y-6 p-4">
      <h3>Welcome, {profile?.displayName ?? profile?.firstName ?? user.email}</h3>
      {profile?.handle && <p>@{profile.handle}</p>}
      <div className="w-full max-w-xs">
        <Button primary label="Sign out" onClick={handleSignOut} />
      </div>
    </div>
  );
}
