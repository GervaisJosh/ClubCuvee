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

// api/utils/validation.ts
var validation_exports = {};
__export(validation_exports, {
  validateEmail: () => validateEmail,
  validatePrice: () => validatePrice,
  validateRequest: () => validateRequest,
  validateRequired: () => validateRequired
});
module.exports = __toCommonJS(validation_exports);
function validateRequired(data, requiredFields) {
  const errors = [];
  for (const field of requiredFields) {
    const value = data[field];
    if (value === void 0 || value === null || value === "") {
      errors.push({
        field,
        message: `${field} is required`
      });
    }
  }
  return errors;
}
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
function validatePrice(price) {
  if (typeof price === "number") {
    return price > 0;
  }
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum > 0;
}
function validateRequest(data, requiredFields, customValidators) {
  const errors = validateRequired(data, requiredFields);
  if (customValidators) {
    for (const [field, validator] of Object.entries(customValidators)) {
      if (data[field] !== void 0 && data[field] !== null) {
        const validationResult = validator(data[field]);
        if (validationResult) {
          errors.push(validationResult);
        }
      }
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateEmail,
  validatePrice,
  validateRequest,
  validateRequired
});
//# sourceMappingURL=validation.js.map
