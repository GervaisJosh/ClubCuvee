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
  const { error } = await supabase.from("restaurant_invitations").update(data).eq("token", token);
  if (error) {
    throw new APIError(500, "Failed to update restaurant invitation", "DATABASE_ERROR");
  }
};

// lib/supabaseAdmin.ts
var import_supabase_js2 = require("@supabase/supabase-js");
var supabaseAdmin = (0, import_supabase_js2.createClient)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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
      if (session.metadata?.type === "business_onboarding") {
        if (!session.subscription || !session.metadata?.business_invitation_token) {
          throw new APIError(400, "Invalid business onboarding session data", "INVALID_SESSION");
        }
        const subscription = await getSubscription(session.subscription);
        const { data: inviteData, error: inviteError } = await supabaseAdmin.rpc("validate_business_invitation_token", {
          p_token: session.metadata.business_invitation_token
        });
        if (inviteError || !inviteData || inviteData.length === 0) {
          throw new APIError(400, "Invalid business invitation token", "INVALID_TOKEN");
        }
        const businessData = inviteData[0];
        await createRestaurant({
          name: businessData.business_name,
          email: businessData.business_email,
          subscription_id: subscription.id,
          membership_tier: session.metadata.pricing_tier_key
        });
        const { error: markUsedError } = await supabaseAdmin.rpc("mark_business_invitation_used", {
          p_token: session.metadata.business_invitation_token
        });
        if (markUsedError) {
          console.error("Error marking business invitation as used:", markUsedError);
        }
      } else if (session.metadata?.restaurantName) {
        if (!session.subscription) {
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
      } else if (session.metadata?.type === "customer_membership") {
        if (!session.subscription || !session.metadata?.business_id || !session.metadata?.tier_id) {
          throw new APIError(400, "Invalid customer membership session data", "INVALID_SESSION");
        }
        const subscription = await getSubscription(session.subscription);
        const { error: membershipError } = await supabaseAdmin.from("customers").insert({
          email: session.metadata.customer_email,
          name: session.metadata.customer_name || null,
          business_id: session.metadata.business_id,
          tier_id: session.metadata.tier_id,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          subscription_status: "active",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (membershipError) {
          console.error("Error creating customer membership:", membershipError);
          throw new APIError(500, "Failed to create customer membership", "MEMBERSHIP_CREATION_FAILED");
        }
      } else {
        throw new APIError(400, "Unknown checkout session type", "INVALID_SESSION");
      }
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  res.status(200).json({ received: true });
});
//# sourceMappingURL=stripe-webhook.js.map
