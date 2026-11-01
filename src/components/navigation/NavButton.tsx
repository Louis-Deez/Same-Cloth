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
  onClick?: () => void;
  screen?: boolean;
  className?: string;
}

export const NavButton = ({ label, destination, onClick, screen = false, className }: NavButtonProps) => {
  return (
    <Link
      href={destination}
      className={
        `${screen ? `text-xl !font-medium` : `text-sm lg:text-base`} font-heading hover:text-accent font-light text-black/75 transition-all` +
        className
      }
      onClick={onClick}
    >
      {label}
    </Link>
  );
};
