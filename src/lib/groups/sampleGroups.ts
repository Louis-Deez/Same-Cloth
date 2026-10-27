import type { CommunityGroup } from "@/lib/groups/matching";

// fixed groups swap this for a supabase 
// each criteria list holds option_id values from the answers sql file
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
  {
    id: "dark-academia",
    name: "Dark Academia Society",
    description: "Tweed, libraries and moody autumn layers for the bookish.",
    criteriaOptionIds: [707, 202, 213, 306, 503],
  },
  {
    id: "thrift-upcycle",
    name: "Thrift and Upcycle Collective",
    description: "Secondhand finds, swaps and DIY fixes for clothes you already have.",
    criteriaOptionIds: [715, 411, 409, 705, 212],
  },
  {
    id: "streetwear-heads",
    name: "Streetwear Heads",
    description: "Drops, sneakers and layered city looks.",
    criteriaOptionIds: [704, 201, 302, 310, 608],
  },
  {
    id: "cottagecore-corner",
    name: "Cottagecore Corner",
    description: "Soft fabrics, gardens and slow countryside style.",
    criteriaOptionIds: [706, 207, 303, 504, 212],
  },
  {
    id: "punk-alt-underground",
    name: "Punk and Alt Underground",
    description: "Studs, band tees and clothes with something to say.",
    criteriaOptionIds: [702, 703, 201, 210, 607],
  },
  {
    id: "cultural-threads",
    name: "Cultural Threads",
    description: "Traditional dress, heritage fabrics and the stories behind them.",
    criteriaOptionIds: [717, 211, 407, 506],
  },
  {
    id: "minimal-wardrobe",
    name: "Minimal Wardrobe Lab",
    description: "Fewer pieces, better basics and quiet colors.",
    criteriaOptionIds: [309, 304, 501, 508],
  },
  {
    id: "utility-techwear",
    name: "Utility and Techwear",
    description: "Pockets, weatherproof layers and gear that works hard.",
    criteriaOptionIds: [709, 710, 304, 313, 402],
  },
  {
    id: "campus-preppy",
    name: "Campus and Preppy Style",
    description: "Polished layers for class, interviews and everything between.",
    criteriaOptionIds: [711, 708, 213, 311, 408],
  },
];
