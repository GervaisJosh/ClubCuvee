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

// api/utils/stripeClient.ts
var stripeClient_exports = {};
__export(stripeClient_exports, {
  stripe: () => stripe,
  stripeApi: () => stripeApi
});
module.exports = __toCommonJS(stripeClient_exports);
var import_stripe = __toESM(require("stripe"), 1);

// lib/utils/errorHandler.ts
var AppError = class extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "AppError";
  }
};
function handleStripeError(error) {
  if (error.type === "StripeAuthenticationError") {
    return new AppError(401, "Invalid Stripe API key");
  } else if (error.type === "StripeConnectionError") {
    return new AppError(503, "Stripe API connection error");
  } else if (error.type === "StripeAPIError") {
    return new AppError(502, "Stripe API error");
  } else if (error.type === "StripeInvalidRequestError") {
    return new AppError(400, error.message);
  } else if (error.type === "StripeRateLimitError") {
    return new AppError(429, "Too many requests to Stripe API");
  }
  return new AppError(500, "Internal server error");
}

// api/utils/stripeClient.ts
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
var stripeApi = {
  createCheckoutSession: async (data) => {
    try {
      const idempotencyKey = crypto.randomUUID();
      return await stripe.checkout.sessions.create(data, {
        idempotencyKey
      });
    } catch (error) {
      throw handleStripeError(error);
    }
  },
  createCustomer: async (data) => {
    try {
      const idempotencyKey = crypto.randomUUID();
      return await stripe.customers.create(data, {
        idempotencyKey
      });
    } catch (error) {
      throw handleStripeError(error);
    }
  },
  createSubscription: async (data) => {
    try {
      const idempotencyKey = crypto.randomUUID();
      return await stripe.subscriptions.create(data, {
        idempotencyKey
      });
    } catch (error) {
      throw handleStripeError(error);
    }
  },
  constructEvent: async (payload, signature, secret) => {
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      throw handleStripeError(error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  stripe,
  stripeApi
});
//# sourceMappingURL=stripeClient.js.map
