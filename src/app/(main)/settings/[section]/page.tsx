import { notFound } from "next/navigation";
import { findSection } from "../_config/sections";

export default async function SettingsSectionPage({params,}: { params: Promise<{ section: string }>; }) {
  const { section } = await params;
  const match = findSection(section);
  if (!match) notFound();

  const Section = match.component;
  return <Section />;
}