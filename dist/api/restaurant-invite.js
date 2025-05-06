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
  default: () => handler
});
module.exports = __toCommonJS(restaurant_invite_exports);
var import_crypto = require("crypto");

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

// api/restaurant-invite.ts
function sendJsonResponse(res, status, data) {
  try {
    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/json");
    }
    return res.status(status).send(JSON.stringify(data));
  } catch (error) {
    console.error("Error sending JSON response:", error);
    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).send(JSON.stringify({
        status: "error",
        error: "Failed to send response",
        message: "Internal server error"
      }));
    }
  }
}
async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return sendJsonResponse(res, 200, { status: "success" });
    }
    if (req.method !== "POST") {
      return sendJsonResponse(res, 405, {
        status: "error",
        error: "Method not allowed",
        allowed_methods: ["POST", "OPTIONS"]
      });
    }
    if (!req.body || typeof req.body !== "object") {
      return sendJsonResponse(res, 400, {
        status: "error",
        error: "Invalid request body",
        message: "Request body must be a valid JSON object"
      });
    }
    let { email, restaurant_name, website, admin_name, tier } = req.body;
    tier = tier || "standard";
    const validationErrors = {};
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (typeof email !== "string") {
      validationErrors.email = "Email must be a string";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!restaurant_name) {
      validationErrors.restaurant_name = "Restaurant name is required";
    } else if (typeof restaurant_name !== "string") {
      validationErrors.restaurant_name = "Restaurant name must be a string";
    }
    if (Object.keys(validationErrors).length > 0) {
      return sendJsonResponse(res, 400, {
        status: "error",
        error: "Validation failed",
        details: validationErrors
      });
    }
    const { data: existingUser, error: userError } = await supabaseAdmin.from("restaurants").select("id").eq("admin_email", email).maybeSingle();
    if (userError) {
      console.error("Database error checking existing user:", userError);
      return sendJsonResponse(res, 500, {
        status: "error",
        error: "Failed to verify email",
        message: "Internal database error"
      });
    }
    if (existingUser) {
      return sendJsonResponse(res, 400, {
        status: "error",
        error: "Email already in use",
        message: "This email is already associated with a restaurant account"
      });
    }
    const token = (0, import_crypto.randomUUID)();
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const invitationData = {
      token,
      email,
      restaurant_name,
      website: website || "",
      admin_name: admin_name || "",
      tier,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      expires_at: expiresAt.toISOString(),
      status: "pending"
    };
    const { data: invitation, error: inviteError } = await supabaseAdmin.from("restaurant_invitations").insert([invitationData]).select().single();
    if (inviteError) {
      console.error("Database error creating invitation:", inviteError);
      return sendJsonResponse(res, 500, {
        status: "error",
        error: "Failed to create invitation",
        message: inviteError.message || "Internal database error"
      });
    }
    const deployUrl = process.env.VERCEL_URL || process.env.FRONTEND_URL;
    const baseUrl = deployUrl ? deployUrl.startsWith("http") ? deployUrl : `https://${deployUrl}` : "https://clubcuvee.com";
    const invitationUrl = `${baseUrl}/onboarding/${token}`;
    return sendJsonResponse(res, 200, {
      status: "success",
      message: "Invitation created successfully",
      invitation: {
        id: invitation.id,
        token: invitation.token,
        email: invitation.email,
        restaurant_name: invitation.restaurant_name,
        status: invitation.status,
        expires_at: invitation.expires_at,
        created_at: invitation.created_at
      },
      invitation_url: invitationUrl
    });
  } catch (error) {
    console.error("Error in restaurant-invite endpoint:", error);
    return sendJsonResponse(res, 500, {
      status: "error",
      error: "Internal server error",
      message: error.message || "An unexpected error occurred",
      details: false ? {
        error: error.message,
        name: error.name,
        code: error.code,
        hint: error.hint
      } : void 0
    });
  }
}
//# sourceMappingURL=restaurant-invite.js.map
