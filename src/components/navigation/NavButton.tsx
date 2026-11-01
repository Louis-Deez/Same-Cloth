import Link from "next/link";

/**
 * @param label - The text to display on the button
 * @param destination - The destination of the button
 * @param screen - The naming is a little misleading, but it's a boolean that determines whether the button is for the
 *                 screen or the navbar.
 */

interface NavButtonProps {
  label: string;
  destination: string;
  screen?: boolean;
}

export const NavButton = ({label, destination, screen = false}: NavButtonProps) => {
  return (
    <Link
      href={destination}
      className={`${screen ? `text-xl !font-medium` : `text-sm lg:text-base`} font-heading font-light hover:text-accent transition-all text-black/75`}
    >
      { label }
    </Link>
  )
}