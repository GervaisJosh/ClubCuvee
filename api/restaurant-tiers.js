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

// api/restaurant-tiers.ts
var restaurant_tiers_exports = {};
__export(restaurant_tiers_exports, {
  default: () => restaurant_tiers_default
});
module.exports = __toCommonJS(restaurant_tiers_exports);

// lib/supabaseAdmin.ts
var import_supabase_js = require("@supabase/supabase-js");
var supabaseAdmin = (0, import_supabase_js.createClient)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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
var setCommonHeaders = (res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};
var errorHandler = (error, req, res) => {
  console.error("API Error:", error);
  setCommonHeaders(res);
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      status: "error",
      error: {
        message: error.message,
        code: error.code
      }
    });
  }
  if (error instanceof import_zod.ZodError) {
    return res.status(400).json({
      status: "error",
      error: {
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.errors
      }
    });
  }
  if (error instanceof Error && error.name === "StripeError") {
    return res.status(400).json({
      status: "error",
      error: {
        message: error.message,
        code: "STRIPE_ERROR"
      }
    });
  }
  return res.status(500).json({
    status: "error",
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR"
    }
  });
};
var withErrorHandler = (handler) => {
  return async (req, res) => {
    try {
      setCommonHeaders(res);
      if (req.method === "OPTIONS") {
        return res.status(204).end();
      }
      await handler(req, res);
    } catch (error) {
      errorHandler(error, req, res);
    }
  };
};

// api/restaurant-tiers.ts
var restaurant_tiers_default = withErrorHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new APIError(401, "Unauthorized", "UNAUTHORIZED");
  }
  const business_id = req.query.business_id;
  if (!business_id) {
    throw new APIError(400, "business_id parameter is required", "MISSING_BUSINESS_ID");
  }
  switch (req.method) {
    case "GET":
      await handleGetTiers(business_id, res);
      break;
    case "DELETE":
      const tier_id = req.query.tier_id;
      if (!tier_id) {
        throw new APIError(400, "tier_id parameter is required for DELETE", "MISSING_TIER_ID");
      }
      await handleDeleteTier(business_id, tier_id, res);
      break;
    default:
      throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
});
async function handleGetTiers(business_id, res) {
  const { data: business, error: businessError } = await supabaseAdmin.from("businesses").select("id, name").eq("id", business_id).single();
  if (businessError || !business) {
    throw new APIError(404, "Business not found", "BUSINESS_NOT_FOUND");
  }
  const { data: tiers, error: tiersError } = await supabaseAdmin.from("restaurant_membership_tiers").select("*").eq("business_id", business_id).order("created_at", { ascending: true });
  if (tiersError) {
    throw new APIError(500, "Failed to fetch tiers", "FETCH_TIERS_FAILED");
  }
  res.status(200).json({
    success: true,
    data: {
      business,
      tiers: tiers || []
    }
  });
}
async function handleDeleteTier(business_id, tier_id, res) {
  const { data: tier, error: tierError } = await supabaseAdmin.from("restaurant_membership_tiers").select("*").eq("id", tier_id).eq("business_id", business_id).single();
  if (tierError || !tier) {
    throw new APIError(404, "Tier not found or access denied", "TIER_NOT_FOUND");
  }
  const { error: deleteError } = await supabaseAdmin.from("restaurant_membership_tiers").delete().eq("id", tier_id).eq("business_id", business_id);
  if (deleteError) {
    throw new APIError(500, "Failed to delete tier", "DELETE_TIER_FAILED");
  }
  res.status(200).json({
    success: true,
    data: {
      message: "Tier deleted successfully",
      deleted_tier_id: tier_id
    }
  });
}
//# sourceMappingURL=restaurant-tiers.js.map
