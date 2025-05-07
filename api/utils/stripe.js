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

// api/utils/stripe.ts
var stripe_exports = {};
__export(stripe_exports, {
  createCheckoutSession: () => createCheckoutSession,
  getSubscription: () => getSubscription,
  stripe: () => stripe,
  verifyStripeWebhook: () => verifyStripeWebhook
});
module.exports = __toCommonJS(stripe_exports);
var import_stripe = __toESM(require("stripe"), 1);

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

// api/utils/stripe.ts
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
var createCheckoutSession = async (data) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env[`STRIPE_PRICE_ID_${data.membershipTier.toUpperCase()}`],
          quantity: 1
        }
      ],
      customer_email: data.email,
      metadata: {
        restaurantName: data.restaurantName,
        membershipTier: data.membershipTier
      },
      success_url: data.successUrl,
      cancel_url: data.cancelUrl
    });
    return session;
  } catch (err) {
    if (err instanceof import_stripe.default.errors.StripeError) {
      throw new APIError(400, err.message, "STRIPE_ERROR");
    }
    throw err;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createCheckoutSession,
  getSubscription,
  stripe,
  verifyStripeWebhook
});
//# sourceMappingURL=stripe.js.map
