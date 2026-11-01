/**
 * contains varying thumbnail layouts for the group cards
 * "bento box style thumnbnails"
 */

export const COLLAGE_LAYOUTS: string[][] = [
  // one tall image, a tall + short pair, and a short + tall pair
  [
    "col-start-1 col-span-5 row-start-1 row-span-12",
    "col-start-6 col-span-4 row-start-1 row-span-8",
    "col-start-6 col-span-4 row-start-9 row-span-4",
    "col-start-10 col-span-3 row-start-1 row-span-5",
    "col-start-10 col-span-3 row-start-6 row-span-7",
  ],
  // two tall images, a wide image on top and two small images under it
  [
    "col-start-1 col-span-5 row-start-1 row-span-12",
    "col-start-6 col-span-3 row-start-1 row-span-12",
    "col-start-9 col-span-4 row-start-1 row-span-6",
    "col-start-9 col-span-2 row-start-7 row-span-6",
    "col-start-11 col-span-2 row-start-7 row-span-6",
  ],
  // two tall images, a wide image on top and a small + wide pair under it
  [
    "col-start-1 col-span-4 row-start-1 row-span-12",
    "col-start-5 col-span-3 row-start-1 row-span-12",
    "col-start-8 col-span-5 row-start-1 row-span-6",
    "col-start-8 col-span-2 row-start-7 row-span-6",
    "col-start-10 col-span-3 row-start-7 row-span-6",
  ],
  // one tall image and four images in a 2 x 2 block
  [
    "col-start-1 col-span-4 row-start-1 row-span-12",
    "col-start-5 col-span-4 row-start-1 row-span-6",
    "col-start-9 col-span-4 row-start-1 row-span-6",
    "col-start-5 col-span-4 row-start-7 row-span-6",
    "col-start-9 col-span-4 row-start-7 row-span-6",
  ],
];
