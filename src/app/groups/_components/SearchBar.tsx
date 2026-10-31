import Image from "next/image";

interface SearchBarProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * @param id - The unique identifier for the input
 * @param value - The current text in the search bar
 * @param onChange - The function to call when the text changes, it receives the new text instead of the event
 */

export const SearchBar = ({ id, value, onChange }: SearchBarProps) => {
  return (
    <label
      htmlFor={id}
      className="hover:border-accent focus-within:border-accent flex h-14 w-full cursor-text items-center gap-x-4 rounded-xl border border-black/10 bg-white px-5 transition-colors"
    >
      <Image src="/icons/search.svg" alt="" width={22} height={22} className="size-5.5 shrink-0" loading="eager" />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for styles, interests, or keywords..."
        autoComplete="off"
        className="h-full min-w-0 flex-1 rounded-none border-0 p-0 text-base font-light text-black outline-none placeholder:text-black/50 lg:text-lg"
      />
    </label>
  );
};
