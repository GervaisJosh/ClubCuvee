// @ts-nocheck

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/wines.ts
var wines_exports = {};
__export(wines_exports, {
  addWine: () => addWine,
  addWineRating: () => addWineRating,
  deleteWine: () => deleteWine,
  getWineRatings: () => getWineRatings,
  getWines: () => getWines,
  updateWine: () => updateWine
});
module.exports = __toCommonJS(wines_exports);

// src/supabase.ts
var import_supabase_js = require("@supabase/supabase-js");
var import_meta = {};
var SUPABASE_URL = import_meta.env.VITE_SUPABASE_URL;
var SUPABASE_ANON_KEY = import_meta.env.VITE_SUPABASE_ANON_KEY;
var createSupabaseClient = () => {
  if (typeof window === "undefined") {
    return (0, import_supabase_js.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  if (window.__SUPABASE_INSTANCE) {
    return window.__SUPABASE_INSTANCE;
  }
  const instance = (0, import_supabase_js.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.__SUPABASE_INSTANCE = instance;
  return instance;
};
var supabase = createSupabaseClient();

// api/wines.ts
var getWines = async () => {
  try {
    const { data, error } = await supabase.from("wine_inventory").select("*");
    if (error) {
      console.error("Error fetching wines:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error in getWines:", err);
    return [];
  }
};
var addWine = async (wine) => {
  try {
    const { data, error } = await supabase.from("wine_inventory").insert(wine).single();
    if (error) {
      console.error("Error adding wine:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Unexpected error in addWine:", err);
    return null;
  }
};
var updateWine = async (id, wine) => {
  try {
    const { data, error } = await supabase.from("wine_inventory").update(wine).eq("id", id).single();
    if (error) {
      console.error("Error updating wine:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Unexpected error in updateWine:", err);
    return null;
  }
};
var deleteWine = async (id) => {
  try {
    const { error } = await supabase.from("wine_inventory").delete().eq("id", id);
    if (error) {
      console.error("Error deleting wine:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Unexpected error in deleteWine:", err);
    return false;
  }
};
var addWineRating = async (rating) => {
  try {
    const { data, error } = await supabase.from("wine_ratings_reviews").insert(rating).single();
    if (error) {
      console.error("Error adding wine rating:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Unexpected error in addWineRating:", err);
    return null;
  }
};
var getWineRatings = async (wineId) => {
  try {
    const { data, error } = await supabase.from("wine_ratings_reviews").select("*").eq("wine_id", wineId);
    if (error) {
      console.error("Error fetching wine ratings:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error in getWineRatings:", err);
    return [];
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addWine,
  addWineRating,
  deleteWine,
  getWineRatings,
  getWines,
  updateWine
});
//# sourceMappingURL=wines.js.map
