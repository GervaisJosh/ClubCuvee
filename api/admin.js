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

// api/admin.ts
var admin_exports = {};
__export(admin_exports, {
  default: () => handler
});
module.exports = __toCommonJS(admin_exports);

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

// api/utils/adminUtils.ts
var setUserAdminStatus = async (userId, isAdmin) => {
  try {
    const { data, error } = await supabaseAdmin.from("users").update({ is_admin: isAdmin }).eq("local_id", userId).select().single();
    if (error) {
      return {
        success: false,
        error: `Failed to update admin status: ${error.message}`
      };
    }
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: `An unexpected error occurred: ${error.message}`
    };
  }
};
var checkUserAdminStatus = async (authId) => {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("is_admin").eq("auth_id", authId).single();
    if (error) {
      return {
        success: false,
        isAdmin: false,
        error: `Failed to check admin status: ${error.message}`
      };
    }
    return {
      success: true,
      isAdmin: !!data?.is_admin
    };
  } catch (error) {
    return {
      success: false,
      isAdmin: false,
      error: `An unexpected error occurred: ${error.message}`
    };
  }
};

// api/admin.ts
async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Invalid token format" });
  }
  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    switch (req.method) {
      case "GET":
        const checkResult = await checkUserAdminStatus(user.id);
        return res.status(checkResult.success ? 200 : 400).json(checkResult);
      case "POST":
        const { userId, isAdmin } = req.body;
        if (!userId || isAdmin === void 0) {
          return res.status(400).json({ error: "Bad Request: Missing userId or isAdmin parameter" });
        }
        const { data: existingAdmins } = await supabaseAdmin.from("users").select("local_id").eq("is_admin", true).limit(1);
        const isFirstAdmin = existingAdmins?.length === 0;
        if (!isFirstAdmin) {
          const adminCheck = await checkUserAdminStatus(user.id);
          if (!adminCheck.isAdmin) {
            return res.status(403).json({ error: "Forbidden: Only admins can modify admin status" });
          }
        }
        const result = await setUserAdminStatus(userId, isAdmin);
        return res.status(result.success ? 200 : 400).json(result);
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in admin endpoint:", error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
//# sourceMappingURL=admin.js.map
