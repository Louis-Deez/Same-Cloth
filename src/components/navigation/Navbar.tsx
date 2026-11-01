"use client"

import { NavButton } from "@/components/navigation/NavButton";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import {useRouter} from "next/navigation";

const Navbar = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
    router.push("/login");
  }

  return (
    <div className="w-full bg-white p-4 fixed border border-black/10 border-b-1 px-14 justify-between flex items-center">
      <h1 className="text-2xl text-accent">Same Cloth</h1>
      <div className="flex gap-x-12">
        <NavButton label="Home" destination="/"/>
        <NavButton label="Profile" destination="/profile"/>
        <NavButton label="Groups" destination="/groups"/>
        <NavButton label="Communities" destination="/communities"/>
        <NavButton label="Shop" destination="/shop"/>
      </div>
      <Button label="Sign Out" primary onClick={handleSignOut}/>
    </div>
  )
}

export default Navbar;