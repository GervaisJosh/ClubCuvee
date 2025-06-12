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

// api/get-business-by-token.ts
var get_business_by_token_exports = {};
__export(get_business_by_token_exports, {
  default: () => get_business_by_token_default
});
module.exports = __toCommonJS(get_business_by_token_exports);
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
  return res.status(500).json({
    status: "error",
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR"
    }
  });
};
var withErrorHandling = (handler2) => {
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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }
    const { data: invitation, error: invitationError } = await supabaseAdmin.from("restaurant_invitations").select("*").eq("token", token).eq("status", "completed").single();
    if (invitationError || !invitation) {
      return res.status(404).json({
        error: "Invitation not found or not completed"
      });
    }
    const { data: business, error: businessError } = await supabaseAdmin.from("businesses").select("id, name, website, email, status, created_at, updated_at").eq("id", invitation.business_id).single();
    if (businessError || !business) {
      return res.status(404).json({
        error: "Business not found"
      });
    }
    const { data: membershipTiers, error: tiersError } = await supabaseAdmin.from("membership_tiers").select("*").eq("business_id", business.id).order("created_at", { ascending: true });
    if (tiersError) {
      console.error("Error fetching membership tiers:", tiersError);
      return res.status(500).json({
        error: "Failed to fetch membership tiers"
      });
    }
    const response = {
      business: {
        id: business.id,
        name: business.name,
        website: business.website,
        email: business.email,
        status: business.status,
        created_at: business.created_at
      },
      membershipTiers: membershipTiers || [],
      invitation: {
        id: invitation.id,
        status: invitation.status,
        created_at: invitation.created_at
      }
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in get-business-by-token:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
};
var get_business_by_token_default = withErrorHandling(handler);
//# sourceMappingURL=get-business-by-token.js.map
