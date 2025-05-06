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

// api/utils/adminUtils.ts
var adminUtils_exports = {};
__export(adminUtils_exports, {
  checkUserAdminStatus: () => checkUserAdminStatus,
  setUserAdminStatus: () => setUserAdminStatus
});
module.exports = __toCommonJS(adminUtils_exports);

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
var checkUserAdminStatus = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("is_admin").eq("local_id", userId).single();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkUserAdminStatus,
  setUserAdminStatus
});
//# sourceMappingURL=adminUtils.js.map
