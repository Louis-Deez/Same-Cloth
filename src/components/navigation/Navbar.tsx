"use client";

import { NavButton } from "@/components/navigation/NavButton";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { NAV } from "@/components/navigation/links";
import { CollapsableCategory } from "@/components/navigation/CollapsableCategory";
import React from "react";
import Link from "next/link";

interface NavbarScreenProps {
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

/**
 * @param open - Whether the navbar is open or not
 * @param onClose - Function to call when the navbar is closed
 * @param onSignOut - Function to call when the user signs out
 *
 * @Component - The NavbarScreen replaces the standard navbar on mobile devices. Instead of taking up a fraction of the
 * page, it instead fills it up. This modal slides from top to bottom with a fade effect. It is opened by click a
 * hamburger menu icon and closed by clicking the "X" icon.
 *
 * @Important - You do not need to touch this component. It is used internally by the Navbar component.
 */

const NavbarScreen = ({ open, onClose, onSignOut }: NavbarScreenProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col gap-y-8 bg-white p-4 transition duration-300 ease-out sm:px-8 lg:px-14 ${
        open ? "translate-y-0 opacity-100 ease-out" : "pointer-events-none -translate-y-full opacity-0 ease-in"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <h2 className="font-display text-accent !text-base md:text-2xl">Same Cloth</h2>
        <button type="button" onClick={onClose} aria-label="Close menu">
          <Cross1Icon className="cursor-pointer" width={24} height={24} />
        </button>
      </div>

      <div className="flex flex-col gap-y-4">
        {NAV.map(item => (
          <CollapsableCategory
            navItem={item}
            key={item.category}
            onClose={onClose}
          />
        ))}
      </div>

      <Button label="Sign Out" primary onClick={onSignOut} className="mt-auto" />
    </div>
  );
};

/**
 *  @Component - The Navbar component is the main navigation bar at the top of the page. It contains the logo, the menu
 *  (filtered out "Menu" category), and a sign-out call-to-action button.
 *
 *  Most of the links don't work yet, so clicking on some of them will just take you to a 404 page.
 */

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="fixed z-40 flex w-full items-center justify-between border-b border-black/10 bg-white p-4 sm:px-8 lg:px-14">
      <Link
        className="font-display text-accent text-base! md:text-2xl! xl:text-3xl! cursor-pointer"
        href="/"
      >
        Same Cloth
      </Link>

      <div className="hidden gap-x-6 md:flex lg:gap-x-12">
        {NAV.find(item => item.category === "Menu")?.links.map(link =>
          <NavButton key={link.label} {...link} />
        )}
      </div>

      <Button className="hidden md:block" label="Sign Out" primary onClick={handleSignOut} />

      <button
        type="button"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <HamburgerMenuIcon width={24} height={24} />
      </button>

      <NavbarScreen open={open} onClose={() => setOpen(false)} onSignOut={handleSignOut} />
    </div>
  );
};

export default Navbar;