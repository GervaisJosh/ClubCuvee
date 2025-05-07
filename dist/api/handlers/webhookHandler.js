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

// api/handlers/webhookHandler.ts
var webhookHandler_exports = {};
__export(webhookHandler_exports, {
  default: () => webhookHandler_default,
  handleWebhook: () => handleWebhook
});
module.exports = __toCommonJS(webhookHandler_exports);

// api/utils/stripeClient.ts
var import_stripe = __toESM(require("stripe"), 1);
var stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is not configured in environment variables");
}
var stripe = new import_stripe.default(stripeSecretKey || "invalid_key", {
  apiVersion: "2025-02-24.acacia",
  maxNetworkRetries: 3,
  typescript: true,
  appInfo: {
    name: "Club Cuvee",
    version: "1.0.0"
  }
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

// api/handlers/webhookHandler.ts
var import_zod2 = require("zod");

// api/utils/errorHandler.ts
var import_zod = require("zod");
var AppError = class _AppError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, _AppError.prototype);
  }
};
var sendErrorResponse = (res, error, statusCode = 500) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (res.req?.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (error instanceof import_zod.ZodError) {
    return res.status(400).json({
      error: "Validation Error",
      details: error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message
      }))
    });
  }
  if (error instanceof AppError && error.isOperational) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }
  console.error("Unexpected error:", error);
  return res.status(statusCode).json({
    error: true ? "An unexpected error occurred" : error.message
  });
};

// api/handlers/webhookHandler.ts
async function readRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
var RATE_LIMITS = {
  default: {
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    maxRequests: 100
  },
  "checkout.session.completed": {
    windowMs: 5 * 60 * 1e3,
    // 5 minutes
    maxRequests: 50
  },
  "customer.subscription.updated": {
    windowMs: 5 * 60 * 1e3,
    maxRequests: 50
  }
};
var requestCounts = /* @__PURE__ */ new Map();
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of requestCounts.entries()) {
    if (now > entry.resetTime) {
      requestCounts.delete(key);
    }
  }
}
function isRateLimited(ip, eventType) {
  cleanupExpiredEntries();
  const config = RATE_LIMITS[eventType] || RATE_LIMITS.default;
  const key = `${ip}:${eventType}`;
  const now = Date.now();
  const entry = requestCounts.get(key);
  if (!entry) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return false;
  }
  if (now > entry.resetTime) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return false;
  }
  if (entry.count >= config.maxRequests) {
    return true;
  }
  entry.count++;
  return false;
}
async function handleWebhook(req, res) {
  try {
    if (req.method !== "POST") {
      throw new AppError(405, "Method not allowed");
    }
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (typeof ip === "string" && isRateLimited(ip, "default")) {
      throw new AppError(429, "Too many requests");
    }
    const rawBody = await readRawBody(req);
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    }
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
    if (typeof ip === "string" && isRateLimited(ip, event.type)) {
      throw new AppError(429, "Too many requests for this event type");
    }
    console.log(`Processing webhook event: ${event.type}`);
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object);
        break;
      }
      case "customer.subscription.updated": {
        await handleSubscriptionUpdated(event.data.object);
        break;
      }
      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(event.data.object);
        break;
      }
      case "invoice.payment_succeeded": {
        await handlePaymentSucceeded(event.data.object);
        break;
      }
      case "invoice.payment_failed": {
        await handlePaymentFailed(event.data.object);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    return sendErrorResponse(res, error instanceof Error ? error : new Error(String(error)));
  }
}
async function handleCheckoutCompleted(session) {
  if (!session.metadata?.customer_id || !session.metadata?.restaurant_id) {
    throw new AppError(400, "Missing required metadata in session");
  }
  try {
    const { data: customer, error: customerError } = await supabaseAdmin.from("customers").select("*").eq("id", session.metadata.customer_id).single();
    if (customerError) throw customerError;
    if (!customer) throw new AppError(404, "Customer not found");
    const { error: updateError } = await supabaseAdmin.from("customers").update({
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      subscription_status: "active",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", session.metadata.customer_id);
    if (updateError) throw updateError;
    const { error: restaurantError } = await supabaseAdmin.from("restaurants").update({
      status: "active",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", session.metadata.restaurant_id);
    if (restaurantError) throw restaurantError;
  } catch (error) {
    console.error("Error processing checkout completed:", error);
    throw error;
  }
}
async function handleSubscriptionUpdated(subscription) {
  const { customer_id, restaurant_id } = subscription.metadata || {};
  if (!customer_id) {
    const customerId = subscription.customer;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      const metadata = customer.metadata;
      if (metadata.customer_id) {
        await updateSubscriptionByCustomerId(metadata.customer_id, subscription);
        return;
      }
    } catch (err) {
      console.error("Error fetching Stripe customer:", err);
    }
    console.error("Missing customer_id in subscription metadata");
    return;
  }
  await updateSubscriptionByCustomerId(customer_id, subscription);
}
async function updateSubscriptionByCustomerId(customerId, subscription) {
  const { error: subIdError, count } = await supabaseAdmin.from("customers").update({
    subscription_status: subscription.status,
    current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3).toISOString() : null,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("stripe_subscription_id", subscription.id).select("count");
  if (subIdError) {
    console.error("Error updating subscription by ID:", subIdError);
  }
  if (!count) {
    const { error: custIdError } = await supabaseAdmin.from("customers").update({
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3).toISOString() : null,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", customerId);
    if (custIdError) {
      console.error("Error updating subscription by customer ID:", custIdError);
      throw custIdError;
    }
  }
}
async function handleSubscriptionDeleted(subscription) {
  const { customer_id } = subscription.metadata || {};
  if (!customer_id) {
    const customerId = subscription.customer;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      const metadata = customer.metadata;
      if (metadata.customer_id) {
        await updateSubscriptionCancellation(metadata.customer_id, subscription);
        return;
      }
    } catch (err) {
      console.error("Error fetching Stripe customer:", err);
    }
    console.error("Missing customer_id in subscription metadata");
    return;
  }
  await updateSubscriptionCancellation(customer_id, subscription);
}
async function updateSubscriptionCancellation(customerId, subscription) {
  const canceledAt = subscription.canceled_at ? new Date(subscription.canceled_at * 1e3).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  const { error: updateError } = await supabaseAdmin.from("customers").update({
    subscription_status: "canceled",
    subscription_end_date: canceledAt,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("stripe_subscription_id", subscription.id);
  if (updateError) {
    console.error("Error updating subscription cancellation:", updateError);
    throw updateError;
  }
}
async function handlePaymentSucceeded(invoice) {
  if (!invoice.subscription) return;
  try {
    const { error } = await supabaseAdmin.from("subscription_payments").insert([{
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: invoice.subscription,
      stripe_customer_id: invoice.customer,
      amount: invoice.amount_paid / 100,
      // from cents
      currency: invoice.currency,
      status: invoice.status,
      payment_date: new Date(invoice.created * 1e3).toISOString(),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }]);
    if (error) {
      console.error("Error recording subscription payment:", error);
    }
  } catch (error) {
    console.error("Error processing payment succeeded event:", error);
  }
}
async function handlePaymentFailed(invoice) {
  if (!invoice.subscription) return;
  try {
    const { data: foundCustomer, error: custError } = await supabaseAdmin.from("customers").select("id, email").eq("stripe_subscription_id", invoice.subscription).maybeSingle();
    if (custError) {
      console.error("Error finding customer for failed payment:", custError);
      return;
    }
    if (!foundCustomer) {
      console.error("No matching customer found for failed payment");
      return;
    }
    const { error: updateError } = await supabaseAdmin.from("customers").update({
      subscription_status: "past_due",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", foundCustomer.id);
    if (updateError) {
      console.error("Error updating customer subscription status:", updateError);
      throw updateError;
    }
  } catch (error) {
    console.error("Error processing payment failed event:", error);
  }
}
var InvitationSchema = import_zod2.z.object({
  email: import_zod2.z.string().email(),
  restaurant_name: import_zod2.z.string().min(1)
  // ... other fields
});
var webhookHandler_default = handleWebhook;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleWebhook
});
//# sourceMappingURL=webhookHandler.js.map
