import { GROUP_TABS, type GroupTab } from "@/app/(main)/groups/_config/tabs";

interface GroupTabsProps {
  value: GroupTab;
  onChange: (value: GroupTab) => void;
}

/**
 * @param value - the tab that is currently open
 * @param onChange - the function to call when the user picks a tab
 */

export const GroupTabs = ({ value, onChange }: GroupTabsProps) => {
  return (
    <div role="tablist" className="border-line flex gap-x-6 border-b">
      {GROUP_TABS.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={`-mb-px border-b-2 pb-2 text-sm transition-colors lg:text-base ${selected ? "border-accent-solid text-foreground font-semibold" : "text-subtle hover:text-foreground border-transparent"}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
