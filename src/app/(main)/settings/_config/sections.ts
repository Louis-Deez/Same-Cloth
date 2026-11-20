import React, { ComponentType } from "react";
import { EditProfile } from "../_components/EditProfile";

// import { Personalization } from "../_components/Personalization";
// import { AccountSettings } from "../_components/AccountSettings";

import {PersonIcon} from "@radix-ui/react-icons";

export interface SettingsSection {
  label: string;
  slug: string;
  icon: ComponentType;
  component: ComponentType;
}

export interface SettingsGroup {
  category: string;
  sections: SettingsSection[];
}

export const SETTINGS: SettingsGroup[] = [
  {
    category: "Profile",
    sections: [
      { label: "Edit Profile", slug: "profile", component: EditProfile, icon: PersonIcon },
      // { label: "Personalization", slug: "personalization", component: Personalization },
    ],
  },
  // {
  //   category: "Account",
  //   sections: [{ label: "Account", slug: "account", component: AccountSettings }],
  // },
];

export const findSection = (slug: string) =>
  SETTINGS.flatMap((g) => g.sections).find((s) => s.slug === slug);