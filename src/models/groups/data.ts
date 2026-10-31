export interface GroupData {
  id: string;
  name: string;
  criteriaOptionIds?: readonly number[];
  memberCount?: number;
  matchedOptionIds?: readonly number[];
}

// placeholder groups until they are loaded from Supabase
export const placeholderGroups: GroupData[] = [
  {
    id: "art-expression",
    name: "Art & Expression",
    criteriaOptionIds: [204, 305, 307],
    memberCount: 42,
  },
  {
    id: "vintage-history",
    name: "Vintage & History",
    criteriaOptionIds: [209, 308, 705, 606],
    memberCount: 58,
  },
  {
    id: "comfort-function",
    name: "Comfort & Function",
    criteriaOptionIds: [301, 304, 401, 402],
    memberCount: 37,
  },
  {
    id: "dark-academia",
    name: "Dark Academia Society",
    criteriaOptionIds: [707, 202, 213, 306, 503],
    memberCount: 71,
  },
  {
    id: "thrift-upcycle",
    name: "Thrift and Upcycle Collective",
    criteriaOptionIds: [715, 411, 409, 705, 212],
    memberCount: 29,
  },
  {
    id: "streetwear-heads",
    name: "Streetwear Heads",
    criteriaOptionIds: [704, 201, 302, 310, 608],
    memberCount: 64,
  },
  {
    id: "cottagecore-corner",
    name: "Cottagecore Corner",
    criteriaOptionIds: [706, 207, 303, 504, 212],
    memberCount: 53,
  },
  {
    id: "punk-alt-underground",
    name: "Punk and Alt Underground",
    criteriaOptionIds: [702, 703, 201, 210, 607],
    memberCount: 46,
  },
  {
    id: "cultural-threads",
    name: "Cultural Threads",
    criteriaOptionIds: [717, 211, 407, 506],
    memberCount: 31,
  },
  {
    id: "minimal-wardrobe",
    name: "Minimal Wardrobe Lab",
    criteriaOptionIds: [309, 304, 501, 508],
    memberCount: 68,
  },
  {
    id: "utility-techwear",
    name: "Utility and Techwear",
    criteriaOptionIds: [709, 710, 304, 313, 402],
    memberCount: 40,
  },
  {
    id: "campus-preppy",
    name: "Campus and Preppy Style",
    criteriaOptionIds: [711, 708, 213, 311, 408],
    memberCount: 55,
  },
];
