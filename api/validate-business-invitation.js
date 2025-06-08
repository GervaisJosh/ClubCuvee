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

// api/validate-business-invitation.ts
var validate_business_invitation_exports = {};
__export(validate_business_invitation_exports, {
  default: () => validate_business_invitation_default
});
module.exports = __toCommonJS(validate_business_invitation_exports);

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

// api/validate-business-invitation.ts
var validate_business_invitation_default = withErrorHandler(async (req, res) => {
  if (req.method !== "POST") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const { token } = req.body;
  if (!token) {
    throw new APIError(400, "Token is required", "VALIDATION_ERROR");
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(token)) {
    throw new APIError(400, "Invalid token format", "VALIDATION_ERROR");
  }
  const { data, error } = await supabaseAdmin.rpc("validate_business_invitation_token", {
    p_token: token
  });
  if (error) {
    console.error("Error validating business invitation token:", error);
    throw new APIError(500, "Failed to validate invitation token", "DATABASE_ERROR");
  }
  if (!data || data.length === 0) {
    throw new APIError(404, "Invalid or expired invitation token", "NOT_FOUND");
  }
  const tokenData = data[0];
  if (!tokenData.is_valid) {
    let reason = "Invalid invitation token";
    if (tokenData.used) {
      reason = "This invitation has already been used";
    } else if (new Date(tokenData.expires_at) < /* @__PURE__ */ new Date()) {
      reason = "This invitation has expired";
    }
    throw new APIError(400, reason, "VALIDATION_ERROR");
  }
  const { data: inviteDetails, error: detailsError } = await supabaseAdmin.from("business_invites").select("business_name, business_email, pricing_tier, expires_at").eq("token", token).single();
  if (detailsError) {
    console.error("Error fetching invitation details:", detailsError);
    throw new APIError(500, "Failed to fetch invitation details", "DATABASE_ERROR");
  }
  res.status(200).json({
    success: true,
    data: {
      is_valid: true,
      business_name: inviteDetails.business_name,
      business_email: inviteDetails.business_email,
      pricing_tier: inviteDetails.pricing_tier,
      expires_at: inviteDetails.expires_at
    }
  });
});
//# sourceMappingURL=validate-business-invitation.js.map
