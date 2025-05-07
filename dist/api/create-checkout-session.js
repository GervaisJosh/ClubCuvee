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

// api/create-checkout-session.ts
var create_checkout_session_exports = {};
__export(create_checkout_session_exports, {
  default: () => create_checkout_session_default
});
module.exports = __toCommonJS(create_checkout_session_exports);
var import_zod2 = require("zod");

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
var errorHandler = (error, req, res) => {
  console.error("API Error:", error);
  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code
      }
    });
  }
  if (error instanceof import_zod.ZodError) {
    return res.status(400).json({
      error: {
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.errors
      }
    });
  }
  if (error instanceof Error && error.name === "StripeError") {
    return res.status(400).json({
      error: {
        message: error.message,
        code: "STRIPE_ERROR"
      }
    });
  }
  return res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR"
    }
  });
};
var withErrorHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      errorHandler(error, req, res);
    }
  };
};

// api/utils/stripe.ts
var import_stripe = __toESM(require("stripe"), 1);
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

// api/utils/supabase.ts
var import_supabase_js = require("@supabase/supabase-js");
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is required");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
}
var supabase = (0, import_supabase_js.createClient)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
var getRestaurantInvite = async (token) => {
  const { data, error } = await supabase.from("restaurant_invites").select("*").eq("token", token).single();
  if (error) {
    throw new APIError(500, "Failed to fetch restaurant invite", "DATABASE_ERROR");
  }
  if (!data) {
    throw new APIError(404, "Invite not found", "INVITE_NOT_FOUND");
  }
  return data;
};
var updateRestaurantInvite = async (token, data) => {
  const { error } = await supabase.from("restaurant_invites").update(data).eq("token", token);
  if (error) {
    throw new APIError(500, "Failed to update restaurant invite", "DATABASE_ERROR");
  }
};

// api/create-checkout-session.ts
var createCheckoutSchema = import_zod2.z.object({
  token: import_zod2.z.string().uuid(),
  membershipTier: import_zod2.z.string()
});
var create_checkout_session_default = withErrorHandler(async (req, res) => {
  if (req.method !== "POST") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const { token, membershipTier } = createCheckoutSchema.parse(req.body);
  const invite = await getRestaurantInvite(token);
  const session = await createCheckoutSession({
    restaurantName: invite.restaurant_name,
    email: invite.email,
    membershipTier,
    successUrl: `${process.env.FRONTEND_URL}/onboarding/${token}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${process.env.FRONTEND_URL}/onboarding/${token}`
  });
  await updateRestaurantInvite(token, {
    status: "in_progress"
  });
  res.status(200).json({
    url: session.url
  });
});
//# sourceMappingURL=create-checkout-session.js.map
