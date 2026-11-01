import Navbar from "@/components/navigation/Navbar";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      <div className="bg-light-background flex-1 pt-16">{children}</div>
    </>
  );
}