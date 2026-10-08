import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");

  // This is unreachable for now. This is redirected to (auth)/login/page.tsx
  return (
    <div className="bg-button-primary flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans">
      <main className="font-display flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 sm:items-start">
        Hello, World
      </main>
    </div>
  );
}
