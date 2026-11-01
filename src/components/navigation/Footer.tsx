import {NAV} from "@/components/navigation/links";
import {NavButton} from "@/components/navigation/NavButton";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {

  return (
    <footer className="flex flex-col w-full border-t border-black/10 bg-white pt-8 md:pt-16 pb-8 px-4 sm:px-8 lg:px-14 gap-y-4 md:gap-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">

        <div className="flex flex-col gap-y-4 md:gap-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-semibold text-accent">Contacts</h2>
          <hr/>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-black/65">Got Questions? Get in Touch</h3>
          <div className="flex flex-col gap-y-2 text-black/50">
            <p className="text-base lg:text-xl">+1 818 999-9999</p>
            <p className="text-base lg:text-xl">contact@samecloth.com</p>
          </div>
          <div className="flex flex-col gap-y-4">
            <p className="text-base lg:text-xl">United States</p>
            <div className="flex gap-x-8 items-center">
              {/* TODO: Actually add links */}
              <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} loading="eager"/>
              <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} loading="eager"/>
              <Image src="/icons/twitter.svg" alt="Twitter" width={24} height={24} loading="eager"/>
              <Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} loading="eager"/>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-4 md:gap-y-8">
          <h2 className="text-7xl font-semibold text-accent">Directory</h2>
          <hr/>
          <div className="flex flex-wrap justify-between gap-y-8">
            {NAV.map(navItem => (
              <div key={navItem.category} className="flex flex-col gap-y-2">
                {navItem.category &&
                  <h3 className="text-lg font-medium text-black/65">
                    {navItem.category}
                  </h3>
                }
                {navItem.links.map(link => (
                  <NavButton
                    key={link.label}
                    className="text-xl text-black/75  transition-all"
                    destination={link.destination}
                    label={link.label}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>

      <hr/>

      <div className="flex flex-col sm:flex-row  justify-between w-full gap-y-2">
        <Link
          className="font-display font-normal text-accent"
          href="/"
        >
          Same Cloth
        </Link>
        <div className="flex gap-x-4 items-center text-black/50">
          <span>Terms of Use</span>
          <div className="h-3/5 border-l border-black/20"/>
          <span>Privacy Policy</span>
          <div className="h-3/5 border-l border-black/20"/>
          <span>Cookie Policy</span>
        </div>
        <span className="text-black/50">© 2026 Same Cloth Team</span>
      </div>
    </footer>
  )
}

export default Footer