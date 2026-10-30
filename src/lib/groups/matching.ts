// a community group and the answer options that fit it
export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  criteriaOptionIds: readonly number[];
}

export interface RankedCommunityGroup extends CommunityGroup {
  matchedOptionIds: number[];
  criteriaCount: number;
  matchScore: number;
}

// ranks groups by how much of their criteria the user picked
// score is matched criteria divided by all criteria
// ties go to the group with more matches then to the id so the order stays steady
export function rankGroups(
  selectedOptionIds: readonly number[],
  groups: readonly CommunityGroup[],
  limit = 5,
): RankedCommunityGroup[] {
  const selectedIds = new Set(selectedOptionIds);
  const resultLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;

  return groups
    .flatMap((group) => {
      const criteriaIds = new Set(group.criteriaOptionIds);
      const matchedOptionIds = [...criteriaIds].filter((id) => selectedIds.has(id));

      // groups with no criteria or no matches arn't suggested
      if (criteriaIds.size === 0 || matchedOptionIds.length === 0) return [];

      return [
        {
          ...group,
          matchedOptionIds,
          criteriaCount: criteriaIds.size,
          matchScore: matchedOptionIds.length / criteriaIds.size,
        },
      ];
    })
    .sort(
      (first, second) =>
        second.matchScore - first.matchScore ||
        second.matchedOptionIds.length - first.matchedOptionIds.length ||
        first.id.localeCompare(second.id),
    )
    .slice(0, resultLimit);
}
