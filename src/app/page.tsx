import {redirect} from "next/navigation";

export default function Home() {
  redirect("/login");

  // This is unreachable for now. This is redirected to (auth)/login/page.tsx
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans bg-button-primary">
      <main className="font-display flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        Hello, World
      </main>
    </div>
  );
}
