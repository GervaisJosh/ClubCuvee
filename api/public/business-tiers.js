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

// api/public/business-tiers.ts
var business_tiers_exports = {};
__export(business_tiers_exports, {
  default: () => business_tiers_default
});
module.exports = __toCommonJS(business_tiers_exports);
var import_supabase_js = require("@supabase/supabase-js");
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
var business_tiers_default = withErrorHandler(async (req, res) => {
  const supabaseAdmin = (0, import_supabase_js.createClient)(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  if (req.method !== "GET") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const business_id = req.query.business_id;
  if (!business_id) {
    throw new APIError(400, "business_id parameter is required", "MISSING_BUSINESS_ID");
  }
  const { data: business, error: businessError } = await supabaseAdmin.from("businesses").select("id, name, email").eq("id", business_id).single();
  if (businessError || !business) {
    throw new APIError(404, "Business not found", "BUSINESS_NOT_FOUND");
  }
  const { data: tiers, error: tiersError } = await supabaseAdmin.from("membership_tiers").select("id, name, description, monthly_price_cents, stripe_product_id, stripe_price_id, is_active").eq("business_id", business_id).eq("is_active", true);
  if (tiersError) {
    console.error("Error fetching membership tiers:", tiersError);
    throw new APIError(500, "Failed to fetch membership tiers", "FETCH_TIERS_FAILED");
  }
  const formattedTiers = (tiers || []).map((tier) => ({
    ...tier,
    price_display: `$${(tier.monthly_price_cents / 100).toFixed(2)}`,
    price_per_interval: `$${(tier.monthly_price_cents / 100).toFixed(2)}/month`
  }));
  res.status(200).json({
    success: true,
    data: {
      business,
      tiers: formattedTiers,
      has_tiers: formattedTiers.length > 0
    }
  });
});
//# sourceMappingURL=business-tiers.js.map
