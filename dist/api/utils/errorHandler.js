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

// api/utils/errorHandler.ts
var errorHandler_exports = {};
__export(errorHandler_exports, {
  formatApiError: () => formatApiError,
  getErrorStatusCode: () => getErrorStatusCode,
  sendApiError: () => sendApiError,
  withErrorHandling: () => withErrorHandling
});
module.exports = __toCommonJS(errorHandler_exports);
function formatApiError(error, includeDetails = false) {
  const errorResponse = {
    status: "error",
    error: error.message || "Internal server error"
  };
  if (error.type) {
    errorResponse.type = error.type;
  }
  if (error.code || error.statusCode) {
    errorResponse.code = error.code || error.statusCode;
  }
  const deployUrl = process.env.VERCEL_URL || process.env.FRONTEND_URL;
  if (deployUrl) {
    errorResponse.deployment_url = deployUrl.startsWith("http") ? deployUrl : `https://${deployUrl}`;
  }
  if (includeDetails || false) {
    errorResponse.errorDetails = {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack,
      // Additional properties that might be useful
      name: error.name,
      cause: error.cause
    };
  }
  return errorResponse;
}
function sendApiError(res, error, statusCode = 500, includeDetails = false) {
  console.error(`API Error (${statusCode}):`, error);
  res.status(statusCode).json(formatApiError(error, includeDetails));
}
function getErrorStatusCode(error) {
  if (error.type === "StripeAuthenticationError" || error.message?.toLowerCase().includes("authentication") || error.message?.toLowerCase().includes("api key") || error.code === "auth_error") {
    return 401;
  }
  if (error.type === "StripeInvalidRequestError" || error.message?.toLowerCase().includes("validation") || error.message?.toLowerCase().includes("invalid")) {
    return 400;
  }
  if (error.type === "StripeInvalidRequestError" && error.message?.toLowerCase().includes("no such") || error.code === "resource_missing") {
    return 404;
  }
  if (error.type === "StripeRateLimitError" || error.code === "rate_limit_exceeded") {
    return 429;
  }
  if (error.type === "StripeAPIError" || error.type === "StripeConnectionError") {
    return 502;
  }
  return 500;
}
function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      const statusCode = getErrorStatusCode(error);
      sendApiError(res, error, statusCode);
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatApiError,
  getErrorStatusCode,
  sendApiError,
  withErrorHandling
});
//# sourceMappingURL=errorHandler.js.map
