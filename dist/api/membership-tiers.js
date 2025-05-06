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

// api/membership-tiers.ts
var membership_tiers_exports = {};
__export(membership_tiers_exports, {
  default: () => membership_tiers_default
});
module.exports = __toCommonJS(membership_tiers_exports);

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

// api/utils/errorHandler.ts
function formatApiError(error, includeDetails = false) {
  const errorResponse = {
    status: "error",
    error: error.message || "Internal server error"
  };
  if (error.type) {
    errorResponse.type = error.type;
  }
  if (error.code || error.statusCode) {
    errorResponse.code = error.code || error.statusCode;
  }
  const deployUrl = process.env.VERCEL_URL || process.env.FRONTEND_URL;
  if (deployUrl) {
    errorResponse.deployment_url = deployUrl.startsWith("http") ? deployUrl : `https://${deployUrl}`;
  }
  if (includeDetails || false) {
    errorResponse.errorDetails = {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack,
      // Additional properties that might be useful
      name: error.name,
      cause: error.cause
    };
  }
  return errorResponse;
}
function sendApiError(res, error, statusCode = 500, includeDetails = false) {
  console.error(`API Error (${statusCode}):`, error);
  res.status(statusCode).json(formatApiError(error, includeDetails));
}
function getErrorStatusCode(error) {
  if (error.type === "StripeAuthenticationError" || error.message?.toLowerCase().includes("authentication") || error.message?.toLowerCase().includes("api key") || error.code === "auth_error") {
    return 401;
  }
  if (error.type === "StripeInvalidRequestError" || error.message?.toLowerCase().includes("validation") || error.message?.toLowerCase().includes("invalid")) {
    return 400;
  }
  if (error.type === "StripeInvalidRequestError" && error.message?.toLowerCase().includes("no such") || error.code === "resource_missing") {
    return 404;
  }
  if (error.type === "StripeRateLimitError" || error.code === "rate_limit_exceeded") {
    return 429;
  }
  if (error.type === "StripeAPIError" || error.type === "StripeConnectionError") {
    return 502;
  }
  return 500;
}
function withErrorHandling(handler2) {
  return async (req, res) => {
    try {
      return await handler2(req, res);
    } catch (error) {
      const statusCode = getErrorStatusCode(error);
      sendApiError(res, error, statusCode);
    }
  };
}

// api/membership-tiers.ts
var handler = async (req, res) => {
  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const {
      id,
      // Optional: If updating an existing tier
      name,
      // Required: Tier name
      price,
      // Required: Monthly price
      description,
      // Optional: Tier description
      restaurant_id,
      // Required: ID of the parent restaurant
      stripe_price_id,
      // Optional: Existing Stripe price ID (if reconnecting)
      stripe_product_id
      // Optional: Existing Stripe product ID (if reconnecting)
    } = req.body;
    if (!name || !price || !restaurant_id) {
      return res.status(400).json({
        error: "Missing required fields: name, price, and restaurant_id are required"
      });
    }
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return res.status(400).json({
        error: "Price must be a positive number"
      });
    }
    const { data: restaurant, error: restaurantError } = await supabaseAdmin.from("restaurants").select("name").eq("id", restaurant_id).single();
    if (restaurantError) {
      console.error("Error fetching restaurant:", restaurantError);
      return res.status(404).json({
        error: `Restaurant not found: ${restaurantError.message}`
      });
    }
    if (!restaurant) {
      return res.status(404).json({
        error: `Restaurant with ID ${restaurant_id} not found`
      });
    }
    const tierData = {
      name,
      price: priceNumber.toString(),
      // Store as string in database
      description: description || "",
      restaurant_id,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    let tier;
    let existingTier = null;
    if (id) {
      const { data: fetchedTier, error: fetchError } = await supabaseAdmin.from("membership_tiers").select("*").eq("id", id).eq("restaurant_id", restaurant_id).single();
      if (fetchError) {
        return res.status(404).json({
          error: `Tier not found: ${fetchError.message}`
        });
      }
      existingTier = fetchedTier;
      const { data: updatedTier, error: updateError } = await supabaseAdmin.from("membership_tiers").update(tierData).eq("id", id).select().single();
      if (updateError) {
        return res.status(500).json({
          error: `Failed to update tier: ${updateError.message}`
        });
      }
      tier = updatedTier;
    } else {
      const { data: newTier, error: insertError } = await supabaseAdmin.from("membership_tiers").insert([{
        ...tierData,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }]).select().single();
      if (insertError) {
        return res.status(500).json({
          error: `Failed to create tier: ${insertError.message}`
        });
      }
      tier = newTier;
    }
    try {
      if (existingTier && existingTier.stripe_product_id && existingTier.stripe_price_id) {
        const hasNameChanged = existingTier.name !== name;
        const hasDescriptionChanged = existingTier.description !== description;
        if (hasNameChanged || hasDescriptionChanged) {
          await stripe.products.update(existingTier.stripe_product_id, {
            name: `${restaurant.name} - ${name}`,
            description: description || `${name} membership tier`
          });
        }
        const hasPriceChanged = parseFloat(existingTier.price) !== priceNumber;
        if (hasPriceChanged) {
          await stripe.prices.update(existingTier.stripe_price_id, {
            active: false
          });
          const newPrice = await stripe.prices.create({
            product: existingTier.stripe_product_id,
            unit_amount: Math.round(priceNumber * 100),
            // Convert to cents
            currency: "usd",
            recurring: { interval: "month" },
            metadata: {
              restaurant_id,
              tier_id: tier.id
            }
          });
          const { error: priceUpdateError } = await supabaseAdmin.from("membership_tiers").update({
            stripe_price_id: newPrice.id,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }).eq("id", tier.id);
          if (priceUpdateError) {
            console.error("Error updating tier with new price ID:", priceUpdateError);
          }
          tier.stripe_price_id = newPrice.id;
        }
      } else {
        const product = await stripe.products.create({
          name: `${restaurant.name} - ${name}`,
          description: description || `${name} membership tier`,
          metadata: {
            tier_id: tier.id,
            restaurant_id
          }
        });
        const price2 = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(priceNumber * 100),
          // Convert to cents
          currency: "usd",
          recurring: { interval: "month" },
          metadata: {
            tier_id: tier.id,
            restaurant_id
          }
        });
        const { data: updatedTier, error: updateError } = await supabaseAdmin.from("membership_tiers").update({
          stripe_product_id: product.id,
          stripe_price_id: price2.id,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", tier.id).select().single();
        if (updateError) {
          console.error("Error updating tier with Stripe IDs:", updateError);
        } else {
          tier = updatedTier;
        }
      }
    } catch (stripeError) {
      console.error("Stripe integration error:", stripeError);
      return res.status(200).json({
        tier,
        warning: `Tier saved but Stripe integration failed: ${stripeError.message}`
      });
    }
    return res.status(200).json(tier);
  } catch (error) {
    console.error("Error processing membership tier:", error);
    return sendApiError(res, error, 500);
  }
};
var membership_tiers_default = withErrorHandling(handler);
//# sourceMappingURL=membership-tiers.js.map
