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

// api/generate-customer-invitation.ts
var generate_customer_invitation_exports = {};
__export(generate_customer_invitation_exports, {
  default: () => generate_customer_invitation_default
});
module.exports = __toCommonJS(generate_customer_invitation_exports);
var import_supabase_js = require("@supabase/supabase-js");
var import_crypto = __toESM(require("crypto"), 1);
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
    const { businessId, customerEmail } = req.body;
    if (!businessId) {
      return res.status(400).json({ error: "Business ID is required" });
    }
    const { data: business, error: businessError } = await supabaseAdmin.from("businesses").select("id, name").eq("id", businessId).single();
    if (businessError || !business) {
      return res.status(404).json({
        error: "Business not found"
      });
    }
    const token = import_crypto.default.randomBytes(32).toString("hex");
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const invitationData = {
      business_id: businessId,
      token,
      customer_email: customerEmail || null,
      status: "pending",
      expires_at: expiresAt.toISOString(),
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const { data: invitation, error: insertError } = await supabaseAdmin.from("customer_invitations").insert([invitationData]).select().single();
    if (insertError) {
      console.error("Error creating customer invitation:", insertError);
      return res.status(500).json({
        error: "Failed to create customer invitation"
      });
    }
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.BASE_URL || "http://localhost:3000";
    const customerUrl = `${baseUrl}/customer/join/${token}`;
    return res.status(200).json({
      success: true,
      invitation: {
        id: invitation.id,
        token: invitation.token,
        expires_at: invitation.expires_at,
        status: invitation.status,
        business: {
          id: business.id,
          name: business.name
        }
      },
      customerUrl
    });
  } catch (error) {
    console.error("Error in generate-customer-invitation:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
};
var generate_customer_invitation_default = withErrorHandling(handler);
//# sourceMappingURL=generate-customer-invitation.js.map
