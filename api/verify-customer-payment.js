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

// api/verify-customer-payment.ts
var verify_customer_payment_exports = {};
__export(verify_customer_payment_exports, {
  default: () => verify_customer_payment_default
});
module.exports = __toCommonJS(verify_customer_payment_exports);
var import_supabase_js = require("@supabase/supabase-js");
var import_stripe = __toESM(require("stripe"), 1);
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
var withErrorHandling = (handler2) => {
  return async (req, res) => {
    try {
      setCommonHeaders(res);
      if (req.method === "OPTIONS") {
        return res.status(204).end();
      }
      await handler2(req, res);
    } catch (error) {
      errorHandler(error, req, res);
    }
  };
};
var stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true
});
var handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { sessionId, token } = req.body;
    if (!sessionId || !token) {
      return res.status(400).json({ error: "Session ID and token are required" });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"]
    });
    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }
    if (!session.subscription) {
      return res.status(400).json({ error: "No subscription found" });
    }
    const { data: invitation, error: invitationError } = await supabaseAdmin.from("customer_invitations").select(`
        *,
        businesses!inner (
          id,
          name,
          website
        )
      `).eq("token", token).eq("status", "pending").single();
    if (invitationError || !invitation) {
      return res.status(404).json({
        error: "Invalid or expired customer invitation"
      });
    }
    const business = invitation.businesses;
    const metadata = session.metadata || {};
    const subscriptionMetadata = session.subscription.metadata || {};
    const customerData = {
      name: metadata.name || subscriptionMetadata.name || "",
      email: metadata.email || subscriptionMetadata.email || session.customer_email || "",
      phone: metadata.phone || subscriptionMetadata.phone || "",
      address: metadata.address || subscriptionMetadata.address || "",
      city: metadata.city || subscriptionMetadata.city || "",
      state: metadata.state || subscriptionMetadata.state || "",
      zip_code: metadata.zip_code || subscriptionMetadata.zip_code || "",
      wine_preferences: metadata.wine_preferences || subscriptionMetadata.wine_preferences || "",
      dietary_restrictions: metadata.dietary_restrictions || subscriptionMetadata.dietary_restrictions || "",
      special_requests: metadata.special_requests || subscriptionMetadata.special_requests || "",
      tier_id: metadata.tier_id || subscriptionMetadata.tier_id || ""
    };
    if (!customerData.email || !customerData.name || !customerData.tier_id) {
      return res.status(400).json({
        error: "Missing required customer data from payment session"
      });
    }
    const { data: tier, error: tierError } = await supabaseAdmin.from("membership_tiers").select("*").eq("id", customerData.tier_id).eq("business_id", business.id).single();
    if (tierError || !tier) {
      return res.status(404).json({
        error: "Membership tier not found"
      });
    }
    const { data: existingCustomer } = await supabaseAdmin.from("customers").select("id").eq("email", customerData.email).eq("business_id", business.id).single();
    if (existingCustomer) {
      return res.status(409).json({
        error: "Customer already exists for this business"
      });
    }
    const customerRecord = {
      business_id: business.id,
      tier_id: customerData.tier_id,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone || null,
      address: customerData.address || null,
      city: customerData.city || null,
      state: customerData.state || null,
      zip_code: customerData.zip_code || null,
      wine_preferences: customerData.wine_preferences || null,
      dietary_restrictions: customerData.dietary_restrictions || null,
      special_requests: customerData.special_requests || null,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id || null,
      stripe_subscription_id: session.subscription.id,
      subscription_status: session.subscription.status,
      subscription_start_date: /* @__PURE__ */ new Date(),
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const { data: customer, error: customerError } = await supabaseAdmin.from("customers").insert([customerRecord]).select().single();
    if (customerError) {
      console.error("Error creating customer:", customerError);
      return res.status(500).json({
        error: "Failed to create customer record"
      });
    }
    await supabaseAdmin.from("customer_invitations").update({
      status: "used",
      used_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("token", token);
    const subscription = session.subscription;
    const response = {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        tier_name: tier.name,
        subscription_status: customer.subscription_status
      },
      business: {
        id: business.id,
        name: business.name,
        website: business.website
      },
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1e3).toISOString(),
        amount: subscription.items.data[0]?.price.unit_amount || 0
      }
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in verify-customer-payment:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
};
var verify_customer_payment_default = withErrorHandling(handler);
//# sourceMappingURL=verify-customer-payment.js.map
