"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SearchBar } from "@/app/(main)/groups/_components/SearchBar";
import { GroupCard } from "@/app/(main)/groups/_components/GroupCard";
import { GroupFilters } from "@/app/(main)/groups/_components/GroupFilters";
import { GroupTabs } from "@/app/(main)/groups/_components/GroupTabs";
import { CreateGroupForm } from "@/app/(main)/groups/_components/CreateGroupForm";
import { type GroupFilter } from "@/app/(main)/groups/_config/filters";
import { type GroupTab } from "@/app/(main)/groups/_config/tabs";
import { type GroupData, placeholderGroups } from "@/models/groups/data";
import { SelectionData } from "@/models/form/selectionData";
import { loadOptionValues } from "@/lib/supabase/loadOptionValues";
import { loadSelectedOptionIds } from "@/lib/supabase/loadSelectedOptionIds";
import { loadGroups } from "@/lib/supabase/loadGroups";
import { loadGroupOptions } from "@/lib/supabase/loadGroupOptions";

/**
 * groups page: currently contains tabs, a search bar, filters, group cards and the create group form
 */

export default function GroupsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<GroupFilter>("recommended");
  const [tab, setTab] = useState<GroupTab>("browse");
  // changing this number makes the groups load again, used after a group is created
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [loaded, setLoaded] = useState<{
    userId: string;
    optionValues: Map<number, string>;
    selectedOptionIds: number[];
    groups: GroupData[];
    groupOptions: SelectionData[];
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // the option names the hashtags are built from, and the options/interests this user selected at signup
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    Promise.all([loadOptionValues(), loadSelectedOptionIds(userId), loadGroups(), loadGroupOptions()]).then(
      ([options, picks, groupRows, groupOptionRows]) => {
        if (cancelled) return;
        if (options.error) console.error("Could not load the group hashtags:", options.error);
        if (picks.error) console.error("Could not load your picks:", picks.error);
        if (groupRows.error) console.error("Could not load the groups:", groupRows.error);
        if (groupOptionRows.error) console.error("Could not load the group interests:", groupOptionRows.error);
        setLoaded({
          userId,
          optionValues: options.optionValues,
          selectedOptionIds: picks.optionIds,
          groups: groupRows.groups,
          groupOptions: groupOptionRows.options,
        });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

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

  // real groups from supabase are used once there are any, until then the placeholder groups fill the page
  const sourceGroups = data && data.groups.length > 0 ? data.groups : placeholderGroups;
  const groups = sourceGroups.map((group) => ({
    ...group,
    matchedOptionIds: (group.criteriaOptionIds ?? []).filter((id) => selectedIds.has(id)),
  }));

  // recommended displays the groups with the most shared interests first; all displays unordered groups
  if (filter === "recommended") {
    groups.sort((first, second) => second.matchedOptionIds.length - first.matchedOptionIds.length);
  }

  // after a group is saved, show the loading cards again, load fresh groups and go back to browsing
  // all is picked so the newest group shows first
  const handleCreated = () => {
    setLoaded(null);
    setFilter("all");
    setReloadKey((key) => key + 1);
    setTab("browse");
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-y-6 p-4 lg:px-8">
      <GroupTabs value={tab} onChange={setTab} />
      {tab === "browse" ? (
        <>
          <SearchBar id="groups-search" value={search} onChange={setSearch} />
          <GroupFilters value={filter} onChange={setFilter} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {data
              ? groups.map((group) => <GroupCard key={group.id} group={group} optionValues={data.optionValues} />)
              : Array.from({ length: 4 }, (_, i) => <GroupCard key={i} />)}
          </div>
        </>
      ) : (
        <CreateGroupForm options={data?.groupOptions ?? []} onCreated={handleCreated} />
      )}
    </div>
  );
}
