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

// api/handlers/checkoutHandler.ts
var checkoutHandler_exports = {};
__export(checkoutHandler_exports, {
  createCheckoutSession: () => createCheckoutSession,
  default: () => handler
});
module.exports = __toCommonJS(checkoutHandler_exports);

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

// api/handlers/checkoutHandler.ts
function sendJsonResponse(res, status, data) {
  try {
    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/json");
    }
    return res.status(status).json(data);
  } catch (error) {
    console.error("Error sending JSON response:", error);
    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        status: "error",
        error: "Failed to send response",
        message: "Internal server error"
      });
    }
  }
}
async function createCheckoutSession(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");
  try {
    if (req.method === "OPTIONS") {
      return sendJsonResponse(res, 200, { status: "success" });
    }
    if (req.method !== "POST") {
      return sendJsonResponse(res, 405, {
        status: "error",
        error: "Method not allowed",
        message: "Only POST requests are allowed",
        allowed_methods: ["POST", "OPTIONS"]
      });
    }
    const {
      tierId,
      // ID of membership_tiers row
      priceId,
      // Optional: Direct Stripe price ID
      customerId,
      // ID from your "customers" table
      customerEmail,
      // email for the checkout session
      restaurantId,
      // ID of the restaurant
      successUrl,
      // Redirect URL on success
      cancelUrl,
      // Redirect URL on cancel
      createPrice,
      // Whether to create a new price (rare)
      tierData,
      // Data for creating a new price (rare)
      metadata
      // Additional metadata for the session
    } = req.body;
    const validation = validateRequest(
      req.body,
      ["customerId", "customerEmail", "restaurantId", "successUrl", "cancelUrl"]
    );
    if (!validation.isValid) {
      return sendJsonResponse(res, 400, {
        status: "error",
        error: "Validation failed",
        details: validation.errors
      });
    }
    if (!tierId && !priceId && !createPrice) {
      return sendJsonResponse(res, 400, {
        status: "error",
        error: "Invalid request",
        message: "Either tierId, priceId, or createPrice must be provided"
      });
    }
    let finalPriceId;
    let createdPrice = false;
    if (priceId) {
      finalPriceId = priceId;
    } else if (createPrice && tierData) {
      try {
        const product = await stripe.products.create({
          name: tierData.name || "Membership",
          description: tierData.description || "Custom membership tier",
          metadata: {
            restaurant_id: restaurantId,
            customer_id: customerId,
            temporary: "true"
          }
        });
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(parseFloat(tierData.price) * 100),
          currency: "usd",
          recurring: { interval: "month" },
          metadata: {
            restaurant_id: restaurantId,
            customer_id: customerId,
            temporary: "true"
          }
        });
        finalPriceId = price.id;
        createdPrice = true;
      } catch (err) {
        console.error("Error creating price:", err);
        return sendJsonResponse(res, 500, {
          status: "error",
          error: "Failed to create price",
          message: err.message || "Could not create Stripe price"
        });
      }
    } else if (tierId) {
      const { data: tier, error: tierError } = await supabaseAdmin.from("membership_tiers").select("stripe_price_id").eq("id", tierId).eq("restaurant_id", restaurantId).single();
      if (tierError || !tier) {
        return sendJsonResponse(res, 404, {
          status: "error",
          error: "Tier not found",
          message: tierError?.message || "Could not find membership tier"
        });
      }
      if (!tier.stripe_price_id) {
        return sendJsonResponse(res, 400, {
          status: "error",
          error: "Invalid tier configuration",
          message: "This membership tier is not properly configured for payments"
        });
      }
      finalPriceId = tier.stripe_price_id;
    } else {
      return sendJsonResponse(res, 400, {
        status: "error",
        error: "Invalid request configuration",
        message: "Could not determine price ID"
      });
    }
    const sessionMetadata = {
      restaurant_id: restaurantId,
      customer_id: customerId,
      tier_id: tierId || "custom",
      created_price: createdPrice ? "true" : "false",
      ...metadata || {}
      // Spread any additional metadata from the request
    };
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1
        }
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: sessionMetadata,
      subscription_data: {
        metadata: {
          restaurant_id: restaurantId,
          customer_id: customerId,
          tier_id: tierId || "custom",
          ...metadata || {}
          // Also add metadata to subscription
        }
      }
    });
    return sendJsonResponse(res, 200, {
      status: "success",
      id: session.id,
      url: session.url
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return sendJsonResponse(res, 500, {
      status: "error",
      error: "Internal server error",
      message: error.message || "Failed to create checkout session"
    });
  }
}
async function handler(req, res) {
  if (req.method === "POST") {
    return createCheckoutSession(req, res);
  } else {
    return sendJsonResponse(res, 405, {
      status: "error",
      error: "Method not allowed",
      message: "Only POST requests are allowed",
      allowed_methods: ["POST", "OPTIONS"]
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createCheckoutSession
});
//# sourceMappingURL=checkoutHandler.js.map
