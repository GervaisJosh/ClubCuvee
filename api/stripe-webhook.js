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

// api/stripe-webhook.ts
var stripe_webhook_exports = {};
__export(stripe_webhook_exports, {
  default: () => stripe_webhook_default
});
module.exports = __toCommonJS(stripe_webhook_exports);

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
var errorHandler = (error, req, res) => {
  console.error("API Error:", error);
  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code
      }
    });
  }
  if (error instanceof import_zod.ZodError) {
    return res.status(400).json({
      error: {
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.errors
      }
    });
  }
  if (error instanceof Error && error.name === "StripeError") {
    return res.status(400).json({
      error: {
        message: error.message,
        code: "STRIPE_ERROR"
      }
    });
  }
  return res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR"
    }
  });
};
var withErrorHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      errorHandler(error, req, res);
    }
  };
};

// api/utils/stripe.ts
var import_stripe = __toESM(require("stripe"), 1);
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
var verifyStripeWebhook = (signature, payload) => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new APIError(400, "Invalid webhook signature", "INVALID_SIGNATURE");
  }
};
var getSubscription = async (subscriptionId) => {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (err) {
    if (err instanceof import_stripe.default.errors.StripeError) {
      throw new APIError(400, err.message, "STRIPE_ERROR");
    }
    throw err;
  }
};

// api/utils/supabase.ts
var import_supabase_js = require("@supabase/supabase-js");
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is required");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
}
var supabase = (0, import_supabase_js.createClient)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
var createRestaurant = async (data) => {
  const { data: restaurant, error } = await supabase.from("restaurants").insert([data]).select().single();
  if (error) {
    throw new APIError(500, "Failed to create restaurant", "DATABASE_ERROR");
  }
  return restaurant;
};
var updateRestaurantInvite = async (token, data) => {
  const { error } = await supabase.from("restaurant_invites").update(data).eq("token", token);
  if (error) {
    throw new APIError(500, "Failed to update restaurant invite", "DATABASE_ERROR");
  }
};

// api/stripe-webhook.ts
var stripe_webhook_default = withErrorHandler(async (req, res) => {
  if (req.method !== "POST") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    throw new APIError(400, "Missing stripe-signature header", "MISSING_SIGNATURE");
  }
  const event = verifyStripeWebhook(signature, req.body);
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (!session.subscription || !session.metadata?.restaurantName) {
        throw new APIError(400, "Invalid session data", "INVALID_SESSION");
      }
      const subscription = await getSubscription(session.subscription);
      await createRestaurant({
        name: session.metadata.restaurantName,
        email: session.customer_email,
        subscription_id: subscription.id,
        membership_tier: session.metadata.membershipTier
      });
      if (session.metadata.inviteToken) {
        await updateRestaurantInvite(session.metadata.inviteToken, {
          status: "accepted",
          accepted_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  res.status(200).json({ received: true });
});
//# sourceMappingURL=stripe-webhook.js.map
