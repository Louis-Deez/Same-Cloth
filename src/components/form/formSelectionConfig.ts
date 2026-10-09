import {ClassNamesConfig, GroupBase} from "react-select";
import {SelectionData} from "@/models/form/selectionData";

/**
 *  @IMPORTANT - THIS IS VIBECODED BECAUSE I'M TOO LAZY TO LEARN THE STYLING OF THIS LIBRARY
 *
 *  @var formSelectionStyle - a configuration object for the react-select library. It defines the styles for form selection
 *  elements like SingleSelect and MultiSelect.
 *
 *  @NOTE - You do not have to touch this unless you want to change the styling of the form selection elements.
 */

export const formSelectionStyle = <IsMulti extends boolean>():
  ClassNamesConfig<SelectionData, IsMulti, GroupBase<SelectionData>> => ({
  control: ({ isFocused, selectProps }) => {
    const invalid = selectProps["aria-invalid"];
    return `h-10 rounded-lg border px-3 font-sans text-sm text-black/65 ${
      invalid
        ? "border-red-500 bg-red-50"
        : `bg-white ${isFocused ? "border-accent ring-1 ring-accent" : "border-black/10"}`
    }`;
  },
  valueContainer: () => "gap-1 p-0",
  placeholder: () => "font-sans text-sm text-black/40",
  singleValue: () => "font-sans text-sm font-medium text-black/65",
  input: () => "rs-input font-sans text-sm text-black/65",
  multiValue: () => "bg-black/5 rounded-md pl-2 pr-1 py-0.5 items-center gap-1",
  multiValueLabel: () => "font-sans text-sm font-medium text-black/65",
  multiValueRemove: () => "text-black/40 hover:text-black/70 hover:bg-black/5 rounded",
  indicatorSeparator: () => "bg-black/10 my-2",
  dropdownIndicator: ({ isFocused }) => `px-2 ${isFocused ? "text-accent-solid" : "text-black/40"}`,
  clearIndicator: () => "px-1 text-black/40 hover:text-danger",
  menu: () => "mt-1 rounded-xl border border-black/10 bg-white shadow-lg overflow-hidden",
  menuList: () => "py-1 max-h-60",
  option: ({ isFocused, isSelected, isDisabled }) =>
    `px-3 py-2 font-sans text-sm cursor-pointer ${
      isDisabled
        ? "text-black/25 cursor-not-allowed"
        : isSelected
          ? "bg-black/5 text-black/70 font-medium"
          : isFocused
            ? "bg-accent/10 text-black/80"
            : "text-black/65"
    }`,
  noOptionsMessage: () => "px-3 py-2 font-sans text-sm text-black/40",
});