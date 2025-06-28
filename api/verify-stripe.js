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

// api/verify-stripe.ts
var verify_stripe_exports = {};
__export(verify_stripe_exports, {
  default: () => verify_stripe_default
});
module.exports = __toCommonJS(verify_stripe_exports);
var import_zod2 = require("zod");

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
var getRestaurantInvite = async (token) => {
  const { data, error } = await supabase.from("restaurant_invitations").select("*").eq("token", token).single();
  if (error) {
    throw new APIError(500, "Failed to fetch restaurant invitation", "DATABASE_ERROR");
  }
  if (!data) {
    throw new APIError(404, "Invitation not found", "INVITATION_NOT_FOUND");
  }
  return data;
};

// api/verify-stripe.ts
var verifyStripeSchema = import_zod2.z.object({
  token: import_zod2.z.string().uuid(),
  sessionId: import_zod2.z.string()
});
var verify_stripe_default = withErrorHandler(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method === "GET") {
    try {
      const isConfigured = !!process.env.STRIPE_SECRET_KEY;
      res.status(200).json({
        status: "success",
        data: {
          isConfigured,
          message: isConfigured ? "Stripe is configured" : "Stripe is not configured"
        }
      });
      return;
    } catch (error) {
      throw new APIError(500, "Failed to verify Stripe configuration", "STRIPE_ERROR");
    }
  }
  if (req.method === "POST") {
    try {
      const { token, sessionId } = verifyStripeSchema.parse(req.body);
      await getRestaurantInvite(token);
      const subscription = await getSubscription(sessionId);
      if (subscription.status !== "active") {
        throw new APIError(400, "Subscription is not active", "INVALID_SUBSCRIPTION");
      }
      res.status(200).json({
        status: "success",
        data: {
          subscription: {
            id: subscription.id,
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end
          }
        }
      });
      return;
    } catch (error) {
      if (error instanceof import_zod2.z.ZodError) {
        throw new APIError(400, "Invalid request data", "VALIDATION_ERROR");
      }
      throw error;
    }
  }
  throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
});
//# sourceMappingURL=verify-stripe.js.map
