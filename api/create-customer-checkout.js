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
  const { token, business_id, tier_id, customer_email, customer_name, customerData } = body;
  let business;
  let tier;
  let finalCustomerEmail;
  let finalCustomerName;
  let customerMetadata = {};
  if (token && customerData) {
    const { data: invitation, error: invitationError } = await supabaseAdmin.from("customer_invitations").select(`
        *,
        businesses!inner (
          id,
          name
        )
      `).eq("token", token).eq("status", "pending").single();
    if (invitationError || !invitation) {
      throw new APIError(404, "Invalid or expired customer invitation", "INVALID_INVITATION");
    }
    const now = /* @__PURE__ */ new Date();
    const expiryDate = new Date(invitation.expires_at);
    if (now > expiryDate) {
      throw new APIError(410, "Customer invitation has expired", "INVITATION_EXPIRED");
    }
    business = invitation.businesses;
    finalCustomerEmail = customerData.email;
    finalCustomerName = customerData.name;
    const { data: selectedTier, error: tierError } = await supabaseAdmin.from("membership_tiers").select("*").eq("id", customerData.selected_tier_id).eq("restaurant_id", business.id).eq("is_active", true).single();
    if (tierError || !selectedTier) {
      throw new APIError(404, "Selected membership tier not found", "TIER_NOT_FOUND");
    }
    tier = selectedTier;
    customerMetadata = {
      type: "customer_membership",
      token,
      invitation_id: invitation.id,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone || "",
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      zip_code: customerData.zip_code,
      wine_preferences: customerData.wine_preferences || "",
      dietary_restrictions: customerData.dietary_restrictions || "",
      special_requests: customerData.special_requests || "",
      business_id: business.id,
      tier_id: tier.id
    };
  } else if (business_id && tier_id && customer_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      throw new APIError(400, "Invalid email format", "INVALID_EMAIL");
    }
    const { data: businessData, error: businessError } = await supabaseAdmin.from("businesses").select("id, name").eq("id", business_id).single();
    if (businessError || !businessData) {
      throw new APIError(404, "Business not found", "BUSINESS_NOT_FOUND");
    }
    const { data: tierData, error: tierError } = await supabaseAdmin.from("membership_tiers").select("*").eq("id", tier_id).eq("business_id", business_id).eq("is_active", true).single();
    if (tierError || !tierData) {
      throw new APIError(404, "Membership tier not found or not ready for signup", "TIER_NOT_FOUND");
    }
    business = businessData;
    tier = tierData;
    finalCustomerEmail = customer_email;
    finalCustomerName = customer_name || "";
    customerMetadata = {
      type: "customer_membership",
      business_id,
      tier_id,
      customer_email,
      customer_name: customer_name || ""
    };
  } else {
    throw new APIError(400, "Invalid request: provide either token+customerData or business_id+tier_id+customer_email", "INVALID_REQUEST");
  }
  if (!tier.stripe_price_id) {
    throw new APIError(400, "Membership tier is not configured for online signup", "TIER_NOT_CONFIGURED");
  }
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.BASE_URL || "http://localhost:3000";
  let successUrl;
  let cancelUrl;
  if (token && customerData) {
    successUrl = `${baseUrl}/customer/welcome?session_id={CHECKOUT_SESSION_ID}&token=${token}`;
    cancelUrl = `${baseUrl}/customer/join/${token}?canceled=true`;
  } else {
    successUrl = `${baseUrl}/join/${business_id}/success?session_id={CHECKOUT_SESSION_ID}`;
    cancelUrl = `${baseUrl}/join/${business_id}?canceled=true`;
  }
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: finalCustomerEmail,
    customer_creation: "always",
    line_items: [
      {
        price: tier.stripe_price_id,
        quantity: 1
      }
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      ...customerMetadata,
      customer_name: finalCustomerName
    },
    subscription_data: {
      metadata: {
        ...customerMetadata,
        customer_name: finalCustomerName
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
