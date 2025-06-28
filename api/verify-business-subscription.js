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

// api/verify-business-subscription.ts
var verify_business_subscription_exports = {};
__export(verify_business_subscription_exports, {
  default: () => verify_business_subscription_default
});
module.exports = __toCommonJS(verify_business_subscription_exports);
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
var verify_business_subscription_default = withErrorHandler(async (req, res) => {
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
  const { token, sessionId } = req.body;
  if (!token || !sessionId) {
    throw new APIError(400, "Token and sessionId are required", "VALIDATION_ERROR");
  }
  try {
    const { data: invite, error: inviteError } = await supabaseAdmin.from("restaurant_invitations").select("restaurant_name, email, tier, expires_at, status, payment_session_id").eq("token", token).single();
    if (inviteError || !invite) {
      console.error("Error fetching invitation details:", inviteError);
      throw new APIError(404, "Invalid invitation token", "NOT_FOUND");
    }
    if (invite.payment_session_id !== sessionId) {
      throw new APIError(400, "Session ID does not match invitation", "VALIDATION_ERROR");
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      throw new APIError(404, "Checkout session not found", "NOT_FOUND");
    }
    if (session.payment_status !== "paid") {
      throw new APIError(400, "Payment not completed", "PAYMENT_INCOMPLETE");
    }
    const subscriptionId = session.subscription;
    if (!subscriptionId) {
      throw new APIError(400, "No subscription found for this session", "NO_SUBSCRIPTION");
    }
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await supabaseAdmin.from("restaurant_invitations").update({
      status: "paid",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("token", token);
    res.status(200).json({
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          customerId: subscription.customer,
          priceId: subscription.items.data[0]?.price.id
        },
        pricing_tier: invite.tier,
        session: {
          id: session.id,
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email
        }
      }
    });
  } catch (err) {
    if (err instanceof import_stripe.default.errors.StripeError) {
      throw new APIError(400, err.message, "STRIPE_ERROR");
    }
    throw err;
  }
});
//# sourceMappingURL=verify-business-subscription.js.map
