export interface NavLink {
  label: string;
  destination: string;
}

export interface NavItem {
  category: string;
  links: NavLink[];
}

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
  }
];