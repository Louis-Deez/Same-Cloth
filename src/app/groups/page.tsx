"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SearchBar } from "@/app/groups/_components/SearchBar";
import { GroupCard } from "@/app/groups/_components/GroupCard";
import { GroupFilters } from "@/app/groups/_components/GroupFilters";
import { type GroupFilter } from "@/app/groups/_config/filters";
import { placeholderGroups } from "@/models/groups/data";
import { loadOptionValues } from "@/lib/supabase/loadOptionValues";
import { loadSelectedOptionIds } from "@/lib/supabase/loadSelectedOptionIds";

/**
 * groups page: currently contains a search bar, filters and group cards
 */

export default function GroupsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<GroupFilter>("recommended");
  const [loaded, setLoaded] = useState<{
    userId: string;
    optionValues: Map<number, string>;
    selectedOptionIds: number[];
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // the option names the hashtags are built from, and the options/interests this user selected at signup
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    Promise.all([loadOptionValues(), loadSelectedOptionIds(userId)]).then(([options, picks]) => {
      if (cancelled) return;
      if (options.error) console.error("Could not load the group hashtags:", options.error);
      if (picks.error) console.error("Could not load your picks:", picks.error);
      setLoaded({ userId, optionValues: options.optionValues, selectedOptionIds: picks.optionIds });
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

  // only show group cards once the user's interests & the option names are pulled from Supabase
  // so the cards appear already sorted instead of jumping into a new order
  const data = loaded?.userId === user.id ? loaded : null;

  // for each group, find which of its interests the user also picked at signup
  // these are counted for the "You share X interests" badge and the recommended order
  const selectedIds = new Set(data?.selectedOptionIds);
  const groups = placeholderGroups.map((group) => ({
    ...group,
    matchedOptionIds: (group.criteriaOptionIds ?? []).filter((id) => selectedIds.has(id)),
  }));

  // recommended displays the groups with the most shared interests first; all displays unordered groups
  if (filter === "recommended") {
    groups.sort((first, second) => second.matchedOptionIds.length - first.matchedOptionIds.length);
  }

  return (
    <div className="bg-light-background flex min-h-screen w-full flex-col gap-y-6 p-4 sm:p-8 lg:px-14">
      <SearchBar id="groups-search" value={search} onChange={setSearch} />
      <GroupFilters value={filter} onChange={setFilter} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {data
          ? groups.map((group) => <GroupCard key={group.id} group={group} optionValues={data.optionValues} />)
          : Array.from({ length: 4 }, (_, i) => <GroupCard key={i} />)}
      </div>
    </div>
  );
}
