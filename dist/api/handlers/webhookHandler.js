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
  apiVersion: "2023-10-16",
  // Using a specific API version for stability
  maxNetworkRetries: 3
  // Retry on network failures for better reliability
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
async function readRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
async function handleWebhook(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  let event;
  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    }
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("\u274C Error verifying Stripe webhook signature:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  try {
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
    console.error("Error handling Stripe webhook:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
async function handleCheckoutCompleted(session) {
  const { customer_id, restaurant_id, type } = session.metadata || {};
  if (!customer_id || !restaurant_id) {
    console.error("Missing metadata (customer_id or restaurant_id) in session");
    return;
  }
  const isRestaurantOnboarding = type === "restaurant_onboarding";
  if (isRestaurantOnboarding) {
    console.log(`Processing restaurant onboarding payment for restaurant_id: ${restaurant_id}`);
    const { error: restaurantError } = await supabaseAdmin.from("restaurants").update({
      payment_session_id: session.id,
      payment_completed: true,
      payment_date: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", restaurant_id);
    if (restaurantError) {
      console.error("Error updating restaurant after checkout:", restaurantError);
      throw restaurantError;
    }
    if (session.metadata?.invitation_token) {
      await supabaseAdmin.from("restaurant_invitations").update({
        status: "paid",
        payment_session_id: session.id,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("token", session.metadata.invitation_token);
    }
  } else {
    console.log(`Processing customer subscription for customer_id: ${customer_id}`);
    let stripeCustomerId = session.customer;
    if (!stripeCustomerId && session.customer_email) {
      const newCustomer = await stripe.customers.create({
        email: session.customer_email,
        metadata: {
          customer_id,
          restaurant_id
        }
      });
      stripeCustomerId = newCustomer.id;
    }
    const { error: updateError } = await supabaseAdmin.from("customers").update({
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: session.subscription,
      subscription_status: "active",
      subscription_start_date: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", customer_id);
    if (updateError) {
      console.error("Error updating customer after checkout:", updateError);
      throw updateError;
    }
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
  }).eq("stripe_subscription_id", subscription.id).select("count", { count: "exact", head: true });
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
var webhookHandler_default = handleWebhook;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleWebhook
});
//# sourceMappingURL=webhookHandler.js.map
