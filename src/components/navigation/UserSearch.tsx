"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { searchPublicProfiles } from "@/lib/supabase/searchPublicProfiles";
import { searchPublicGroups } from "@/lib/supabase/searchPublicGroups";

type GroupResults = Awaited<ReturnType<typeof searchPublicGroups>>;

type SearchResults = Awaited<ReturnType<typeof searchPublicProfiles>>;

export function UserSearch(){
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResults>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [groupResults, setGroupResults] = useState<GroupResults>([]);
    const handleQueryChange = (value: string) => {
    setQuery(value);
    setResults([]);
    setGroupResults([]);
    setError(null);
    setIsOpen(Boolean(value.trim()));
    setLoading(Boolean(value.trim()));
    };



    useEffect(() => {
        if(!query.trim()) {
            return;
        }

        let active = true;
        

        const timer = setTimeout(() => {
            Promise.all([searchPublicProfiles(query), searchPublicGroups(query)])
          .then(([profiles, groups]) => {
          if (!active) return;
          setResults(profiles);
          setGroupResults(groups);
          })
            .catch((cause: unknown) => {
                if(active) setError(cause instanceof Error ? cause.message : "Search failed.");
            })
            .finally(() => {
                if(active) setLoading(false);
            });
        }, 250);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [query]);

    return (
        <div className="relative w-64"
        >
        <label className="sr-only" htmlFor="user-search">Search users by handle</label>
        <input
        id="user-search"
        value={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Search handles..."
        autoComplete="off"
        className="w-full rounded-xl border px-3 py-2"
            />

           {isOpen && query.trim() && (
        <div 
        className="bg-surface absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-xl border shadow-lg"
        onMouseLeave={() => setIsOpen(false)}
        >
          {loading && <p className="p-3">Searching...</p>}
          {error && <p className="p-3" role="alert">{error}</p>}
            {!loading && !error && results.length === 0 && groupResults.length === 0 && (
        <p className="p-3">No users or groups found.</p>
        )}

        {!loading &&
        !error &&
        results.map((profile) =>
            profile.handle ? (
            <Link
                key={profile.user_id}
                href={`/profile/${encodeURIComponent(profile.handle)}`}
                className="block p-3 hover:bg-black/5"
                onClick={() => {
                setQuery("");
                setResults([]);
                setGroupResults([]);
                setIsOpen(false);
                }}
            >
                @{profile.handle}
                {profile.display_name && ` · ${profile.display_name}`}
            </Link>
            ) : null,
        )}

        {!loading &&
        !error &&
        groupResults.map((group) => (
            <Link
        key={group.group_id}
        href={`/groups?search=${encodeURIComponent(group.name)}`}
        className="block p-3 hover:bg-black/5"
        onClick={() => {
            setQuery("");
            setResults([]);
            setGroupResults([]);
            setIsOpen(false);
        }}
        >
        {group.name}
        </Link>
    ))}
            </div>
        )}
        </div>
        );
    }
