import { SelectionData } from "@/models/form/selectionData";

export type GroupFilter = "recommended" | "all";

/**
 * @IMPORTANT - This file contains all the filters shown above the group cards. If you want to add a new filter, make
 * sure you add it here and handle it in groups/page.tsx.
 */
export const GROUP_FILTERS: (SelectionData & { value: GroupFilter })[] = [
  { label: "Recommended for you", value: "recommended" },
  { label: "All communities", value: "all" },
];
