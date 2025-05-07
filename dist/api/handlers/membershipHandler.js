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

// api/handlers/membershipHandler.ts
var membershipHandler_exports = {};
__export(membershipHandler_exports, {
  createInvitationLink: () => createInvitationLink,
  createMembershipTier: () => createMembershipTier,
  default: () => handler,
  updateMembershipTier: () => updateMembershipTier,
  verifyStripeSetup: () => verifyStripeSetup
});
module.exports = __toCommonJS(membershipHandler_exports);

// api/utils/stripeClient.ts
var import_stripe = __toESM(require("stripe"), 1);
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

// api/utils/validation.ts
function validateRequired(data, requiredFields) {
  const errors = [];
  for (const field of requiredFields) {
    const value = data[field];
    if (value === void 0 || value === null || value === "") {
      errors.push({
        field,
        message: `${field} is required`
      });
    }
  }
  return errors;
}
function validatePrice(price) {
  if (typeof price === "number") {
    return price > 0;
  }
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum > 0;
}
function validateRequest(data, requiredFields, customValidators) {
  const errors = validateRequired(data, requiredFields);
  if (customValidators) {
    for (const [field, validator] of Object.entries(customValidators)) {
      if (data[field] !== void 0 && data[field] !== null) {
        const validationResult = validator(data[field]);
        if (validationResult) {
          errors.push(validationResult);
        }
      }
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

// api/utils/errorHandler.ts
var import_zod = require("zod");
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

// api/handlers/membershipHandler.ts
var import_crypto = require("crypto");

// src/utils/priceUtils.ts
function ensurePriceString(price) {
  if (typeof price === "number") {
    return price.toString();
  }
  return price;
}
function ensurePriceNumber(price) {
  if (typeof price === "string") {
    return parseFloat(price);
  }
  return price;
}
function convertPriceToStripeCents(price) {
  const priceNum = typeof price === "string" ? parseFloat(price) : price;
  return Math.round(priceNum * 100);
}

// api/handlers/membershipHandler.ts
async function createMembershipTier(req, res) {
  try {
    const { name, price, description, restaurant_id } = req.body;
    const validation = validateRequest(
      req.body,
      ["name", "price", "restaurant_id"],
      {
        price: (value) => validatePrice(value) ? null : { field: "price", message: "Price must be a positive number" }
      }
    );
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors
      });
    }
    const { data: restaurant, error: restaurantError } = await supabaseAdmin.from("restaurants").select("name").eq("id", restaurant_id).single();
    if (restaurantError || !restaurant) {
      return res.status(404).json({
        error: `Restaurant not found: ${restaurantError?.message || "Unknown error"}`
      });
    }
    const product = await stripe.products.create({
      name: `${restaurant.name} - ${name}`,
      description: description || `${name} membership tier`,
      metadata: {
        restaurant_id
      }
    });
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: convertPriceToStripeCents(price),
      currency: "usd",
      recurring: { interval: "month" },
      metadata: {
        restaurant_id
      }
    });
    const tierData = {
      name,
      price: ensurePriceString(price),
      description: description || "",
      restaurant_id,
      stripe_product_id: product.id,
      stripe_price_id: stripePrice.id,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const { data: tier, error } = await supabaseAdmin.from("membership_tiers").insert([tierData]).select().single();
    if (error) {
      try {
        await stripe.prices.update(stripePrice.id, { active: false });
        await stripe.products.update(product.id, { active: false });
      } catch (cleanupError) {
        console.error("Error cleaning up Stripe resources:", cleanupError);
      }
      return res.status(500).json({
        error: `Database error: ${error.message}`
      });
    }
    try {
      await stripe.products.update(product.id, {
        metadata: { tier_id: tier.id, restaurant_id }
      });
      await stripe.prices.update(stripePrice.id, {
        metadata: { tier_id: tier.id, restaurant_id }
      });
    } catch (metadataError) {
      console.error("Error updating Stripe metadata:", metadataError);
    }
    return res.status(200).json(tier);
  } catch (error) {
    console.error("Error creating membership tier:", error);
    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
}
async function updateMembershipTier(req, res) {
  try {
    const { id, name, price, description, restaurant_id, stripe_product_id, stripe_price_id } = req.body;
    const validation = validateRequest(
      req.body,
      ["id", "name", "price", "restaurant_id"],
      {
        price: (value) => validatePrice(value) ? null : { field: "price", message: "Price must be a positive number" }
      }
    );
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors
      });
    }
    const { data: existingTier, error: fetchError } = await supabaseAdmin.from("membership_tiers").select("*").eq("id", id).eq("restaurant_id", restaurant_id).single();
    if (fetchError || !existingTier) {
      return res.status(404).json({
        error: `Tier not found: ${fetchError?.message || "Unknown error"}`
      });
    }
    const updateData = {
      name,
      price: ensurePriceString(price),
      description: description || "",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (stripe_product_id && stripe_price_id) {
      const hasNameChanged = existingTier.name !== name;
      const hasDescriptionChanged = existingTier.description !== description;
      const hasPriceChanged = ensurePriceNumber(existingTier.price) !== ensurePriceNumber(price);
      try {
        if (hasNameChanged || hasDescriptionChanged) {
          const { data: restaurant } = await supabaseAdmin.from("restaurants").select("name").eq("id", restaurant_id).single();
          if (restaurant) {
            await stripe.products.update(stripe_product_id, {
              name: `${restaurant.name} - ${name}`,
              description: description || `${name} membership tier`
            });
          }
        }
        if (hasPriceChanged) {
          await stripe.prices.update(stripe_price_id, {
            active: false
          });
          const newPrice = await stripe.prices.create({
            product: stripe_product_id,
            unit_amount: convertPriceToStripeCents(price),
            currency: "usd",
            recurring: { interval: "month" },
            metadata: {
              restaurant_id,
              tier_id: id
            }
          });
          updateData.stripe_price_id = newPrice.id;
        }
      } catch (stripeError) {
        console.error("Stripe update error:", stripeError);
        return res.status(200).json({
          warning: `Stripe update failed: ${stripeError.message}`,
          tier: existingTier
        });
      }
    }
    const { data: updatedTier, error: updateError } = await supabaseAdmin.from("membership_tiers").update(updateData).eq("id", id).select().single();
    if (updateError) {
      return res.status(500).json({
        error: `Failed to update tier: ${updateError.message}`
      });
    }
    return res.status(200).json(updatedTier);
  } catch (error) {
    console.error("Error updating membership tier:", error);
    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
}
async function createInvitationLink(req, res) {
  try {
    const { email, restaurant_name, website, admin_name, tier = "standard" } = req.body;
    const validation = validateRequest(
      req.body,
      ["email", "restaurant_name"],
      {
        email: (value) => {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(value) ? null : { field: "email", message: "Invalid email format" };
        }
      }
    );
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors
      });
    }
    const { data: existingUser, error: userError } = await supabaseAdmin.from("restaurants").select("id").eq("admin_email", email).maybeSingle();
    if (existingUser) {
      return res.status(400).json({
        error: "This email is already associated with a restaurant account"
      });
    }
    const token = (0, import_crypto.randomUUID)();
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const invitationData = {
      token,
      email,
      restaurant_name,
      website: website || "",
      admin_name: admin_name || "",
      tier,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      expires_at: expiresAt.toISOString(),
      status: "pending"
    };
    const { data: invitation, error: inviteError } = await supabaseAdmin.from("restaurant_invitations").insert([invitationData]).select().single();
    if (inviteError) {
      return res.status(500).json({
        error: `Failed to create invitation: ${inviteError.message}`
      });
    }
    const deployUrl = process.env.VERCEL_URL || process.env.FRONTEND_URL;
    const baseUrl = deployUrl ? deployUrl.startsWith("http") ? deployUrl : `https://${deployUrl}` : "https://your-deployment-url.vercel.app";
    const invitationUrl = `${baseUrl}/onboarding/${token}`;
    return res.status(200).json({
      success: true,
      invitation: {
        id: invitation.id,
        token: invitation.token,
        email: invitation.email,
        restaurant_name: invitation.restaurant_name,
        status: invitation.status,
        expires_at: invitation.expires_at,
        created_at: invitation.created_at
      },
      invitation_url: invitationUrl,
      // email_sent: emailSent || false, // Would be included if email sending was implemented
      message: "Invitation created successfully"
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
}
async function verifyStripeSetup(req, res) {
  try {
    const stripeSecretKey2 = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey2) {
      const configError = new Error("Missing Stripe configuration. STRIPE_SECRET_KEY is not set in environment variables.");
      Object.assign(configError, {
        type: "ConfigurationError",
        config: {
          STRIPE_SECRET_KEY: "missing",
          STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? "configured" : "missing",
          VITE_STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? "configured" : "missing"
        }
      });
      return sendApiError(res, configError, 500, true);
    }
    const balance = await stripe.balance.retrieve();
    const configStatus = {
      STRIPE_SECRET_KEY: "configured",
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET ? "configured" : "missing",
      VITE_STRIPE_PUBLIC_KEY: !!(process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY) ? "configured" : "missing"
    };
    return res.status(200).json({
      status: "success",
      message: "Stripe API connection successful",
      livemode: balance.livemode,
      config: configStatus,
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
    });
  } catch (error) {
    const statusCode = getErrorStatusCodeForStripe(error);
    return sendApiError(res, error, statusCode, true);
  }
}
function getErrorStatusCodeForStripe(error) {
  if (error.type === "StripeAuthenticationError") {
    return 401;
  } else if (error.type === "StripeConnectionError") {
    return 503;
  } else if (error.type === "StripeAPIError") {
    return 502;
  } else if (error.type === "StripeInvalidRequestError") {
    return 400;
  } else if (error.type === "StripeRateLimitError") {
    return 429;
  } else if (error.type === "ConfigurationError") {
    return 500;
  }
  return 500;
}
async function handler(req, res) {
  if (req.method === "POST" && req.url?.includes("/invite")) {
    return createInvitationLink(req, res);
  } else if (req.method === "POST") {
    return createMembershipTier(req, res);
  } else if (req.method === "PUT") {
    return updateMembershipTier(req, res);
  } else if (req.method === "GET" && req.url?.includes("/verify-stripe")) {
    return verifyStripeSetup(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createInvitationLink,
  createMembershipTier,
  updateMembershipTier,
  verifyStripeSetup
});
//# sourceMappingURL=membershipHandler.js.map
