import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";

interface NavButtonProps {
  label: string;
  destination: string;
}

export const NavButton = ({label, destination}: NavButtonProps) => {
  return (
    <Link
      href={destination}
      className="text-md font-heading font-light hover:text-accent transition-all text-black/75"
    >
      { label }
    </Link>
  )
}