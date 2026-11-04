"use client";

import Image from "next/image";
import { useState } from "react";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";

const PLACEHOLDERS = [
  "Search for styles, interests, or keywords...",
  "Find your community...",
  "Try searching vintage or streetwear...",
];

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
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
  return (
    <label
      htmlFor={id}
      className="hover:border-accent focus-within:border-accent flex h-11 w-full cursor-text items-center gap-x-3 rounded-xl border px-4 transition-colors"
    >
      <MagnifyingGlassIcon className="size-4.5 shrink-0" />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-full min-w-0 flex-1 rounded-none border-0 p-0 text-sm font-light outline-none"
      />
    </label>
  );
};
