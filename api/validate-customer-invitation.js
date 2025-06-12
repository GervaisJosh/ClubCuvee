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

// api/validate-customer-invitation.ts
var validate_customer_invitation_exports = {};
__export(validate_customer_invitation_exports, {
  default: () => validate_customer_invitation_default
});
module.exports = __toCommonJS(validate_customer_invitation_exports);
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
    const { data: invitation, error: invitationError } = await supabaseAdmin.from("customer_invitations").select(`
        *,
        businesses!inner (
          id,
          name,
          website,
          logo_url
        )
      `).eq("token", token).eq("status", "pending").single();
    if (invitationError || !invitation) {
      return res.status(404).json({
        error: "Invalid or expired customer invitation"
      });
    }
    const now = /* @__PURE__ */ new Date();
    const expiryDate = new Date(invitation.expires_at);
    if (now > expiryDate) {
      await supabaseAdmin.from("customer_invitations").update({
        status: "expired",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("token", token);
      return res.status(410).json({
        error: "This invitation has expired"
      });
    }
    const business = invitation.businesses;
    const { data: membershipTiers, error: tiersError } = await supabaseAdmin.from("membership_tiers").select("*").eq("restaurant_id", business.id).eq("is_active", true).order("price", { ascending: true });
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
        logo_url: business.logo_url
      },
      membershipTiers: membershipTiers?.map((tier) => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        description: tier.description,
        stripe_price_id: tier.stripe_price_id
      })) || [],
      invitation: {
        id: invitation.id,
        expires_at: invitation.expires_at,
        status: invitation.status
      }
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in validate-customer-invitation:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
};
var validate_customer_invitation_default = withErrorHandling(handler);
//# sourceMappingURL=validate-customer-invitation.js.map
