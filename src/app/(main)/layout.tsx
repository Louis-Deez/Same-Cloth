import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { CreatePostProvider } from "@/app/(main)/profile/_components/CreatePostProvider";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <CreatePostProvider>
      <Navbar />
      <div className="bg-light-background flex-1 pt-12">{children}</div>
      <Footer />
    </CreatePostProvider>
  );
}