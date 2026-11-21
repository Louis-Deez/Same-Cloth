"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SidebarGroup {
  category: string;
  links: { label: string; href: string; icon: ReactNode }[];
}

export const SettingsSidebar = ({ nav }: { nav: SidebarGroup[] }) => {
  const pathname = usePathname();

  return (
    <nav className="bg-surface flex h-screen w-96 shrink-0 flex-col gap-y-6 border-r pt-10 lg:px-8">
      <h2 className="text-accent">Settings</h2>

      {nav.map(({ category, links }) => (
        <div key={category} className="flex flex-col gap-y-1">
          <span className="text-subtle text-sm">{category}</span>
          {links.map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-x-2 rounded-md px-4 py-2 transition ease-in-out ${pathname === href ? "text-accent bg-light-background" : "text-muted hover:text-foreground"} `}
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
};
