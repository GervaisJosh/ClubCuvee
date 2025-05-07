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

// api/restaurant-invite.ts
var import_crypto = require("crypto");
var createInviteSchema = import_zod2.z.object({
  email: import_zod2.z.string().email(),
  restaurantName: import_zod2.z.string().min(1),
  invitedBy: import_zod2.z.string().email()
});
var validateInviteSchema = import_zod2.z.object({
  token: import_zod2.z.string().uuid()
});
var restaurant_invite_default = withErrorHandler(async (req, res) => {
  if (req.method === "POST") {
    const body = createInviteSchema.parse(req.body);
    const token = (0, import_crypto.randomUUID)();
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const { error } = await supabase.from("restaurant_invites").insert([{
      token,
      email: body.email,
      restaurant_name: body.restaurantName,
      invited_by: body.invitedBy,
      status: "pending",
      expires_at: expiresAt.toISOString()
    }]);
    if (error) {
      throw new APIError(500, "Failed to create invite", "DATABASE_ERROR");
    }
    res.status(201).json({ token });
    return;
  }
  if (req.method === "GET") {
    const { token } = validateInviteSchema.parse(req.query);
    const { data, error } = await supabase.from("restaurant_invites").select("*").eq("token", token).single();
    if (error) {
      throw new APIError(500, "Failed to fetch invite", "DATABASE_ERROR");
    }
    if (!data) {
      throw new APIError(404, "Invite not found", "INVITE_NOT_FOUND");
    }
    if (data.status !== "pending") {
      throw new APIError(400, "Invite has already been used", "INVITE_USED");
    }
    if (new Date(data.expires_at) < /* @__PURE__ */ new Date()) {
      throw new APIError(400, "Invite has expired", "INVITE_EXPIRED");
    }
    res.status(200).json({
      email: data.email,
      restaurantName: data.restaurant_name,
      invitedBy: data.invited_by
    });
    return;
  }
  throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
});
//# sourceMappingURL=restaurant-invite.js.map
