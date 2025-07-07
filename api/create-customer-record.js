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

// api/create-customer-record.ts
var create_customer_record_exports = {};
__export(create_customer_record_exports, {
  default: () => handler
});
module.exports = __toCommonJS(create_customer_record_exports);
var import_supabase_js = require("@supabase/supabase-js");
var import_stripe = __toESM(require("stripe"), 1);
var stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true
});
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
    console.log("Creating customer record for session:", sessionId);
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
    if (!metadata.businessId || !metadata.tierId) {
      return res.status(400).json({
        error: "Missing required metadata: businessId and tierId"
      });
    }
    console.log("Stripe data retrieved:", {
      customerId: customer.id,
      subscriptionId: subscription.id,
      email: customer.email || session.customer_email,
      metadata
    });
    const { data: existingCustomer } = await supabaseAdmin.from("customers").select("id").eq("stripe_customer_id", customer.id).single();
    if (existingCustomer) {
      console.log("Customer already exists:", existingCustomer.id);
      const { data: customerData2, error: fetchError } = await supabaseAdmin.from("customers").select("*").eq("id", existingCustomer.id).single();
      if (fetchError) {
        console.error("Error fetching existing customer:", fetchError);
        return res.status(500).json({
          error: "Failed to fetch existing customer"
        });
      }
      return res.status(200).json({
        success: true,
        customer: customerData2,
        isNew: false
      });
    }
    const customerData = {
      business_id: metadata.businessId,
      tier_id: metadata.tierId,
      auth_id: null,
      // Will be set when customer creates account
      name: metadata.customerName || "Unknown",
      email: customer.email || session.customer_email || "",
      phone: metadata.customerPhone || "",
      address: metadata.customerAddress || "",
      city: metadata.customerCity || "",
      state: metadata.customerState || "",
      zip_code: metadata.customerZipCode || "",
      wine_preferences: metadata.customerWinePreferences || null,
      special_requests: metadata.customerSpecialRequests || null,
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      subscription_status: "active",
      // Using subscription_status instead of status
      subscription_start_date: (/* @__PURE__ */ new Date()).toISOString(),
      has_completed_survey: false,
      has_seen_tutorial: false
    };
    console.log("Creating customer with data:", customerData);
    const { data: newCustomer, error: insertError } = await supabaseAdmin.from("customers").insert(customerData).select().single();
    if (insertError) {
      console.error("Error creating customer:", insertError);
      return res.status(500).json({
        error: "Failed to create customer record",
        details: insertError.message
      });
    }
    console.log("Customer created successfully:", newCustomer.id);
    return res.status(200).json({
      success: true,
      customer: newCustomer,
      isNew: true
    });
  } catch (error) {
    console.error("Error in create-customer-record:", error);
    if (error instanceof import_stripe.default.errors.StripeError) {
      return res.status(400).json({
        error: error.message
      });
    }
    return res.status(500).json({
      error: "Failed to process customer creation",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
//# sourceMappingURL=create-customer-record.js.map
