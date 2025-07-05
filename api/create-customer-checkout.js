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

// api/create-customer-checkout.ts
var create_customer_checkout_exports = {};
__export(create_customer_checkout_exports, {
  default: () => handler
});
module.exports = __toCommonJS(create_customer_checkout_exports);
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
    const { businessId, businessSlug, tierId, priceId, customerData } = req.body;
    if (!businessId || !tierId || !priceId || !customerData) {
      return res.status(400).json({
        error: "Missing required parameters: businessId, tierId, priceId, and customerData are required"
      });
    }
    const requiredFields = ["name", "email", "phone", "address", "city", "state", "zipCode"];
    for (const field of requiredFields) {
      if (!customerData[field]) {
        return res.status(400).json({
          error: `Missing required customer field: ${field}`
        });
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: customerData.email,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      metadata: {
        businessId,
        tierId,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerAddress: customerData.address,
        customerCity: customerData.city,
        customerState: customerData.state,
        customerZipCode: customerData.zipCode,
        customerWinePreferences: customerData.winePreferences || "",
        customerSpecialRequests: customerData.specialRequests || ""
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://club-cuvee.com"}/customer/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://club-cuvee.com"}/join/${businessSlug || businessId}`,
      allow_promotion_codes: true
    });
    return res.status(200).json({
      success: true,
      checkoutUrl: session.url
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    if (error instanceof import_stripe.default.errors.StripeError) {
      return res.status(400).json({
        error: error.message
      });
    }
    return res.status(500).json({
      error: "Failed to create checkout session"
    });
  }
}
//# sourceMappingURL=create-customer-checkout.js.map
