// recommendation.ts
/**
 * This module aggregates user data (ratings and explicit preferences) and applies dynamic weighting:
 * - Country is computed dynamically: if a rating's country matches the user's preferred country, score 1.0; otherwise, 0.8.
 * - Regions and styles are compared using dynamic groupings:
 *   • Each region/style is assigned to a group.
 *   • Similarity weights between groups are defined in a matrix.
 * The resulting 7-dimensional vector (capturing country, region, style, vintage, alcohol, price, and rating)
 * is then converted into a detailed text summary and sent to OpenAI’s embedding API (via getOpenAIEmbedding)
 * to obtain a 768-dimensional user embedding. This embedding is compared (via cosine similarity)
 * against pre-computed wine embeddings (stored in Pinecone) to generate compatibility scores.
 */

// ------------------------
// Imports & External Dependencies
// ------------------------
import { getOpenAIEmbedding } from "./embeddingService.js";

// ------------------------
// Constants & Group Definitions
// ------------------------
export const FINAL_VECTOR_DIMENSIONS = 768; // Final embedding dimension for both users and wines
const CURRENT_YEAR = new Date().getFullYear();

// --- Define temporary region groups ---
const regionGroups: Record<string, string[]> = {
  CoolClimateElegant: ["Bourgogne", "Oregon", "Mosel", "Loire Valley", "Alsace", "Rheinhessen", "Nahe", "Franken", "Galicia", "Pfalz", "North Island", "South Island", "Victoria"],
  WarmClimateBold: ["California", "Rhone Valley", "South Australia", "Northern Portugal", "Catalunya", "Mendoza", "Washington", "Texas", "Bekaa Valley", "Baden", "New South Wales", "Lake County"],
  ModerateClassics: ["Bordeaux", "Central Italy", "Northern Italy", "Rioja", "Castilla y León", "Western Cape", "Madrid", "South West France"],
  Sparkling: ["Champagne", "Cava", "Veneto", "Tasmania"],
  MediterraneanRustic: ["Provence", "Languedoc-Roussillon", "Southern Italy", "Peloponnesos", "Crete", "Murcia", "Corsica"],
  Volcanic: ["Aegean Sea", "Islas Canarias"],
  DessertFortified: ["Andalucía", "Terras Madeirenses"],
  UniqueStyles: ["Jura", "Beaujolais"],
  GenericBlends: ["Vin de Pays", "Vin de France", "Weinland", "North"]
};

// --- Define similarity between region groups ---
const REGION_GROUP_SIMILARITY: Record<string, Record<string, number>> = {
  CoolClimateElegant: {
    CoolClimateElegant: 1.0,
    WarmClimateBold: 0.5,    // Opposing climates
    ModerateClassics: 0.6,   // Partial climate overlap
    Sparkling: 0.8,          // Shared cool climate + limestone
    MediterraneanRustic: 0.5,
    Volcanic: 0.6,           // Mineral-driven whites overlap
    DessertFortified: 0.5,
    UniqueStyles: 0.6,       // Beaujolais shares cool climate
    GenericBlends: 0.5
  },
  WarmClimateBold: {
    CoolClimateElegant: 0.5,
    WarmClimateBold: 1.0,
    ModerateClassics: 0.7,   // Bordeaux vs. Rhône structure
    Sparkling: 0.5,
    MediterraneanRustic: 0.7, // Shared warm climate
    Volcanic: 0.6,           // Some volcanic regions grow bold reds
    DessertFortified: 0.5,
    UniqueStyles: 0.5,
    GenericBlends: 0.5
  },
  ModerateClassics: {
    CoolClimateElegant: 0.6,
    WarmClimateBold: 0.7,
    ModerateClassics: 1.0,
    Sparkling: 0.5,
    MediterraneanRustic: 0.6, // Sangiovese vs. Grenache
    Volcanic: 0.5,
    DessertFortified: 0.5,
    UniqueStyles: 0.5,
    GenericBlends: 0.5
  },
  Sparkling: {
    CoolClimateElegant: 0.8,
    WarmClimateBold: 0.5,
    ModerateClassics: 0.5,
    Sparkling: 1.0,
    MediterraneanRustic: 0.5,
    Volcanic: 0.7,           // Volcanic soils in Tasmania/Champagne
    DessertFortified: 0.5,
    UniqueStyles: 0.6,       // Jura’s oxidative vs. Champagne
    GenericBlends: 0.5
  },
  MediterraneanRustic: {
    CoolClimateElegant: 0.5,
    WarmClimateBold: 0.7,
    ModerateClassics: 0.6,
    Sparkling: 0.5,
    MediterraneanRustic: 1.0,
    Volcanic: 0.5,
    DessertFortified: 0.5,
    UniqueStyles: 0.5,
    GenericBlends: 0.5
  },
  Volcanic: {
    CoolClimateElegant: 0.6,
    WarmClimateBold: 0.6,
    ModerateClassics: 0.5,
    Sparkling: 0.7,
    MediterraneanRustic: 0.5,
    Volcanic: 1.0,
    DessertFortified: 0.5,
    UniqueStyles: 0.5,
    GenericBlends: 0.5
  },
  DessertFortified: {
    CoolClimateElegant: 0.5,
    WarmClimateBold: 0.5,
    ModerateClassics: 0.5,
    Sparkling: 0.5,
    MediterraneanRustic: 0.5,
    Volcanic: 0.5,
    DessertFortified: 1.0,
    UniqueStyles: 0.5,
    GenericBlends: 0.5
  },
  UniqueStyles: {
    CoolClimateElegant: 0.6,
    WarmClimateBold: 0.5,
    ModerateClassics: 0.5,
    Sparkling: 0.6,
    MediterraneanRustic: 0.5,
    Volcanic: 0.5,
    DessertFortified: 0.5,
    UniqueStyles: 1.0,
    GenericBlends: 0.5
  },
  GenericBlends: {
    CoolClimateElegant: 0.5,
    WarmClimateBold: 0.5,
    ModerateClassics: 0.5,
    Sparkling: 0.5,
    MediterraneanRustic: 0.5,
    Volcanic: 0.5,
    DessertFortified: 0.5,
    UniqueStyles: 0.5,
    GenericBlends: 1.0
  }
};

// --- Define temporary style groups ---
const styleGroups: Record<string, string[]> = {
  // RED WINES (Groups 1-13)
  // ------------------------------------------------
  BurgundianPinotNoir: [
    "Burgundy Côte de Nuits Red",
    "Burgundy Côte de Beaune Red",
    "Burgundy Red",
    "Oregon Pinot Noir",
    "Californian Sonoma Coast Pinot Noir Red",
    "Californian Sta. Rita Hills Pinot Noir Red",
    "Californian Anderson Valley Pinot Noir Red",
    "Californian Russian River Valley Pinot Noir Red",
    "Californian Santa Lucia Highlands Pinot Noir Red",
    "Australian Pinot Noir"
  ],
  BoldCabernetBordeaux: [
    "Napa Valley Cabernet Sauvignon",
    "Bordeaux Saint-Julien",
    "Bordeaux Pauillac",
    "Bordeaux Margaux",
    "Bordeaux Saint-Émilion",
    "Bordeaux Saint-Estèphe",
    "Bordeaux Pessac-Léognan",
    "Napa Valley Bordeaux Blend",
    "Italian Bolgheri",
    "Californian Alexander Valley Cabernet Sauvignon Red",
    "Californian Sonoma County Cabernet Sauvignon Red",
    "Californian Paso Robles Cabernet Sauvignon Red",
    "Washington State Cabernet Sauvignon",
    "Californian Cabernet Sauvignon"
  ],
  RhoneSyrahGrenache: [
    "Northern Rhône Côte-Rotie",
    "Northern Rhône Saint-Joseph",
    "Northern Rhône Cornas",
    "Southern Rhône Châteauneuf-du-Pape Red",
    "Southern Rhône Red",
    "Californian Syrah",
    "South Australia Grenache Red",
    "South Australia Shiraz",
    "Australian Shiraz",
    "Australian McLaren Vale Shiraz",
    "Australian Adelaide Hills Shiraz",
    "French Méditerranée Red",
    "Californian Rhône Blend Red",
    "Spanish Grenache",
    "Spanish Priorat Red",
    "Spanish Rhône Blend Red"
  ],
  ItalianNebbioloSangiovese: [
    "Italian Barolo",
    "Italian Barbaresco",
    "Italian Brunello",
    "Italian Amarone",
    "Tuscan Red",
    "Italian Chianti Classico Red",
    "Italian Valpolicella Red",
    "Italian Montepulciano d'Abruzzo",
    "Italian Barbera",
    "Italian Red",
    "Italian Nebbiolo"
  ],
  NewWorldPowerReds: [
    "Argentinian Uco Valley Malbec Red",
    "Californian Zinfandel",
    "Australian Barossa Valley Shiraz",
    "Argentinian Mendoza Malbec Red",
    "Southwest France Malbec",
    "Californian Merlot",
    "Washington Red",
    "Texas Red",
    "Lebanese Red",
    "Greek Red",
    "Greek Nemea Red",
    "Spanish Ribera Del Duero Red",
    "Spanish Rioja Red",
    "Spanish Montsant Red",
    "Spanish Mencia",
    "Portuguese Douro Red"
  ],
  LoireCabernetFrancBlends: [
    "French Middle Loire Cabernet Franc Red",
    "Upper Loire Red",
    "French Provence Red",
    "Languedoc-Roussillon Red",
    "Central Italy Red",
    "Southern Italy Red",
    "French Comtés Rhodaniens Red",
    "French Corsica Red",
    "French Jura Red",
    "Burgundy Côte Chalonnaise Red"
  ],
  LightBodiedReds: [
    "Beaujolais Red",
    "French Red",
    "California Red",
    "Argentinian Red",
    "Argentinian Syrah",
    "Californian Red Blend",
    "Californian Pinot Noir",
    "Californian Grenache Red",
    "Spanish Red",
    "South African Red",
    "South African Cinsault Red",
    "Australian Cabernet - Shiraz",
    "Australian Merlot",
    "Australian Rhône Blend Red",
    "Bordeaux Haut-Médoc Red",
    "Bordeaux Libournais Red",
    "Bordeaux Red",
    "Bordeaux Pomerol"
  ],

  // WHITE WINES (Groups 8-15)
  // ------------------------------------------------
  BurgundianChardonnay: [
    "Burgundy Côte de Beaune White",
    "Burgundy White",
    "Burgundy Chablis",
    "Burgundy Mâconnais White",
    "Burgundy Côte Chalonnaise White",
    "Californian Chardonnay",
    "Californian Russian River Valley Chardonnay White",
    "Californian Sonoma Coast Chardonnay White",
    "Californian Santa Barbara County Chardonnay White",
    "New Zealand Chardonnay",
    "South African Chardonnay",
    "Oregon Chardonnay",
    "Californian White"
  ],
  AromaticWhites: [
    "German Riesling",
    "Alsace Riesling",
    "Austrian Riesling",
    "Loire Chenin Blanc",
    "South African Chenin Blanc",
    "Loire Touraine Sauvignon Blanc",
    "Upper Loire White",
    "Austrian Grüner Veltliner",
    "Northern Italy White",
    "Northern Rhône Condrieu",
    "Alsace Pinot Gris",
    "Oregon Viognier White",
    "Washington State Sauvignon Blanc",
    "Californian Sauvignon Blanc",
    "Spanish Albariño",
    "Greek" // Assumed to be Greek Assyrtiko based on prior grouping
  ],
  MediterraneanWhites: [
    "Languedoc-Roussillon White",
    "Southern Rhône White",
    "Central Italy White",
    "Spanish Rioja White",
    "French Méditerranée White",
    "Lebanese White",
    "South African White",
    "Portuguese Vinho Verde White",
    "Loire Muscadet",
    "French White",
    "Northern Italy Pinot Grigio",
    "Northern Italy Pinot Blanc"
  ],

  // ROSÉ WINES (Group 16)
  // ------------------------------------------------
  DryRose: [
    "Provence Rosé",
    "French Loire Rosé",
    "Californian Rosé",
    "Spanish Rosé",
    "French Rosé",
    "French Bordeaux Rosé",
    "Languedoc-Roussillon Rosé",
    "Mexican Rose",
    "Oregon Pinot Noir Rosé",
    "Australian Rosé",
    "Austrian Rosé"
  ],

  // SPARKLING WINES (Groups 17-18)
  // ------------------------------------------------
  TraditionalMethodSparkling: [
    "French Champagne",
    "Spanish Cava",
    "Italian Franciacorta Sparkling",
    "Californian Sparkling",
    "French Sparkling"
  ],
  ProseccoTankMethod: [
    "Italian Prosecco",
    "Spanish Sparkling",
    "Italian Sparkling"
  ],

  // DESSERT/FORTIFIED (Groups 19-20)
  // ------------------------------------------------
  FortifiedWines: [
    "Bordeaux Sauternes",
    "Spanish Fino Sherry Fortified",
    "Spanish Manzanilla Sherry Fortified",
    "Tawny Port",
    "White Port",
    "Colheita Port",
    "Single Quinta Vintage Port",
    "Portuguese Madeira",
    "French Languedoc-Roussillon Fortified",
    "French Alsace Gewürztraminer Dessert",
    "French Loire Chenin Blanc Dessert"
  ],
  UniqueStyles: [
    "Jura Vin Jaune",
    "Jura White",
    "Macvin",
    "South African Dessert"
  ],

  // MISCELLANEOUS (Group 21)
  // ------------------------------------------------
  GenericBlends: [
    "Californian White",
    "Spanish White",
    "South African White",
    "Port",
    "South African Pinot Noir"
  ]
};

const STYLE_GROUP_SIMILARITY: Record<string, Record<string, number>> = {
  // ======================== RED WINE GROUPS ========================
  BurgundianPinotNoir: {
    BurgundianPinotNoir: 1.0,
    BoldCabernetBordeaux: 0.6,    // Light vs. bold
    RhoneSyrahGrenache: 0.5,
    ItalianNebbioloSangiovese: 0.5,
    NewWorldPowerReds: 0.5,
    LoireCabernetFrancBlends: 0.7, // Light/medium reds
    LightBodiedReds: 0.8,
    // Whites, Rosé, Sparkling, Dessert, Generic: 0.5
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => ![
      "BurgundianPinotNoir", "BoldCabernetBordeaux", "RhoneSyrahGrenache", 
      "ItalianNebbioloSangiovese", "NewWorldPowerReds", "LoireCabernetFrancBlends", 
      "LightBodiedReds"
    ].includes(g)).map(g => [g, 0.5]))
  },
  BoldCabernetBordeaux: {
    BurgundianPinotNoir: 0.6,
    BoldCabernetBordeaux: 1.0,
    RhoneSyrahGrenache: 0.7,      // Shared full-bodied
    ItalianNebbioloSangiovese: 0.6, // Tannic structure
    NewWorldPowerReds: 0.8,       // Napa Cab vs. Aussie Shiraz
    LoireCabernetFrancBlends: 0.5,
    LightBodiedReds: 0.5,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => ![
      "BurgundianPinotNoir", "BoldCabernetBordeaux", "RhoneSyrahGrenache", 
      "ItalianNebbioloSangiovese", "NewWorldPowerReds", "LoireCabernetFrancBlends", 
      "LightBodiedReds"
    ].includes(g)).map(g => [g, 0.5]))
  },
  RhoneSyrahGrenache: {
    BurgundianPinotNoir: 0.5,
    BoldCabernetBordeaux: 0.7,
    RhoneSyrahGrenache: 1.0,
    ItalianNebbioloSangiovese: 0.6, // Earthy profiles
    NewWorldPowerReds: 0.7,        // Syrah/Shiraz overlap
    LoireCabernetFrancBlends: 0.5,
    LightBodiedReds: 0.5,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => ![
      "BurgundianPinotNoir", "BoldCabernetBordeaux", "RhoneSyrahGrenache", 
      "ItalianNebbioloSangiovese", "NewWorldPowerReds", "LoireCabernetFrancBlends", 
      "LightBodiedReds"
    ].includes(g)).map(g => [g, 0.5]))
  },
  ItalianNebbioloSangiovese: {
    BurgundianPinotNoir: 0.5,
    BoldCabernetBordeaux: 0.6,
    RhoneSyrahGrenache: 0.6,
    ItalianNebbioloSangiovese: 1.0,
    NewWorldPowerReds: 0.5,
    LoireCabernetFrancBlends: 0.5,
    LightBodiedReds: 0.5,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => ![
      "BurgundianPinotNoir", "BoldCabernetBordeaux", "RhoneSyrahGrenache", 
      "ItalianNebbioloSangiovese", "NewWorldPowerReds", "LoireCabernetFrancBlends", 
      "LightBodiedReds"
    ].includes(g)).map(g => [g, 0.5]))
  },
  NewWorldPowerReds: {
    BurgundianPinotNoir: 0.5,
    BoldCabernetBordeaux: 0.8,
    RhoneSyrahGrenache: 0.7,
    ItalianNebbioloSangiovese: 0.5,
    NewWorldPowerReds: 1.0,
    LoireCabernetFrancBlends: 0.5,
    LightBodiedReds: 0.5,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => ![
      "BurgundianPinotNoir", "BoldCabernetBordeaux", "RhoneSyrahGrenache", 
      "ItalianNebbioloSangiovese", "NewWorldPowerReds", "LoireCabernetFrancBlends", 
      "LightBodiedReds"
    ].includes(g)).map(g => [g, 0.5]))
  },
  LoireCabernetFrancBlends: {
    BurgundianPinotNoir: 0.7,
    BoldCabernetBordeaux: 0.5,
    RhoneSyrahGrenache: 0.5,
    ItalianNebbioloSangiovese: 0.5,
    NewWorldPowerReds: 0.5,
    LoireCabernetFrancBlends: 1.0,
    LightBodiedReds: 0.7,         // Light/medium body
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => ![
      "BurgundianPinotNoir", "BoldCabernetBordeaux", "RhoneSyrahGrenache", 
      "ItalianNebbioloSangiovese", "NewWorldPowerReds", "LoireCabernetFrancBlends", 
      "LightBodiedReds"
    ].includes(g)).map(g => [g, 0.5]))
  },
  LightBodiedReds: {
    BurgundianPinotNoir: 0.8,
    BoldCabernetBordeaux: 0.5,
    RhoneSyrahGrenache: 0.5,
    ItalianNebbioloSangiovese: 0.5,
    NewWorldPowerReds: 0.5,
    LoireCabernetFrancBlends: 0.7,
    LightBodiedReds: 1.0,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => ![
      "BurgundianPinotNoir", "BoldCabernetBordeaux", "RhoneSyrahGrenache", 
      "ItalianNebbioloSangiovese", "NewWorldPowerReds", "LoireCabernetFrancBlends", 
      "LightBodiedReds"
    ].includes(g)).map(g => [g, 0.5]))
  },

  // ======================== WHITE WINE GROUPS ========================
  BurgundianChardonnay: {
    BurgundianChardonnay: 1.0,
    AromaticWhites: 0.7,          // Oak vs. mineral
    MediterraneanWhites: 0.6,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => ![
      "BurgundianChardonnay", "AromaticWhites", "MediterraneanWhites"
    ].includes(g)).map(g => [g, 0.5]))
  },
  AromaticWhites: {
    BurgundianChardonnay: 0.7,
    AromaticWhites: 1.0,
    MediterraneanWhites: 0.8,     // Riesling vs. Albariño
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => ![
      "BurgundianChardonnay", "AromaticWhites", "MediterraneanWhites"
    ].includes(g)).map(g => [g, 0.5]))
  },
  MediterraneanWhites: {
    BurgundianChardonnay: 0.6,
    AromaticWhites: 0.8,
    MediterraneanWhites: 1.0,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => ![
      "BurgundianChardonnay", "AromaticWhites", "MediterraneanWhites"
    ].includes(g)).map(g => [g, 0.5]))
  },

  // ======================== ROSÉ ========================
  DryRose: {
    DryRose: 1.0,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => g !== "DryRose").map(g => [g, 0.5]))
  },

  // ======================== SPARKLING ========================
  TraditionalMethodSparkling: {
    TraditionalMethodSparkling: 1.0,
    ProseccoTankMethod: 0.6,      // Traditional vs. tank method
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => g !== "TraditionalMethodSparkling" && g !== "ProseccoTankMethod").map(g => [g, 0.5]))
  },
  ProseccoTankMethod: {
    TraditionalMethodSparkling: 0.6,
    ProseccoTankMethod: 1.0,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => g !== "TraditionalMethodSparkling" && g !== "ProseccoTankMethod").map(g => [g, 0.5]))
  },

  // ======================== DESSERT/FORTIFIED ========================
  FortifiedWines: {
    FortifiedWines: 1.0,
    UniqueStyles: 0.7,            // Sherry vs. oxidative styles
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => g !== "FortifiedWines" && g !== "UniqueStyles").map(g => [g, 0.5]))
  },
  UniqueStyles: {
    FortifiedWines: 0.7,
    UniqueStyles: 1.0,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => g !== "FortifiedWines" && g !== "UniqueStyles").map(g => [g, 0.5]))
  },

  // ======================== GENERIC ========================
  GenericBlends: {
    GenericBlends: 1.0,
    ...Object.fromEntries(Object.keys(styleGroups).filter(g => g !== "GenericBlends").map(g => [g, 0.5]))
  }
};

// ------------------------
// Normalization Functions for Continuous Variables
// ------------------------
const normalizeVintage = (vintage: number): number => {
  const MIN_YEAR = 1900;
  return (Math.min(vintage, CURRENT_YEAR) - MIN_YEAR) / (CURRENT_YEAR - MIN_YEAR);
};

const normalizeAlcohol = (alcohol: number): number => {
  const MIN = 8, MAX = 20;
  return (Math.min(Math.max(alcohol, MIN), MAX) - MIN) / (MAX - MIN);
};

const normalizePrice = (price: number): number => {
  const MIN = 10, MAX = 500;
  return (Math.min(Math.max(price, MIN), MAX) - MIN) / (MAX - MIN);
};

// ------------------------
// Type Definitions
// ------------------------
export interface WineRating {
  user_id: string;
  wine_id: string;
  country: string; // e.g., "Italy", "France"
  region: string;  // e.g., "Bordeaux", "Mosel", etc.
  style: string;   // e.g., "Italian Amarone", "Burgundy Côte de Nuits Red", etc.
  vintage: number;
  alcohol_perc: number;
  price: number;
  rating: number;
  review?: string;
}

export interface EnhancedUser {
  id: string;
  ratings: WineRating[];
  // Explicit preferences from the users table (stored with high specificity)
  primary_region?: string;  // e.g., "Bordeaux"
  primary_style?: string;   // e.g., "Italian Amarone"
  primary_country?: string; // e.g., "Italy"
}

export interface RecommendationEntry {
  user_id: string;
  wine_id: string;
  compatibility_score: number;
  updated_at: string;
}

// ------------------------
// Helper Functions for Dynamic Weight Calculation
// ------------------------

// Compute the country score dynamically: if a rating's country matches the user's primary country, assign 1.0; else, 0.8.
const computeCountryScore = (user: EnhancedUser): number => {
  if (!user.ratings.length) return 0.8;
  if (user.primary_country) {
    let total = 0;
    user.ratings.forEach(rating => {
      total += (rating.country === user.primary_country) ? 1.0 : 0.8;
    });
    return total / user.ratings.length;
  }
  return 0.8;
};

// Determine the group for a given region.
const getRegionGroup = (region: string): string => {
  for (const group in regionGroups) {
    if (regionGroups[group].includes(region)) {
      return group;
    }
  }
  return "Other";
};

// Determine the group for a given style.
const getStyleGroup = (style: string): string => {
  for (const group in styleGroups) {
    if (styleGroups[group].includes(style)) {
      return group;
    }
  }
  return "Other";
};

// Calculate the dynamic weight for region comparison using groups.
const getRegionWeight = (userRegion: string, wineRegion: string): number => {
  const userGroup = getRegionGroup(userRegion);
  const wineGroup = getRegionGroup(wineRegion);
  return REGION_GROUP_SIMILARITY[userGroup]?.[wineGroup] ?? 0.5;
};

// Calculate the dynamic weight for style comparison using groups.
const getStyleWeight = (userStyle: string, wineStyle: string): number => {
  const userGroup = getStyleGroup(userStyle);
  const wineGroup = getStyleGroup(wineStyle);
  return STYLE_GROUP_SIMILARITY[userGroup]?.[wineGroup] ?? 0.5;
};

// ------------------------
// Core 7-Dimensional User Vector Calculation
// ------------------------
export const computeUserVector7D = (user: EnhancedUser): number[] => {
  const regionCounts: Record<string, number> = {};
  const styleCounts: Record<string, number> = {};
  let totals = { vintage: 0, alcohol: 0, price: 0, rating: 0 };

  user.ratings.forEach(rating => {
    // Count occurrences for region and style (for determining dominant values)
    regionCounts[rating.region] = (regionCounts[rating.region] || 0) + 1;
    styleCounts[rating.style] = (styleCounts[rating.style] || 0) + 1;
    totals.vintage += rating.vintage;
    totals.alcohol += rating.alcohol_perc;
    totals.price += rating.price;
    totals.rating += rating.rating;
  });

  const count = user.ratings.length;
  const countryScore = computeCountryScore(user);

  // For region: if primary_region is provided, use its group; otherwise, use the dominant region.
  let regionScore: number;
  if (user.primary_region) {
    regionScore = getRegionWeight(user.primary_region, user.primary_region);
  } else {
    const dominantRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Other";
    regionScore = getRegionWeight(dominantRegion, dominantRegion);
  }

  // For style: if primary_style is provided, use its group; otherwise, use the dominant style.
  let styleScore: number;
  if (user.primary_style) {
    styleScore = getStyleWeight(user.primary_style, user.primary_style);
  } else {
    const dominantStyle = Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Other";
    styleScore = getStyleWeight(dominantStyle, dominantStyle);
  }

  const normalizedVintage = normalizeVintage(totals.vintage / count);
  const normalizedAlcohol = normalizeAlcohol(totals.alcohol / count);
  const normalizedPrice = normalizePrice(totals.price / count);
  const normalizedRating = (totals.rating / count) / 100; // Assuming ratings are on a 0-100 scale

  return [
    countryScore,    // Dynamic country score.
    regionScore,     // Group-based region score.
    styleScore,      // Group-based style score.
    normalizedVintage,
    normalizedAlcohol,
    normalizedPrice,
    normalizedRating
  ];
};

// ------------------------
// Upgrade 7D Vector to 768D via OpenAI's Embedding API
// ------------------------
export async function computeUserEmbedding(user: EnhancedUser): Promise<number[]> {
  const vector7D = computeUserVector7D(user);
  const summary = `User Preferences:
    Country score: ${vector7D[0].toFixed(2)},
    Region score: ${vector7D[1].toFixed(2)} (Primary: ${user.primary_region || 'N/A'}),
    Style score: ${vector7D[2].toFixed(2)} (Primary: ${user.primary_style || 'N/A'}),
    Average vintage: ${vector7D[3].toFixed(2)},
    Alcohol level: ${vector7D[4].toFixed(2)},
    Price: ${vector7D[5].toFixed(2)},
    Overall rating: ${vector7D[6].toFixed(2)}.`;

  const embedding = await getOpenAIEmbedding(summary);
  if (embedding.length !== FINAL_VECTOR_DIMENSIONS) {
    throw new Error(`Expected embedding length of ${FINAL_VECTOR_DIMENSIONS}, but got ${embedding.length}`);
  }
  return embedding;
}

// ------------------------
// Cosine Similarity & Compatibility Calculation
// ------------------------
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) {
    throw new Error("Vector length mismatch");
  }
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
  return (magA && magB) ? dotProduct / (magA * magB) : 0;
};

/**
 * calculateCompatibility:
 * Computes a compatibility score (0-100) between a user embedding and a wine embedding.
 */
export const calculateCompatibility = (
  userEmbedding: number[],
  wineEmbedding: number[],
  theoryWeight: number = 0.2,
  theoryVector?: number[]
): number => {
  let baseScore = cosineSimilarity(userEmbedding, wineEmbedding);
  if (theoryVector) {
    const theoryBonus = cosineSimilarity(userEmbedding, theoryVector);
    baseScore = (1 - theoryWeight) * baseScore + theoryWeight * theoryBonus;
  }
  return Math.min(Math.max(baseScore * 100, 0), 100);
};

/**
 * processUserRecommendations:
 * - Accepts an EnhancedUser and a Map of wine embeddings (from Pinecone).
 * - Computes the user's 768D embedding via OpenAI's API.
 * - Iterates over each wine to compute a compatibility score.
 * - Returns the top recommendations as an array of RecommendationEntry.
 */
export async function processUserRecommendations(
  user: EnhancedUser,
  wineVectorCache: Map<string, number[]>
): Promise<RecommendationEntry[]> {
  const userEmbedding = await computeUserEmbedding(user);
  const scores: Array<{ wine_id: string; score: number }> = [];

  wineVectorCache.forEach((wineEmbedding, wineId) => {
    if (wineEmbedding.length !== FINAL_VECTOR_DIMENSIONS) {
      console.error(`Dimension mismatch for wine ${wineId}`);
      return;
    }
    const score = calculateCompatibility(userEmbedding, wineEmbedding);
    scores.push({ wine_id: wineId, score });
  });

  const topRecommendations = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(rec => ({
      user_id: user.id,
      wine_id: rec.wine_id,
      compatibility_score: rec.score,
      updated_at: new Date().toISOString()
    }));

  return topRecommendations;
}
