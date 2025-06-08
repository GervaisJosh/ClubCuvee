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
var import_supabase_js = require("@supabase/supabase-js");
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
var validate_business_invitation_default = withErrorHandler(async (req, res) => {
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
  if (!["GET", "POST"].includes(req.method)) {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const token = req.method === "GET" ? req.query.token : req.body?.token;
  if (!token) {
    throw new APIError(400, "Token is required", "VALIDATION_ERROR");
  }
  const { data: inviteDetails, error: detailsError } = await supabaseAdmin.from("restaurant_invitations").select("restaurant_name, email, tier, expires_at, status").eq("token", token).single();
  if (detailsError || !inviteDetails) {
    console.error("Error fetching invitation details:", detailsError);
    throw new APIError(404, "Invalid or expired invitation token", "NOT_FOUND");
  }
  if (new Date(inviteDetails.expires_at) < /* @__PURE__ */ new Date()) {
    throw new APIError(400, "This invitation has expired", "VALIDATION_ERROR");
  }
  if (inviteDetails.status === "completed") {
    throw new APIError(400, "This invitation has already been used", "VALIDATION_ERROR");
  }
  let pricing_tier_id = null;
  if (inviteDetails.tier && inviteDetails.tier !== "standard") {
    const { data: tierData, error: tierError } = await supabaseAdmin.from("business_pricing_tiers").select("id").eq("name", inviteDetails.tier).eq("is_active", true).single();
    if (!tierError && tierData) {
      pricing_tier_id = tierData.id;
    }
  }
  res.status(200).json({
    success: true,
    data: {
      is_valid: true,
      business_name: inviteDetails.restaurant_name,
      // Frontend expects business_name
      business_email: inviteDetails.email,
      // Frontend expects business_email  
      pricing_tier: pricing_tier_id,
      // Frontend expects UUID, not tier name
      expires_at: inviteDetails.expires_at
    }
  });
});
//# sourceMappingURL=validate-business-invitation.js.map
