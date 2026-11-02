import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      <div className="bg-light-background flex-1 pt-12">{children}</div>
      <Footer />
    </>
  );
}
