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
  default: () => handler
});
module.exports = __toCommonJS(verify_stripe_exports);
var import_stripe = __toESM(require("stripe"), 1);
async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.status(200).send(JSON.stringify({ status: "success" }));
    }
    if (req.method !== "GET") {
      return res.status(405).send(JSON.stringify({
        status: "error",
        error: "Method not allowed",
        allowed_methods: ["GET", "OPTIONS"]
      }));
    }
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).send(JSON.stringify({
        status: "error",
        error: "Missing Stripe configuration",
        message: "STRIPE_SECRET_KEY is not set in environment variables",
        config: {
          STRIPE_SECRET_KEY: "missing",
          STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? "configured" : "missing",
          STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? "configured" : "missing"
        }
      }));
    }
    let stripe;
    try {
      stripe = new import_stripe.default(stripeSecretKey, {
        apiVersion: "2023-10-16",
        maxNetworkRetries: 3
      });
    } catch (initError) {
      console.error("Failed to initialize Stripe client:", initError);
      return res.status(500).send(JSON.stringify({
        status: "error",
        error: "Stripe initialization failed",
        message: initError.message || "Could not initialize Stripe client"
      }));
    }
    let balance;
    try {
      balance = await stripe.balance.retrieve();
    } catch (apiError) {
      console.error("Failed to retrieve Stripe balance:", apiError);
      const statusCode = apiError.type === "StripeAuthenticationError" ? 401 : apiError.type === "StripeConnectionError" ? 503 : apiError.type === "StripeAPIError" ? 502 : 500;
      return res.status(statusCode).send(JSON.stringify({
        status: "error",
        error: "Stripe API verification failed",
        message: apiError.message || "Could not connect to Stripe API",
        type: apiError.type || "unknown"
      }));
    }
    return res.status(200).send(JSON.stringify({
      status: "success",
      message: "Stripe API connection successful",
      livemode: balance.livemode,
      config: {
        STRIPE_SECRET_KEY: "configured",
        STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? "configured" : "missing",
        STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? "configured" : "missing"
      },
      balance: {
        available: balance.available.map((b) => ({
          amount: (b.amount / 100).toFixed(2),
          currency: b.currency
        })),
        pending: balance.pending.map((b) => ({
          amount: (b.amount / 100).toFixed(2),
          currency: b.currency
        }))
      }
    }));
  } catch (error) {
    console.error("Stripe verification error:", error);
    if (res.headersSent) {
      console.error("Cannot send error response - headers already sent");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    let statusCode = 500;
    if (error.type === "StripeAuthenticationError") {
      statusCode = 401;
    } else if (error.type === "StripeConnectionError") {
      statusCode = 503;
    } else if (error.type === "StripeAPIError") {
      statusCode = 502;
    }
    return res.status(statusCode).send(JSON.stringify({
      status: "error",
      error: error.message || "Internal server error",
      type: error.type || "unknown",
      details: false ? {
        message: error.message,
        code: error.code,
        type: error.type,
        name: error.name
      } : void 0
    }));
  }
}
//# sourceMappingURL=verify-stripe.js.map
