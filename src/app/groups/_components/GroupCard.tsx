import { GroupData } from "@/models/groups/data";

interface GroupCardProps {
  group?: GroupData;
  optionValues?: ReadonlyMap<number, string>;
}

/**
 * @param group - The group to display. Leave it out to show the loading version of the card
 * @param optionValues - option_id -> option_value from answer_option, used to turn criteriaOptionIds into hashtags
 *
 * @NOTE - The loading version keeps the same layout, but every text field becomes a gray bubble (bubble) so nothing
 * shifts when the real data arrives. A ranked group from rankGroups() can be passed in as the group.
 */

export const GroupCard = ({ group, optionValues }: GroupCardProps) => {
  const loading = !group;
  const bubble = loading ? "select-none scale-y-75 rounded bg-black/5 text-transparent" : "";
  const sharedCount = group?.matchedOptionIds?.length ?? 0;
  const tags = loading
    ? Array.from({ length: 4 }, (_, i) => ({ id: i, label: "loading" }))
    : (group.criteriaOptionIds ?? []).flatMap((id) => {
        const value = optionValues?.get(id);
        return value ? [{ id, label: value.replaceAll("_", "") }] : [];
      });

  return (
    <div
      aria-busy={loading}
      className={`flex flex-col gap-y-4 rounded-2xl border border-black/5 bg-white p-4 sm:p-5 ${loading ? "animate-pulse" : ""}`}
    >
      <div className="flex flex-col gap-y-1">
        <div className="flex items-start justify-between gap-x-4">
          <h3 className={`min-w-0 text-2xl lg:text-3xl ${bubble}`}>{group?.name ?? "Loading group"}</h3>
          {(loading || group.memberCount !== undefined) && (
            <p className={`mt-1 shrink-0 text-sm ${bubble}`}>{group?.memberCount ?? "00"} members</p>
          )}
        </div>
        <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-4 gap-y-2">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {tags.map((tag) => (
                <span key={tag.id} className={`text-sm ${loading ? bubble : "text-black/50"}`}>
                  #{tag.label}
                </span>
              ))}
            </div>
          )}
          {sharedCount > 0 && (
            <span className="bg-accent/10 text-accent-solid shrink-0 rounded-full px-3 py-1 text-xs font-medium sm:ml-auto">
              You share {sharedCount} {sharedCount === 1 ? "interest" : "interests"} with this community
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-square rounded bg-black/5" />
        ))}
      </div>
    </div>
  );
};
