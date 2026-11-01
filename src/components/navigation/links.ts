export interface NavLink {
  label: string;
  destination: string;
}

export interface NavItem {
  category: string;
  links: NavLink[];
}

/**
 * @interface NavLink - Represents a link in the navigation.
 * @interface NavItem - Represents a category of links in the navigation.
 * @param label - The text to display on the link.
 * @param destination - The destination of the link. This can be anything from a page to a URL.
 * @param category - The category of the links. This is your main separator between what type of links you have.
 * @param links - An array of NavLink objects, each representing a link in the navigation.
 *
 * @Description - This is a list of all the links in the navigation. Whenever you want to add a new link, make sure
 * it is in the right category. Everything else is handled automatically, you don't need to touch anything else.
 */

export const NAV: NavItem[] = [
  {
    category: "Menu",
    links: [
      { label: "Home", destination: "/" },
      { label: "Profile", destination: "/profile" },
      { label: "Groups", destination: "/groups" },
      { label: "Shop", destination: "/shop" },
      { label: "Communities", destination: "/communities" },
    ],
  },
  {
    category: "Support",
    links: [
      { label: "FAQ", destination: "/faq" },
      { label: "Feedback", destination: "/feedback" },
      { label: "Help Center", destination: "/help-center" },
    ],
  },
  {
    category: "Account",
    links: [
      { label: "Manage Your Account", destination: "/manage-account" },
      { label: "Settings", destination: "/settings" },
      { label: "Logout", destination: "/logout" },
    ],
  },
  {
    category: "Sell",
    links: [
      { label: "Sell on Same Cloth", destination: "/sell" },
      { label: "Sell on Same Cloth Guide", destination: "/sell-guide" },
      { label: "Sell on Same Cloth FAQ", destination: "/sell-faq" },
    ],
  },
];
