import { NAV } from "@/components/navigation/links";
import { NavButton } from "@/components/navigation/NavButton";
import Image from "next/image";
import Link from "next/link";

/**
 * @Component - The footer component that is displayed at the bottom of the page. It contains a grid of links and
 * contact information.
 *
 * This component is in its very basic state. Most of the links are not functional, but it is a good starting point. We
 * also do not have a "Terms of Service" or "Privacy Policy" page yet, so they're readonly for now.
 *
 * @Important - The copyright thing is not final, and I don't even know if we need it lol. I thought adding it was cool.
 */

const Footer = () => {
  return (
    <footer className="bg-surface flex w-full flex-col gap-y-4 border-t px-4 pt-8 pb-8 sm:px-8 md:gap-y-8 lg:px-8">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-y-4 md:gap-y-8">
          <h2 className="text-accent text-4xl font-semibold sm:text-5xl lg:text-7xl">Contacts</h2>
          <hr />
          <h3 className="text-xl font-medium opacity-80! sm:text-2xl lg:text-3xl">Got Questions? Get in Touch</h3>
          <div className="flex flex-col gap-y-2 text-black/50">
            <p className="text-base lg:text-xl">+1 818 999-9999</p>
            <p className="text-base lg:text-xl">contact@samecloth.com</p>
          </div>
          <div className="flex flex-col gap-y-4">
            <p className="text-base lg:text-xl">United States</p>
            <div className="flex items-center gap-x-8">
              {/* TODO: Actually add links */}
              <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} loading="eager" />
              <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} loading="eager" />
              <Image src="/icons/twitter.svg" alt="Twitter" width={24} height={24} loading="eager" />
              <Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} loading="eager" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-4 md:gap-y-8">
          <h2 className="text-accent text-7xl font-semibold">Directory</h2>
          <hr />
          <div className="flex flex-wrap justify-between gap-y-8">
            {NAV.map((navItem) => (
              <div key={navItem.category} className="flex flex-col gap-y-2">
                {navItem.category && <h3 className="text-lg font-medium opacity-80!">{navItem.category}</h3>}
                {navItem.links.map((link) => (
                  <NavButton
                    key={link.label}
                    className="text-xl transition-all"
                    destination={link.destination}
                    label={link.label}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr />

      <div className="flex w-full flex-col justify-between gap-y-2 sm:flex-row">
        <Link className="font-display text-accent font-normal" href="/">
          Same Cloth
        </Link>
        <div className="flex items-center gap-x-4 text-black/50">
          <span>Terms of Use</span>
          <div className="h-3/5 border-l border-black/20" />
          <span>Privacy Policy</span>
          <div className="h-3/5 border-l border-black/20" />
          <span>Cookie Policy</span>
        </div>
        <span>© 2026 Same Cloth Team</span>
      </div>
    </footer>
  );
};

export default Footer;
