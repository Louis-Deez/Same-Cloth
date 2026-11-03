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

			if (criteriaIds.size === 0 || matchedOptionIds.length === 0) {
				return [];
			}

			return [{
				...group,
				matchedOptionIds,
				criteriaCount: criteriaIds.size,
				matchScore: matchedOptionIds.length / criteriaIds.size,
			}];
		})
		.sort(
			(first, second) =>
				second.matchScore - first.matchScore ||
				second.matchedOptionIds.length - first.matchedOptionIds.length ||
				first.id.localeCompare(second.id),
		)
		.slice(0, resultLimit);
}
