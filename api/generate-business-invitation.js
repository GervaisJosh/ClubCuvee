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

// api/generate-business-invitation.ts
var generate_business_invitation_exports = {};
__export(generate_business_invitation_exports, {
  default: () => generate_business_invitation_default
});
module.exports = __toCommonJS(generate_business_invitation_exports);
var import_crypto = require("crypto");
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
var generate_business_invitation_default = withErrorHandler(async (req, res) => {
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
  if (req.method !== "POST") {
    throw new APIError(405, "Method not allowed", "METHOD_NOT_ALLOWED");
  }
  const { business_name, business_email, pricing_tier } = req.body;
  if (!business_name || !business_email) {
    throw new APIError(400, "Business name and email are required", "VALIDATION_ERROR");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(business_email)) {
    throw new APIError(400, "Invalid email format", "VALIDATION_ERROR");
  }
  if (pricing_tier) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pricing_tier)) {
      throw new APIError(400, "Invalid pricing tier ID format", "VALIDATION_ERROR");
    }
    const { data: tierExists, error: tierError } = await supabaseAdmin.from("business_pricing_tiers").select("id").eq("id", pricing_tier).eq("is_active", true).single();
    if (tierError || !tierExists) {
      throw new APIError(400, "Invalid pricing tier selected", "VALIDATION_ERROR");
    }
  }
  const invitationToken = (0, import_crypto.randomUUID)();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3);
  const { data, error } = await supabaseAdmin.from("restaurant_invitations").insert({
    token: invitationToken,
    email: business_email,
    restaurant_name: business_name,
    tier: pricing_tier || "standard",
    expires_at: expiresAt.toISOString(),
    status: "pending"
  }).select("token, expires_at").single();
  if (error) {
    console.error("Error generating restaurant invitation:", error);
    throw new APIError(500, "Failed to generate restaurant invitation", "DATABASE_ERROR");
  }
  if (!data) {
    throw new APIError(500, "Failed to generate invitation token", "DATABASE_ERROR");
  }
  const invitationData = data;
  const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://club-cuvee.com";
  const fullInvitationUrl = `${baseUrl}/onboard/${invitationData.token}`;
  res.status(200).json({
    success: true,
    data: {
      token: invitationData.token,
      invitation_url: fullInvitationUrl,
      expires_at: invitationData.expires_at
    }
  });
});
//# sourceMappingURL=generate-business-invitation.js.map
