export interface GroupRecommendationItem {
  id: string;
  name: string;
  description: string;
  matchScore: number;
}

interface GroupRecommendationsProps {
  groups: readonly GroupRecommendationItem[];
}

export default function GroupRecommendations({ groups }: GroupRecommendationsProps) {
  return (
    <section className="w-full max-w-3xl space-y-4" aria-labelledby="group-recommendations-heading">
      <h2 id="group-recommendations-heading" className="text-xl font-semibold">
        Recommended groups
      </h2>

      {groups.length === 0 ? (
        <p className="text-sm text-zinc-600" role="status">
          No group recommendations yet.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {groups.map((group) => (
            <li key={group.id} className="rounded-md border border-black/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-medium">{group.name}</h3>
                <span className="shrink-0 text-sm text-zinc-600">{Math.round(group.matchScore * 100)}% match</span>
              </div>
              <p className="mt-2 text-sm text-zinc-600">{group.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
