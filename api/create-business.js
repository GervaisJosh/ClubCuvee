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
var import_supabase_js = require("@supabase/supabase-js");
var import_stripe = __toESM(require("stripe"), 1);
var import_zod = require("zod");
var import_crypto = require("crypto");
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
var create_business_default = withErrorHandler(async (req, res) => {
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
  const { token, sessionId, businessData } = req.body;
  if (!token || !sessionId || !businessData) {
    throw new APIError(400, "Token, sessionId, and businessData are required", "VALIDATION_ERROR");
  }
  try {
    const { data: invite, error: inviteError } = await supabaseAdmin.from("restaurant_invitations").select("id, restaurant_name, email, tier, expires_at, status, payment_session_id").eq("token", token).single();
    if (inviteError || !invite) {
      console.error("Error fetching invitation details:", inviteError);
      throw new APIError(404, "Invalid invitation token", "NOT_FOUND");
    }
    if (invite.status !== "paid") {
      throw new APIError(400, "Payment must be completed before creating business", "PAYMENT_REQUIRED");
    }
    if (invite.payment_session_id !== sessionId) {
      throw new APIError(400, "Session ID does not match invitation", "VALIDATION_ERROR");
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      throw new APIError(400, "Invalid or incomplete payment session", "PAYMENT_INCOMPLETE");
    }
    const subscriptionId = session.subscription;
    if (!subscriptionId) {
      throw new APIError(400, "No subscription found for this session", "NO_SUBSCRIPTION");
    }
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription.status !== "active") {
      throw new APIError(400, "Subscription is not active", "SUBSCRIPTION_INACTIVE");
    }
    const { data: pricingTier, error: tierError } = await supabaseAdmin.from("business_pricing_tiers").select("id, name, stripe_price_id").eq("stripe_price_id", subscription.items.data[0]?.price.id).eq("is_active", true).single();
    if (tierError || !pricingTier) {
      console.error("Error fetching pricing tier:", tierError);
      throw new APIError(400, "Unable to determine pricing tier", "TIER_NOT_FOUND");
    }
    if (!businessData.businessName?.trim() || !businessData.businessOwnerName?.trim() || !businessData.email?.trim() || !businessData.password?.trim()) {
      throw new APIError(400, "Missing required business information", "VALIDATION_ERROR");
    }
    if (businessData.password !== businessData.confirmPassword) {
      throw new APIError(400, "Passwords do not match", "VALIDATION_ERROR");
    }
    if (!businessData.customerTiers || businessData.customerTiers.length === 0) {
      throw new APIError(400, "At least one customer tier is required", "VALIDATION_ERROR");
    }
    for (const tier of businessData.customerTiers) {
      if (!tier.name?.trim() || !tier.description?.trim()) {
        throw new APIError(400, "Customer tier name and description are required", "VALIDATION_ERROR");
      }
      if (tier.monthlyPrice < 10 || tier.monthlyPrice > 999) {
        throw new APIError(400, "Customer tier price must be between $10 and $999", "VALIDATION_ERROR");
      }
      if (!tier.benefits || tier.benefits.filter((b) => b.trim()).length === 0) {
        throw new APIError(400, "Each customer tier must have at least one benefit", "VALIDATION_ERROR");
      }
    }
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: businessData.email,
      password: businessData.password,
      email_confirm: true,
      user_metadata: {
        full_name: businessData.businessOwnerName,
        is_admin: true,
        business_name: businessData.businessName
      }
    });
    if (authError || !authUser.user) {
      console.error("Error creating auth user:", authError);
      throw new APIError(400, authError?.message || "Failed to create user account", "AUTH_ERROR");
    }
    const businessId = (0, import_crypto.randomUUID)();
    const { data: business, error: businessError } = await supabaseAdmin.from("businesses").insert({
      id: businessId,
      name: businessData.businessName.trim(),
      owner_id: authUser.user.id,
      email: businessData.email.trim(),
      phone: businessData.phone?.trim() || null,
      website: businessData.website?.trim() || null,
      description: businessData.description?.trim() || null,
      business_address: businessData.businessAddress?.trim() || null,
      city: businessData.city?.trim() || null,
      state: businessData.state?.trim() || null,
      zip_code: businessData.zipCode?.trim() || null,
      pricing_tier_id: pricingTier.id,
      stripe_customer_id: subscription.customer,
      stripe_subscription_id: subscriptionId,
      status: "active",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).select("id").single();
    if (businessError) {
      console.error("Error creating business:", businessError);
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw new APIError(500, "Failed to create business record", "DATABASE_ERROR");
    }
    const { error: profileError } = await supabaseAdmin.from("users").insert({
      id: authUser.user.id,
      auth_id: authUser.user.id,
      email: businessData.email.trim(),
      full_name: businessData.businessOwnerName.trim(),
      business_id: businessId,
      is_admin: true,
      tier: "admin",
      has_seen_tutorial: false,
      has_completed_survey: false,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (profileError) {
      console.error("Error creating user profile:", profileError);
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      await supabaseAdmin.from("businesses").delete().eq("id", businessId);
      throw new APIError(500, "Failed to create user profile", "DATABASE_ERROR");
    }
    const tierInserts = businessData.customerTiers.map((tier, index) => ({
      id: (0, import_crypto.randomUUID)(),
      business_id: businessId,
      name: tier.name.trim(),
      description: tier.description.trim(),
      monthly_price_cents: Math.round(tier.monthlyPrice * 100),
      benefits: tier.benefits.filter((b) => b.trim()).map((b) => b.trim()),
      tier_order: index + 1,
      is_active: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }));
    const { error: tiersError } = await supabaseAdmin.from("customer_membership_tiers").insert(tierInserts);
    if (tiersError) {
      console.error("Error creating customer tiers:", tiersError);
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      await supabaseAdmin.from("businesses").delete().eq("id", businessId);
      throw new APIError(500, "Failed to create customer membership tiers", "DATABASE_ERROR");
    }
    await supabaseAdmin.from("restaurant_invitations").update({
      status: "completed",
      business_id: businessId,
      admin_user_id: authUser.user.id,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("token", token);
    res.status(200).json({
      success: true,
      data: {
        businessId,
        adminUserId: authUser.user.id,
        businessName: businessData.businessName,
        customerTiersCreated: tierInserts.length
      }
    });
  } catch (err) {
    if (err instanceof import_stripe.default.errors.StripeError) {
      throw new APIError(400, err.message, "STRIPE_ERROR");
    }
    throw err;
  }
});
//# sourceMappingURL=create-business.js.map
