import type { CommunityGroup } from "@/lib/groups/matching";

export const sampleGroups: CommunityGroup[] = [
  {
    id: "art-expression",
    name: "Art & Expression",
    description: "A space for creative, expressive personal style.",
    criteriaOptionIds: [204, 305, 307],
  },
  {
    id: "vintage-history",
    name: "Vintage & History",
    description: "Explore vintage clothing and fashion from past eras.",
    criteriaOptionIds: [209, 308, 705, 606],
  },
  {
    id: "comfort-function",
    name: "Comfort & Function",
    description: "Practical outfits built around comfort and mobility.",
    criteriaOptionIds: [301, 304, 401, 402],
  },
];
