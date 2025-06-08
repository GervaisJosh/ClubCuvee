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

// api/create-business-checkout.ts
var create_business_checkout_exports = {};
__export(create_business_checkout_exports, {
  default: () => create_business_checkout_default
});
module.exports = __toCommonJS(create_business_checkout_exports);

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

// api/create-business-checkout.ts
var create_business_checkout_default = withErrorHandler(async (req, res) => {
  if (req.method !== "POST") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const { token, tier_id } = req.body;
  if (!token) {
    throw new APIError(400, "Token is required", "VALIDATION_ERROR");
  }
  if (!tier_id) {
    throw new APIError(400, "Pricing tier ID is required", "VALIDATION_ERROR");
  }
  const { data: tokenValidation, error: validationError } = await supabaseAdmin.rpc("validate_business_invitation_token", {
    p_token: token
  });
  if (validationError || !tokenValidation || tokenValidation.length === 0) {
    throw new APIError(400, "Invalid or expired business invitation token", "VALIDATION_ERROR");
  }
  const tokenData = tokenValidation[0];
  if (!tokenData.is_valid) {
    throw new APIError(400, "Business invitation token is not valid", "VALIDATION_ERROR");
  }
  const { data: tierData, error: tierError } = await supabaseAdmin.rpc("get_pricing_tier_details", {
    p_tier_id: tier_id
  });
  if (tierError || !tierData || tierData.length === 0) {
    throw new APIError(400, "Invalid pricing tier selected", "VALIDATION_ERROR");
  }
  const selectedTier = tierData[0];
  if (selectedTier.tier_key === "custom") {
    throw new APIError(400, "Custom tier requires manual setup. Please contact us directly.", "VALIDATION_ERROR");
  }
  if (!selectedTier.stripe_price_id) {
    throw new APIError(400, "Pricing tier is not configured for online checkout", "VALIDATION_ERROR");
  }
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: selectedTier.stripe_price_id,
        quantity: 1
      }
    ],
    success_url: `${baseUrl}/onboard/${token}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/onboard/${token}?canceled=true`,
    metadata: {
      business_invitation_token: token,
      pricing_tier_id: tier_id,
      pricing_tier_key: selectedTier.tier_key,
      type: "business_onboarding"
    },
    subscription_data: {
      metadata: {
        business_invitation_token: token,
        pricing_tier_id: tier_id,
        pricing_tier_key: selectedTier.tier_key
      }
    }
  });
  res.status(200).json({
    success: true,
    data: {
      sessionId: session.id,
      checkoutUrl: session.url,
      tokenData,
      selectedTier
    }
  });
});
//# sourceMappingURL=create-business-checkout.js.map
