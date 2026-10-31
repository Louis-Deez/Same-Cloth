import { GROUP_FILTERS, type GroupFilter } from "@/app/groups/_config/filters";

interface GroupFiltersProps {
  value: GroupFilter;
  onChange: (value: GroupFilter) => void;
}

/**
 * @param value - The filter that is currently selected
 * @param onChange - The function to call when the user picks a filter
 *
 * The selected filter uses the same orange gradient as the primary Button (bg-button-primary).
 */

export const GroupFilters = ({ value, onChange }: GroupFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {GROUP_FILTERS.map((filter) => {
        const selected = filter.value === value;
        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(filter.value)}
            className={`rounded-full border px-6 py-2 text-sm transition-all lg:text-base ${selected ? "bg-button-primary border-transparent bg-origin-border text-white hover:brightness-90" : "border-black/5 bg-black/5 text-black/80 hover:bg-black/10"}`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};
