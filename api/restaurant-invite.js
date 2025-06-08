// @ts-nocheck

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/restaurant-invite.ts
var restaurant_invite_exports = {};
__export(restaurant_invite_exports, {
  default: () => restaurant_invite_default
});
module.exports = __toCommonJS(restaurant_invite_exports);
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
var withErrorHandler = (handler) => {
  return async (req, res) => {
    try {
      setCommonHeaders(res);
      if (req.method === "OPTIONS") {
        return res.status(204).end();
      }
      await handler(req, res);
    } catch (error) {
      errorHandler(error, req, res);
    }
  };
};

// src/lib/supabase.ts
var import_supabase_js = require("@supabase/supabase-js");
var import_meta = {};
var requiredEnvVars = {
  VITE_SUPABASE_URL: import_meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import_meta.env.VITE_SUPABASE_ANON_KEY
};
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
var createSupabaseClient = () => {
  if (typeof window === "undefined") {
    return (0, import_supabase_js.createClient)(
      requiredEnvVars.VITE_SUPABASE_URL,
      requiredEnvVars.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    );
  }
  if (window.__SUPABASE_INSTANCE) {
    return window.__SUPABASE_INSTANCE;
  }
  const instance = (0, import_supabase_js.createClient)(
    requiredEnvVars.VITE_SUPABASE_URL,
    requiredEnvVars.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  );
  window.__SUPABASE_INSTANCE = instance;
  return instance;
};
var supabase = createSupabaseClient();

// src/lib/services/inviteService.ts
var import_crypto = require("crypto");
async function createInvite(email, tier) {
  const token = (0, import_crypto.randomUUID)();
  const created_at = /* @__PURE__ */ new Date();
  const expires_at = new Date(created_at.getTime() + 24 * 60 * 60 * 1e3);
  const { error } = await supabase.from("restaurant_invites").insert([
    {
      token,
      email,
      tier,
      created_at: created_at.toISOString(),
      expires_at: expires_at.toISOString(),
      used: false
    }
  ]);
  if (error) {
    throw new Error("Failed to create invite: " + error.message);
  }
  return {
    token,
    email,
    tier,
    created_at: created_at.toISOString(),
    expires_at: expires_at.toISOString(),
    used: false
  };
}

// api/restaurant-invite.ts
var createInviteSchema = import_zod2.z.object({
  email: import_zod2.z.string().email(),
  tier: import_zod2.z.string().min(1)
});
var ALLOWED_TIERS = ["Neighborhood Cellar", "World Class"];
var restaurant_invite_default = withErrorHandler(async (req, res) => {
  if (req.method !== "POST") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const isAdmin = req.headers["x-admin-auth"] === process.env.ADMIN_SECRET;
  if (!isAdmin) {
    throw new APIError(401, "Unauthorized", "UNAUTHORIZED");
  }
  const body = createInviteSchema.safeParse(req.body);
  if (!body.success) {
    throw new APIError(400, "Invalid request data", "VALIDATION_ERROR");
  }
  const { email, tier } = body.data;
  if (!ALLOWED_TIERS.includes(tier)) {
    throw new APIError(400, "Invalid tier", "INVALID_TIER");
  }
  const invite = await createInvite(email, tier);
  const inviteLink = `https://clubcuvee.com/restaurant/register?token=${invite.token}`;
  res.status(201).json({ success: true, inviteLink, expiresAt: invite.expires_at });
});
//# sourceMappingURL=restaurant-invite.js.map
