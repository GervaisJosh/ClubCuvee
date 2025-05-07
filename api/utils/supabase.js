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

// api/utils/supabase.ts
var supabase_exports = {};
__export(supabase_exports, {
  createRestaurant: () => createRestaurant,
  getRestaurantInvite: () => getRestaurantInvite,
  supabase: () => supabase,
  updateRestaurantInvite: () => updateRestaurantInvite
});
module.exports = __toCommonJS(supabase_exports);
var import_supabase_js = require("@supabase/supabase-js");

// api/utils/error-handler.ts
var import_zod = require("zod");
var APIError = class extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "APIError";
  }
};

// api/utils/supabase.ts
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is required");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
}
var supabase = (0, import_supabase_js.createClient)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
var getRestaurantInvite = async (token) => {
  const { data, error } = await supabase.from("restaurant_invites").select("*").eq("token", token).single();
  if (error) {
    throw new APIError(500, "Failed to fetch restaurant invite", "DATABASE_ERROR");
  }
  if (!data) {
    throw new APIError(404, "Invite not found", "INVITE_NOT_FOUND");
  }
  return data;
};
var createRestaurant = async (data) => {
  const { data: restaurant, error } = await supabase.from("restaurants").insert([data]).select().single();
  if (error) {
    throw new APIError(500, "Failed to create restaurant", "DATABASE_ERROR");
  }
  return restaurant;
};
var updateRestaurantInvite = async (token, data) => {
  const { error } = await supabase.from("restaurant_invites").update(data).eq("token", token);
  if (error) {
    throw new APIError(500, "Failed to update restaurant invite", "DATABASE_ERROR");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createRestaurant,
  getRestaurantInvite,
  supabase,
  updateRestaurantInvite
});
//# sourceMappingURL=supabase.js.map
