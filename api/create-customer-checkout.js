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

// api/create-customer-checkout.ts
var create_customer_checkout_exports = {};
__export(create_customer_checkout_exports, {
  default: () => create_customer_checkout_default
});
module.exports = __toCommonJS(create_customer_checkout_exports);
var import_supabase_js = require("@supabase/supabase-js");
var import_stripe = __toESM(require("stripe"), 1);
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
var create_customer_checkout_default = withErrorHandler(async (req, res) => {
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
  const body = req.body;
  const { business_id, tier_id, customer_email, customer_name } = body;
  if (!business_id || !tier_id || !customer_email) {
    throw new APIError(400, "Missing required fields: business_id, tier_id, customer_email", "MISSING_FIELDS");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer_email)) {
    throw new APIError(400, "Invalid email format", "INVALID_EMAIL");
  }
  const { data: business, error: businessError } = await supabaseAdmin.from("businesses").select("id, name").eq("id", business_id).single();
  if (businessError || !business) {
    throw new APIError(404, "Business not found", "BUSINESS_NOT_FOUND");
  }
  const { data: tier, error: tierError } = await supabaseAdmin.from("membership_tiers").select("*").eq("id", tier_id).eq("business_id", business_id).eq("is_active", true).single();
  if (tierError || !tier) {
    throw new APIError(404, "Membership tier not found or not ready for signup", "TIER_NOT_FOUND");
  }
  if (!tier.stripe_price_id) {
    throw new APIError(400, "Membership tier is not configured for online signup", "TIER_NOT_CONFIGURED");
  }
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email,
    line_items: [
      {
        price: tier.stripe_price_id,
        quantity: 1
      }
    ],
    success_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/join/${business_id}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/join/${business_id}?canceled=true`,
    metadata: {
      business_id,
      tier_id,
      customer_email,
      customer_name: customer_name || "",
      type: "customer_membership"
    },
    subscription_data: {
      metadata: {
        business_id,
        tier_id,
        customer_email,
        customer_name: customer_name || ""
      }
    },
    allow_promotion_codes: true,
    // Allow customers to use discount codes
    billing_address_collection: "auto"
  });
  res.status(200).json({
    success: true,
    data: {
      sessionId: session.id,
      checkoutUrl: session.url,
      business,
      tier: {
        id: tier.id,
        name: tier.name,
        description: tier.description,
        price_cents: tier.monthly_price_cents,
        interval: "month"
      }
    }
  });
});
//# sourceMappingURL=create-customer-checkout.js.map
