// @ts-nocheck

"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/create-restaurant-tier.ts
var create_restaurant_tier_exports = {};
__export(create_restaurant_tier_exports, {
  default: () => create_restaurant_tier_default
});
module.exports = __toCommonJS(create_restaurant_tier_exports);

// api/utils/stripe.ts
var import_stripe = __toESM(require("stripe"), 1);

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

// api/utils/stripe.ts
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required");
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is required");
}
var stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true
});

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

// api/create-restaurant-tier.ts
var create_restaurant_tier_default = withErrorHandler(async (req, res) => {
  if (req.method !== "POST") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new APIError(401, "Unauthorized", "UNAUTHORIZED");
  }
  const body = req.body;
  const { business_id, name, description, price_cents, interval = "month" } = body;
  if (!business_id || !name || !price_cents) {
    throw new APIError(400, "Missing required fields: business_id, name, price_cents", "MISSING_FIELDS");
  }
  if (price_cents < 100) {
    throw new APIError(400, "Minimum price is $1.00 (100 cents)", "INVALID_PRICE");
  }
  const { data: business, error: businessError } = await supabaseAdmin.from("businesses").select("id, name").eq("id", business_id).single();
  if (businessError || !business) {
    throw new APIError(404, "Business not found or access denied", "BUSINESS_NOT_FOUND");
  }
  const { data: tier, error: tierError } = await supabaseAdmin.from("restaurant_membership_tiers").insert({
    business_id,
    name,
    description,
    price_cents,
    interval,
    is_ready: false
    // Will be set to true after Stripe creation
  }).select().single();
  if (tierError || !tier) {
    throw new APIError(500, "Failed to create membership tier", "TIER_CREATION_FAILED");
  }
  try {
    const product = await stripe.products.create({
      name: `${business.name} - ${name}`,
      description: description || `Wine club membership tier for ${business.name}`,
      metadata: {
        business_id,
        tier_id: tier.id,
        created_by: "club_cuvee_platform"
      }
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: price_cents,
      currency: "usd",
      recurring: {
        interval
      },
      metadata: {
        business_id,
        tier_id: tier.id,
        created_by: "club_cuvee_platform"
      }
    });
    const { error: updateError } = await supabaseAdmin.from("restaurant_membership_tiers").update({
      stripe_product_id: product.id,
      stripe_price_id: price.id,
      is_ready: true
    }).eq("id", tier.id);
    if (updateError) {
      console.error("Failed to update tier with Stripe IDs:", updateError);
    }
    res.status(200).json({
      success: true,
      data: {
        tier_id: tier.id,
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        is_ready: !updateError
      }
    });
  } catch (stripeError) {
    console.error("Stripe creation failed:", stripeError);
    await supabaseAdmin.from("restaurant_membership_tiers").delete().eq("id", tier.id);
    throw new APIError(500, `Failed to create Stripe products: ${stripeError.message}`, "STRIPE_ERROR");
  }
});
//# sourceMappingURL=create-restaurant-tier.js.map
