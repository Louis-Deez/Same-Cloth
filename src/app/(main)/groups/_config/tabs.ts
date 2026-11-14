import { SelectionData } from "@/models/form/selectionData";

export type GroupTab = "browse" | "create";

/**
 * the tabs shown at the top of the groups page. to add a tab, add it here and show its content in the groups page
 */
export const GROUP_TABS: (SelectionData & { value: GroupTab })[] = [
  { label: "Browse groups", value: "browse" },
  { label: "Create a group", value: "create" },
];
