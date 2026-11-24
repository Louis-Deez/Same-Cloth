import { PublicProfileView } from "@/app/(main)/profile/_components/PublicProfileView";

export default async function PublicProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return <PublicProfileView key={handle} handle={handle} />;
}