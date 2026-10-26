"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SearchBar } from "@/app/groups/_components/SearchBar";

/**
 * groups page: currently contains a search bar
 */

export default function GroupsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [search, setSearch] = useState<string>("");

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

  return (
    <div className="bg-light-background flex min-h-screen w-full flex-col gap-y-6 p-4 sm:p-8 lg:px-14">
      <SearchBar id="groups-search" value={search} onChange={setSearch} />
    </div>
  );
}
