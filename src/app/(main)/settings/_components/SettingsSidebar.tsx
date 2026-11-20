"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarGroup {
  category: string;
  links: { label: string; href: string }[];
}

export const SettingsSidebar = ({ nav }: { nav: SidebarGroup[] }) => {
  const pathname = usePathname();

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-y-6">
      {nav.map(({ category, links }) => (
        <div key={category} className="flex flex-col gap-y-1">
          <span className="text-subtle text-sm">{category}</span>
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "text-foreground" : "text-muted hover:text-foreground"}
            >
              {label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
};