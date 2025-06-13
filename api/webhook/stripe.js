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

// api/webhook/stripe.ts
var stripe_exports = {};
__export(stripe_exports, {
  default: () => handler
});
module.exports = __toCommonJS(stripe_exports);
var import_stripe = __toESM(require("stripe"), 1);
var import_supabase_js = require("@supabase/supabase-js");
var stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia"
});
var supabaseUrl = process.env.VITE_SUPABASE_URL;
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
var webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!supabaseUrl || !supabaseServiceKey || !webhookSecret) {
  throw new Error("Missing required environment variables");
}
var supabase = (0, import_supabase_js.createClient)(supabaseUrl, supabaseServiceKey);
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).json({ error: "Invalid signature" });
  }
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
async function handleCheckoutSessionCompleted(session) {
  console.log("Processing checkout.session.completed:", session.id);
  if (session.mode === "subscription" && session.subscription) {
    const metadata = session.metadata || {};
    if (metadata.onboarding_token) {
      await handleBusinessOnboardingCheckout(session, metadata.onboarding_token);
    } else if (metadata.business_id && metadata.tier_id) {
      await handleCustomerMembershipCheckout(session, metadata.business_id, metadata.tier_id);
    }
  }
}
async function handleBusinessOnboardingCheckout(session, token) {
  try {
    const { error: tokenError } = await supabase.from("onboarding_tokens").update({
      status: "payment_completed",
      stripe_session_id: session.id,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("token", token);
    if (tokenError) {
      console.error("Error updating onboarding token:", tokenError);
    }
    console.log(`Business onboarding payment completed for token: ${token}`);
  } catch (error) {
    console.error("Error handling business onboarding checkout:", error);
  }
}
async function handleCustomerMembershipCheckout(session, businessId, tierId) {
  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const metadata = session.metadata || {};
    if (metadata.invitation_token) {
      await handlePrivateInvitationCheckout(session, metadata.invitation_token, businessId, tierId);
    } else {
      const { error: membershipError } = await supabase.from("customers").insert({
        business_id: businessId,
        tier_id: tierId,
        stripe_subscription_id: subscription.id,
        subscription_status: "active",
        email: session.customer_email || "",
        name: session.customer_details?.name || "Customer"
      });
      if (membershipError) {
        console.error("Error creating customer membership:", membershipError);
      } else {
        console.log(`Customer membership created for business: ${businessId}, tier: ${tierId}`);
      }
    }
  } catch (error) {
    console.error("Error handling customer membership checkout:", error);
  }
}
async function handlePrivateInvitationCheckout(session, invitationToken, businessId, tierId) {
  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const { data: invitation, error: inviteError } = await supabase.from("customer_invitations").select("*").eq("token", invitationToken).single();
    if (inviteError || !invitation) {
      console.error("Error finding invitation:", inviteError);
      return;
    }
    const typedInvitation = invitation;
    const { error: updateInviteError } = await supabase.from("customer_invitations").update({
      status: "used",
      used_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", typedInvitation.id);
    if (updateInviteError) {
      console.error("Error updating invitation status:", updateInviteError);
    }
    const { data: authUsers, error: userError } = await supabase.auth.admin.listUsers();
    if (userError || !authUsers.users) {
      console.error("Error finding customer user:", userError);
      return;
    }
    const customerUser = authUsers.users.find((user) => user.email === typedInvitation.email);
    if (!customerUser) {
      console.error("Customer user not found for email:", typedInvitation.email);
      return;
    }
    const { error: membershipError } = await supabase.from("customers").insert({
      auth_id: customerUser.id,
      business_id: businessId,
      tier_id: tierId,
      stripe_subscription_id: subscription.id,
      subscription_status: "active",
      email: typedInvitation.email,
      name: customerUser.user_metadata?.full_name || typedInvitation.email,
      stripe_customer_id: subscription.customer
    });
    if (membershipError) {
      console.error("Error creating customer membership:", membershipError);
    } else {
      console.log(`Private customer membership created for invitation: ${invitationToken}`);
    }
  } catch (error) {
    console.error("Error handling private invitation checkout:", error);
  }
}
async function handleInvoicePaymentSucceeded(invoice) {
  console.log("Processing invoice.payment_succeeded:", invoice.id);
  if (invoice.subscription) {
    await updateSubscriptionStatus(invoice.subscription, "active");
    await updateCustomerMembershipStatus(invoice.subscription, "active");
  }
}
async function handleInvoicePaymentFailed(invoice) {
  console.log("Processing invoice.payment_failed:", invoice.id);
  if (invoice.subscription) {
    await updateSubscriptionStatus(invoice.subscription, "past_due");
    await updateCustomerMembershipStatus(invoice.subscription, "past_due");
  }
}
async function handleSubscriptionCreated(subscription) {
  console.log("Processing customer.subscription.created:", subscription.id);
  await upsertSubscriptionRecord(subscription);
}
async function handleSubscriptionUpdated(subscription) {
  console.log("Processing customer.subscription.updated:", subscription.id);
  await upsertSubscriptionRecord(subscription);
  if (subscription.status === "active") {
    await updateCustomerMembershipStatus(subscription.id, "active");
  } else if (["past_due", "canceled", "unpaid"].includes(subscription.status)) {
    await updateCustomerMembershipStatus(subscription.id, subscription.status);
  }
}
async function handleSubscriptionDeleted(subscription) {
  console.log("Processing customer.subscription.deleted:", subscription.id);
  await updateSubscriptionStatus(subscription.id, "canceled");
  await updateCustomerMembershipStatus(subscription.id, "canceled");
}
async function updateSubscriptionStatus(subscriptionId, status) {
  try {
    const { error: businessSubError } = await supabase.from("subscriptions").update({
      status,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("stripe_subscription_id", subscriptionId);
    if (businessSubError) {
      console.error("Error updating business subscription status:", businessSubError);
    }
    if (status === "active") {
      const { data: subscriptionData } = await supabase.from("subscriptions").select("business_id").eq("stripe_subscription_id", subscriptionId);
      if (subscriptionData && subscriptionData.length > 0) {
        const businessIds = subscriptionData.map((sub) => sub.business_id);
        const { error: businessError } = await supabase.from("businesses").update({
          subscription_status: "active",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).in("id", businessIds);
        if (businessError) {
          console.error("Error updating business status:", businessError);
        }
      }
    }
  } catch (error) {
    console.error("Error updating subscription status:", error);
  }
}
async function updateCustomerMembershipStatus(subscriptionId, status) {
  try {
    const { error } = await supabase.from("customers").update({
      subscription_status: status,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("stripe_subscription_id", subscriptionId);
    if (error) {
      console.error("Error updating customer membership status:", error);
    }
  } catch (error) {
    console.error("Error updating customer membership status:", error);
  }
}
async function upsertSubscriptionRecord(subscription) {
  try {
    const metadata = subscription.metadata || {};
    if (metadata.business_id) {
      const { error } = await supabase.from("subscriptions").upsert({
        business_id: metadata.business_id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        stripe_price_id: subscription.items.data[0]?.price.id || "",
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1e3).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1e3).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) {
        console.error("Error upserting business subscription:", error);
      }
    }
  } catch (error) {
    console.error("Error upserting subscription record:", error);
  }
}
//# sourceMappingURL=stripe.js.map
