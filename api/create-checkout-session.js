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

// api/create-checkout-session.ts
var create_checkout_session_exports = {};
__export(create_checkout_session_exports, {
  default: () => create_checkout_session_default
});
module.exports = __toCommonJS(create_checkout_session_exports);
var import_supabase_js = require("@supabase/supabase-js");
var import_stripe = __toESM(require("stripe"), 1);
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
var TIER_MAPPING = {
  "basic": "Neighborhood Cellar",
  "premium": "Neighborhood Cellar",
  // Map both basic and premium to Neighborhood Cellar for now
  "enterprise": "World Class Club"
};
var create_checkout_session_default = withErrorHandler(async (req, res) => {
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
  const stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
    typescript: true
  });
  if (req.method !== "POST") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const { token, membershipTier } = req.body;
  if (!token || !membershipTier) {
    throw new APIError(400, "Token and membershipTier are required", "VALIDATION_ERROR");
  }
  const { data: invite, error: inviteError } = await supabaseAdmin.from("restaurant_invitations").select("restaurant_name, email, tier, expires_at, status").eq("token", token).single();
  if (inviteError || !invite) {
    console.error("Error fetching invitation details:", inviteError);
    throw new APIError(404, "Invalid or expired invitation token", "NOT_FOUND");
  }
  if (new Date(invite.expires_at) < /* @__PURE__ */ new Date()) {
    throw new APIError(400, "This invitation has expired", "VALIDATION_ERROR");
  }
  if (invite.status === "completed") {
    throw new APIError(400, "This invitation has already been used", "VALIDATION_ERROR");
  }
  const dbTierName = TIER_MAPPING[membershipTier];
  if (!dbTierName) {
    throw new APIError(400, "Invalid membership tier", "VALIDATION_ERROR");
  }
  const { data: pricingTier, error: tierError } = await supabaseAdmin.from("business_pricing_tiers").select("id, name, stripe_price_id, monthly_price_cents, is_custom").eq("name", dbTierName).eq("is_active", true).single();
  if (tierError || !pricingTier) {
    console.error("Error fetching pricing tier:", tierError);
    throw new APIError(400, "Invalid pricing tier selected", "VALIDATION_ERROR");
  }
  if (pricingTier.is_custom || !pricingTier.stripe_price_id) {
    throw new APIError(400, "Custom tiers require manual setup - please contact support", "VALIDATION_ERROR");
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || "https://club-cuvee.com";
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: pricingTier.stripe_price_id,
          quantity: 1
        }
      ],
      customer_email: invite.email,
      metadata: {
        restaurantName: invite.restaurant_name,
        membershipTier: dbTierName,
        invitationToken: token,
        pricingTierId: pricingTier.id
      },
      success_url: `${baseUrl}/onboarding/${token}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/onboarding/${token}`
    });
    await supabaseAdmin.from("restaurant_invitations").update({
      status: "accepted",
      payment_session_id: session.id,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("token", token);
    res.status(200).json({
      url: session.url
    });
  } catch (err) {
    if (err instanceof import_stripe.default.errors.StripeError) {
      throw new APIError(400, err.message, "STRIPE_ERROR");
    }
    throw err;
  }
});
//# sourceMappingURL=create-checkout-session.js.map
