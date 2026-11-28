"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, ComponentBooleanIcon } from "@radix-ui/react-icons";
import { ThemeModeType } from "@/components/misc/theme/themeModeType";
import { useSyncExternalStore } from "react";

interface ThemeSelectorProps {
  selectedTheme: string;
}

/**
 * @param selectedTheme - The theme to select
 * @replaces ThemeToggle
 */

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const ThemeSelector = ({ selectedTheme }: ThemeSelectorProps) => {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  if (!mounted) return <div className="size-6" />;

  return (
    <button
      className="flex w-full cursor-pointer items-center justify-between px-4 py-2 hover:bg-black/10"
      onClick={() => setTheme(selectedTheme)}
    >
      <div className="flex items-center gap-x-2">
        {selectedTheme === ThemeModeType.LIGHT && <SunIcon width={20} height={20} className="opacity-75" />}
        {selectedTheme === ThemeModeType.DARK && <MoonIcon width={20} height={20} className="opacity-75" />}
        {selectedTheme === ThemeModeType.SYSTEM && (
          <ComponentBooleanIcon width={20} height={20} className="opacity-75" />
        )}
        <span className="w-full text-left">{selectedTheme[0].toUpperCase() + selectedTheme.slice(1)}</span>
      </div>
      <div className={theme === selectedTheme ? "bg-subtle/50 h-1.5 w-1.5 rounded-full" : ""} />
    </button>
  );
};
