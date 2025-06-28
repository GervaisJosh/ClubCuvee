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
var import_supabase_js = require("@supabase/supabase-js");
var import_stripe = __toESM(require("stripe"), 1);
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
var withErrorHandler = (handler2) => {
  return async (req, res) => {
    try {
      setCommonHeaders(res);
      if (req.method === "OPTIONS") {
        return res.status(204).end();
      }
      await handler2(req, res);
    } catch (error) {
      errorHandler(error, req, res);
    }
  };
};
var handler = async (req, res) => {
  const supabaseAdmin = (0, import_supabase_js.createClient)(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  const stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
    typescript: true
  });
  if (req.method === "GET") {
    const { data: pricingTiers, error: tiersError } = await supabaseAdmin.from("business_pricing_tiers").select("id, name, monthly_price_cents, stripe_price_id, description, is_active").eq("is_active", true).order("monthly_price_cents", { ascending: true });
    if (tiersError) {
      console.error("Error fetching pricing tiers:", tiersError);
      throw new APIError(500, "Failed to fetch pricing tiers", "DATABASE_ERROR");
    }
    const formattedTiers = pricingTiers.map((tier2) => ({
      id: tier2.id,
      name: tier2.name,
      price: (tier2.monthly_price_cents / 100).toFixed(2),
      price_cents: tier2.monthly_price_cents,
      stripe_price_id: tier2.stripe_price_id,
      description: tier2.description || ""
    }));
    res.status(200).json({
      success: true,
      data: formattedTiers
    });
    return;
  }
  if (req.method !== "POST" && req.method !== "PUT") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const {
    id,
    // Optional: If updating an existing tier
    name,
    // Required: Tier name
    price,
    // Required: Monthly price
    description,
    // Optional: Tier description
    restaurant_id
    // Required: ID of the parent restaurant
  } = req.body;
  if (!name || !price || !restaurant_id) {
    throw new APIError(400, "Missing required fields: name, price, and restaurant_id are required", "VALIDATION_ERROR");
  }
  const priceNumber = parseFloat(price);
  if (isNaN(priceNumber) || priceNumber <= 0) {
    throw new APIError(400, "Price must be a positive number", "VALIDATION_ERROR");
  }
  const { data: restaurant, error: restaurantError } = await supabaseAdmin.from("restaurants").select("name").eq("id", restaurant_id).single();
  if (restaurantError) {
    console.error("Error fetching restaurant:", restaurantError);
    throw new APIError(404, `Restaurant not found: ${restaurantError.message}`, "NOT_FOUND");
  }
  if (!restaurant) {
    throw new APIError(404, `Restaurant with ID ${restaurant_id} not found`, "NOT_FOUND");
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
      throw new APIError(404, `Tier not found: ${fetchError.message}`, "NOT_FOUND");
    }
    existingTier = fetchedTier;
    const { data: updatedTier, error: updateError } = await supabaseAdmin.from("membership_tiers").update(tierData).eq("id", id).select().single();
    if (updateError) {
      throw new APIError(500, `Failed to update tier: ${updateError.message}`, "DATABASE_ERROR");
    }
    tier = updatedTier;
  } else {
    const { data: newTier, error: insertError } = await supabaseAdmin.from("membership_tiers").insert([{
      ...tierData,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }]).select().single();
    if (insertError) {
      throw new APIError(500, `Failed to create tier: ${insertError.message}`, "DATABASE_ERROR");
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
    res.status(200).json({
      tier,
      warning: `Tier saved but Stripe integration failed: ${stripeError.message}`
    });
    return;
  }
  res.status(200).json(tier);
};
var membership_tiers_default = withErrorHandler(handler);
//# sourceMappingURL=membership-tiers.js.map
