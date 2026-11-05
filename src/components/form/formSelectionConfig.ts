import { ClassNamesConfig, GroupBase } from "react-select";
import { SelectionData } from "@/models/form/selectionData";

/**
 *  @IMPORTANT - THIS IS VIBECODED BECAUSE I'M TOO LAZY TO LEARN THE STYLING OF THIS LIBRARY
 *
 *  @var formSelectionStyle - a configuration object for the react-select library. It defines the styles for form selection
 *  elements like SingleSelect and MultiSelect.
 *
 *  @NOTE - You do not have to touch this unless you want to change the styling of the form selection elements.
 */

export const formSelectionStyle = <IsMulti extends boolean>(): ClassNamesConfig<
  SelectionData,
  IsMulti,
  GroupBase<SelectionData>
> => ({
  control: ({ isFocused, selectProps }) => {
    const invalid = selectProps["aria-invalid"];
    return `h-10 rounded-lg border px-3 font-sans text-sm text-foreground ${
      invalid
        ? "border-danger bg-danger/10"
        : `bg-surface ${isFocused ? "border-accent ring-1 ring-accent" : "border-line"}`
    }`;
  },
  valueContainer: () => "gap-1 p-0",
  placeholder: () => "font-sans text-sm text-subtle",
  singleValue: () => "font-sans text-sm font-medium text-foreground",
  input: () => "rs-input font-sans text-sm text-foreground",
  multiValue: () => "bg-foreground/5 rounded-md pl-2 pr-1 py-0.5 items-center gap-1",
  multiValueLabel: () => "font-sans text-sm font-medium text-foreground",
  multiValueRemove: () => "text-subtle hover:text-foreground hover:bg-foreground/10 rounded",
  indicatorSeparator: () => "bg-line my-2",
  dropdownIndicator: ({ isFocused }) => `px-2 ${isFocused ? "text-accent-solid" : "text-subtle"}`,
  clearIndicator: () => "px-1 text-subtle hover:text-danger",
  menu: () => "mt-1 rounded-xl border border-line bg-surface shadow-lg overflow-hidden",
  menuList: () => "py-1 max-h-60",
  option: ({ isFocused, isSelected, isDisabled }) =>
    `px-3 py-2 font-sans text-sm cursor-pointer ${
      isDisabled
        ? "text-subtle/50 cursor-not-allowed"
        : isSelected
          ? "bg-foreground/5 text-foreground font-medium"
          : isFocused
            ? "bg-accent/10 text-foreground"
            : "text-muted"
    }`,
  noOptionsMessage: () => "px-3 py-2 font-sans text-sm text-subtle",
});
