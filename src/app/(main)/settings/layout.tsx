import { SETTINGS } from "./_config/sections";
import { SettingsSidebar } from "./_components/SettingsSidebar";
import React from "react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const nav = SETTINGS.map(({ category, sections }) => ({
    category,
    links: sections.map(({ label, slug, icon: Icon }) => ({
      label,
      href: `/settings/${slug}`,
      icon: <Icon/>
    })),
  }));

  return (
    <div className="flex gap-x-8">
      <SettingsSidebar nav={nav} />
      <main className="flex-1">{children}</main>
    </div>
  );
}