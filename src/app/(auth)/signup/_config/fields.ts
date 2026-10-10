import {SelectionData} from "@/models/form/selectionData";
import {getCountryDataList} from "countries-list";

export const GENDER: SelectionData[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Non-Binary", value: "non_binary" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
  { label: "Other", value: "other" },
]

export const COUNTRIES: SelectionData[] = getCountryDataList()
  .map((c) => ({ label: c.name, value: c.iso2}))
  .sort((a, b) => a.label.localeCompare(b.label));

export const INTERESTS: SelectionData[] = [
  { label: "Music", value: "music" },
  { label: "Books", value: "books" },
  { label: "Film and TV", value: "film_and_tv" },
  { label: "Art", value: "art" },
  { label: "Gaming", value: "gaming" },
  { label: "Sports", value: "sports" },
  { label: "Nature", value: "nature" },
  { label: "Travel", value: "travel" },
  { label: "History", value: "history" },
  { label: "Activism", value: "activism" },
  { label: "Cultural Traditions", value: "cultural_traditions" },
  { label: "Hobbies", value: "hobbies" },
  { label: "Academia", value: "academia" },
];

export const CLOTHING_AESTHETICS: SelectionData[] = [
  { label: "Comfortable", value: "comfortable" },
  { label: "Bold", value: "bold" },
  { label: "Soft", value: "soft" },
  { label: "Practical", value: "practical" },
  { label: "Creative", value: "creative" },
  { label: "Elegant", value: "elegant" },
  { label: "Expressive", value: "expressive" },
  { label: "Nostalgic", value: "nostalgic" },
  { label: "Minimal", value: "minimal" },
  { label: "Casual", value: "casual" },
  { label: "Professional", value: "professional" },
  { label: "Experimental", value: "experimental" },
  { label: "Protective", value: "protective" },
  { label: "Playful", value: "playful" },
];

export const CLOTHING_NEEDS: SelectionData[] = [
  { label: "Comfort", value: "comfort" },
  { label: "Mobility", value: "mobility" },
  { label: "Sensory Needs", value: "sensory_needs" },
  { label: "Hot-Weather", value: "hot_weather" },
  { label: "Cold-Weather", value: "cold_weather" },
  { label: "Modesty", value: "modesty" },
  { label: "Cultural/Religious Considerations", value: "cultural_religious" },
  { label: "Professional dress codes", value: "professional_dress_codes" },
  { label: "Budget", value: "budget" },
  { label: "Size/Fit", value: "size_fit" },
  { label: "Sustainable Clothing", value: "sustainable_clothing" },
  { label: "No Specific needs", value: "no_specific_needs" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
];

export const COLOR_PREFERENCES: SelectionData[] = [
  { label: "Neutrals", value: "neutrals" },
  { label: "Muted Colors", value: "muted_colors" },
  { label: "Earth Tones", value: "earth_tones" },
  { label: "Pastels", value: "pastels" },
  { label: "Bright Colors", value: "bright_colors" },
  { label: "Jewel Tones", value: "jewel_tones" },
  { label: "Neons", value: "neons" },
  { label: "Monochromes", value: "monochromes" },
  { label: "Metallics", value: "metallics" },
  { label: "No preference", value: "no_preference" },
];

export const FASHION_ERAS: SelectionData[] = [
  { label: "1920s", value: "1920s" },
  { label: "1930s", value: "1930s" },
  { label: "1940s", value: "1940s" },
  { label: "1950s", value: "1950s" },
  { label: "1960s", value: "1960s" },
  { label: "1970s", value: "1970s" },
  { label: "1980s", value: "1980s" },
  { label: "1990s", value: "1990s" },
  { label: "2000s", value: "2000s" },
  { label: "2010s", value: "2010s" },
  { label: "Contemporary", value: "contemporary" },
  { label: "No specific era", value: "no_specific_era" },
];

export const STYLE_SUBCULTURES: SelectionData[] = [
  { label: "Goth", value: "goth" },
  { label: "Punk", value: "punk" },
  { label: "Grunge", value: "grunge" },
  { label: "Streetwear", value: "streetwear" },
  { label: "Vintage", value: "vintage" },
  { label: "Cottagecore", value: "cottagecore" },
  { label: "Dark Academia", value: "dark_academia" },
  { label: "Light Academia", value: "light_academia" },
  { label: "Techwear", value: "techwear" },
  { label: "Workwear", value: "workwear" },
  { label: "Preppy", value: "preppy" },
  { label: "Retro", value: "retro" },
  { label: "Athletic", value: "athletic" },
  { label: "Avant-Garde", value: "avant_garde" },
  { label: "DIY/Upcycled", value: "diy_upcycled" },
  { label: "Alternative", value: "alternative" },
  { label: "Traditional dress", value: "traditional_dress" },
  { label: "I am still exploring", value: "still_exploring" },
];