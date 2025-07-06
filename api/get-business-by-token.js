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
  console.log("=== GET BUSINESS BY TOKEN DEBUG ===");
  console.log("Request method:", req.method);
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  console.log("Environment check:", {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });
  if (req.method !== "POST") {
    console.log("\u274C Method not allowed:", req.method);
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { token } = req.body;
    console.log("Token received:", token);
    if (!token) {
      console.log("\u274C No token provided");
      res.status(400).json({ error: "Token is required" });
      return;
    }
    console.log("\u{1F50D} Querying restaurant_invitations for token:", token);
    const { data: invitation, error: invitationError } = await supabaseAdmin.from("restaurant_invitations").select("*").eq("token", token).in("status", ["paid", "completed"]).single();
    console.log("Invitation query result:", {
      invitation: invitation ? {
        id: invitation.id,
        restaurant_name: invitation.restaurant_name,
        email: invitation.email,
        status: invitation.status,
        business_id: invitation.business_id,
        token: invitation.token
      } : null,
      error: invitationError
    });
    if (invitationError || !invitation) {
      console.log("\u274C Invitation not found or not completed");
      const { data: anyInvitation, error: anyError } = await supabaseAdmin.from("restaurant_invitations").select("*").eq("token", token).single();
      console.log("Debug - Any invitation with this token:", {
        invitation: anyInvitation,
        error: anyError
      });
      res.status(404).json({
        error: "Invitation not found or not in paid/completed status",
        debug: {
          tokenProvided: token,
          invitationFound: !!anyInvitation,
          invitationStatus: anyInvitation?.status,
          hasBusinessId: !!anyInvitation?.business_id,
          expectedStatuses: ["paid", "completed"]
        }
      });
      return;
    }
    console.log("\u2705 Found invitation, checking business_id:", invitation.business_id);
    if (!invitation.business_id) {
      console.log("\u26A0\uFE0F No business_id yet - invitation exists but business not created");
      res.status(200).json({
        invitation: {
          id: invitation.id,
          email: invitation.email,
          restaurant_name: invitation.restaurant_name,
          status: invitation.status,
          created_at: invitation.created_at
        },
        business: null,
        membershipTiers: [],
        message: "Invitation found but business not created yet"
      });
      return;
    }
    console.log("\u{1F50D} Querying businesses table for business_id:", invitation.business_id);
    const { data: business, error: businessError } = await supabaseAdmin.from("businesses").select("id, name, slug, website, email, status, created_at, updated_at, pricing_tier_id, logo_url").eq("id", invitation.business_id).single();
    console.log("Business query result:", {
      business: business ? {
        id: business.id,
        name: business.name,
        email: business.email,
        status: business.status
      } : null,
      error: businessError
    });
    if (businessError || !business) {
      console.log("\u274C Business not found for business_id:", invitation.business_id);
      res.status(404).json({
        error: "Business not found",
        debug: {
          business_id: invitation.business_id,
          businessError
        }
      });
      return;
    }
    let pricingTierName = "Unknown";
    if (business.pricing_tier_id) {
      const { data: pricingTier, error: pricingTierError } = await supabaseAdmin.from("business_pricing_tiers").select("name").eq("id", business.pricing_tier_id).single();
      if (!pricingTierError && pricingTier) {
        pricingTierName = pricingTier.name;
      }
    }
    console.log("\u{1F50D} Querying membership_tiers for business_id:", business.id);
    const { data: membershipTiers, error: tiersError } = await supabaseAdmin.from("membership_tiers").select("id, name, description, monthly_price_cents, stripe_product_id, stripe_price_id, created_at, benefits, image_url").eq("business_id", business.id).order("created_at", { ascending: true });
    console.log("Membership tiers query result:", {
      tierCount: membershipTiers?.length || 0,
      tiers: membershipTiers?.map((t) => ({ id: t.id, name: t.name, price: t.monthly_price_cents })) || [],
      error: tiersError
    });
    if (tiersError) {
      console.error("\u274C Error fetching membership tiers:", tiersError);
      res.status(500).json({
        error: "Failed to fetch membership tiers",
        debug: { tiersError }
      });
      return;
    }
    const response = {
      business: {
        id: business.id,
        name: business.name,
        slug: business.slug,
        // Include the slug from the database
        website: business.website,
        admin_email: business.email,
        logo_url: business.logo_url || null,
        subscription_tier: pricingTierName,
        created_at: business.created_at
      },
      membershipTiers: (membershipTiers || []).map((tier) => ({
        id: tier.id,
        name: tier.name,
        price: (tier.monthly_price_cents / 100).toFixed(2),
        // Convert cents to dollars as string
        description: tier.description,
        benefits: tier.benefits || [],
        stripe_product_id: tier.stripe_product_id || "",
        stripe_price_id: tier.stripe_price_id || "",
        created_at: tier.created_at,
        image_url: tier.image_url || null
      })),
      invitation: {
        id: invitation.id,
        status: invitation.status,
        created_at: invitation.created_at
      }
    };
    console.log("\u2705 Sending successful response:", {
      businessName: response.business.name,
      tierCount: response.membershipTiers.length,
      invitationStatus: response.invitation.status
    });
    res.status(200).json(response);
    return;
  } catch (error) {
    console.error("\u274C Error in get-business-by-token:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      stack: error.stack
    });
    return;
  }
};
var get_business_by_token_default = withErrorHandling(handler);
//# sourceMappingURL=get-business-by-token.js.map
