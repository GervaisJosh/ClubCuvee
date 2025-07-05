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

// api/verify-stripe-session.ts
var verify_stripe_session_exports = {};
__export(verify_stripe_session_exports, {
  default: () => handler
});
module.exports = __toCommonJS(verify_stripe_session_exports);
var import_stripe = __toESM(require("stripe"), 1);
var stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true
});
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({
        error: "Missing required parameter: sessionId"
      });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"]
    });
    if (session.payment_status !== "paid") {
      return res.status(400).json({
        error: "Payment not completed"
      });
    }
    const subscription = session.subscription;
    const customer = session.customer;
    if (!subscription || !customer) {
      return res.status(400).json({
        error: "Invalid subscription or customer data"
      });
    }
    const metadata = session.metadata || {};
    return res.status(200).json({
      success: true,
      stripeCustomerId: customer.id,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      email: customer.email || session.customer_email,
      metadata: {
        businessId: metadata.businessId,
        tierId: metadata.tierId,
        customerName: metadata.customerName,
        customerPhone: metadata.customerPhone,
        customerAddress: metadata.customerAddress,
        customerCity: metadata.customerCity,
        customerState: metadata.customerState,
        customerZipCode: metadata.customerZipCode,
        customerWinePreferences: metadata.customerWinePreferences,
        customerSpecialRequests: metadata.customerSpecialRequests
      }
    });
  } catch (error) {
    console.error("Error verifying Stripe session:", error);
    if (error instanceof import_stripe.default.errors.StripeError) {
      return res.status(400).json({
        error: error.message
      });
    }
    return res.status(500).json({
      error: "Failed to verify payment session"
    });
  }
}
//# sourceMappingURL=verify-stripe-session.js.map
