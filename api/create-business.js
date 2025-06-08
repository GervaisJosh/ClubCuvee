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

// api/create-business.ts
var create_business_exports = {};
__export(create_business_exports, {
  default: () => create_business_default
});
module.exports = __toCommonJS(create_business_exports);

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

// api/create-business.ts
var create_business_default = withErrorHandler(async (req, res) => {
  if (req.method !== "POST") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const { token, sessionId, businessData: formData } = req.body;
  if (!token || !sessionId || !formData) {
    throw new APIError(400, "Token, session ID, and business data are required", "VALIDATION_ERROR");
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
  const { data: tempSetupData, error: tempError } = await supabaseAdmin.from("temp_business_setup").select("stripe_customer_id, stripe_subscription_id, pricing_tier").eq("invitation_token", token).single();
  if (tempError || !tempSetupData) {
    throw new APIError(400, "Business setup data not found. Please restart the process.", "VALIDATION_ERROR");
  }
  const { data: inviteDetails, error: inviteError } = await supabaseAdmin.from("business_invites").select("business_name, business_email, pricing_tier").eq("token", token).single();
  if (inviteError || !inviteDetails) {
    throw new APIError(400, "Invitation details not found", "VALIDATION_ERROR");
  }
  if (!formData.businessName?.trim()) {
    throw new APIError(400, "Business name is required", "VALIDATION_ERROR");
  }
  if (!formData.adminName?.trim()) {
    throw new APIError(400, "Admin name is required", "VALIDATION_ERROR");
  }
  if (!formData.adminEmail?.trim()) {
    throw new APIError(400, "Admin email is required", "VALIDATION_ERROR");
  }
  if (!formData.adminPassword) {
    throw new APIError(400, "Admin password is required", "VALIDATION_ERROR");
  }
  if (formData.adminPassword.length < 8) {
    throw new APIError(400, "Password must be at least 8 characters long", "VALIDATION_ERROR");
  }
  if (formData.adminPassword !== formData.confirmPassword) {
    throw new APIError(400, "Passwords do not match", "VALIDATION_ERROR");
  }
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.adminEmail,
    password: formData.adminPassword,
    user_metadata: {
      name: formData.adminName,
      role: "business_admin"
    },
    email_confirm: true
  });
  if (authError || !authData.user) {
    console.error("Error creating admin user:", authError);
    throw new APIError(500, "Failed to create admin user account", "DATABASE_ERROR");
  }
  const { data: pricingTierData, error: tierError } = await supabaseAdmin.from("business_pricing_tiers").select("id").eq("stripe_product_id", (await stripe.subscriptions.retrieve(tempSetupData.stripe_subscription_id)).items.data[0].price.product).single();
  let pricingTierId = null;
  if (!tierError && pricingTierData) {
    pricingTierId = pricingTierData.id;
  }
  const { data: newBusiness, error: businessError } = await supabaseAdmin.from("businesses").insert({
    name: formData.businessName,
    email: inviteDetails.business_email,
    owner_id: authData.user.id,
    stripe_customer_id: tempSetupData.stripe_customer_id,
    stripe_subscription_id: tempSetupData.stripe_subscription_id,
    subscription_status: "active",
    pricing_tier_id: pricingTierId,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  }).select().single();
  if (businessError || !newBusiness) {
    console.error("Error creating business:", businessError);
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw new APIError(500, "Failed to create business record", "DATABASE_ERROR");
  }
  const tierInserts = formData.tiers.map((tier) => ({
    business_id: newBusiness.id,
    name: tier.name,
    description: tier.description,
    price_cents: Math.round(2999 * (1 + tier.priceMarkupPercentage / 100)),
    // Base price $29.99 with markup
    interval: "month",
    is_ready: false,
    // Will be set to true when Stripe products are created
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  }));
  const { error: tiersError } = await supabaseAdmin.from("restaurant_membership_tiers").insert(tierInserts);
  if (tiersError) {
    console.error("Error creating membership tiers:", tiersError);
  }
  const { error: markUsedError } = await supabaseAdmin.rpc("mark_business_invitation_used", {
    p_token: token,
    p_business_id: newBusiness.id
  });
  if (markUsedError) {
    console.error("Error marking invitation as used:", markUsedError);
  }
  await supabaseAdmin.from("temp_business_setup").update({ setup_completed: true }).eq("invitation_token", token);
  res.status(200).json({
    success: true,
    data: {
      businessId: newBusiness.id,
      adminUserId: authData.user.id,
      business: newBusiness
    }
  });
});
//# sourceMappingURL=create-business.js.map
