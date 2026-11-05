"use client"

import {useTheme} from "next-themes";
import { SunIcon, MoonIcon, ComponentBooleanIcon } from "@radix-ui/react-icons";
import { ThemeModeType } from "@/components/misc/themeModeType";
import {useEffect, useState} from "react";


interface ThemeSelectorProps {
  selectedTheme: string;
}

/**
 * @param selectedTheme - The theme to select
 * @replaces ThemeToggle
 */

export const ThemeSelector = ({ selectedTheme }: ThemeSelectorProps) => {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="size-6" />;

  return (
    <button
      className="flex items-center w-full cursor-pointer px-4 py-2 hover:bg-black/10 justify-between"
      onClick={() => setTheme(selectedTheme)}
    >
      <div className="flex items-center gap-x-2">
        {selectedTheme === ThemeModeType.LIGHT && (
          <SunIcon width={20} height={20} className="opacity-75"/>
        )}
        {selectedTheme === ThemeModeType.DARK && (
          <MoonIcon width={20} height={20} className="opacity-75"/>
        )}
        {selectedTheme === ThemeModeType.SYSTEM && (
          <ComponentBooleanIcon width={20} height={20} className="opacity-75"/>
        )}
        <span className="w-full text-left">{selectedTheme[0].toUpperCase() + selectedTheme.slice(1)}</span>
      </div>
      <div className={theme === selectedTheme ? "w-1.5 h-1.5 rounded-full bg-subtle/50" : ""}/>
    </button>
  )
}