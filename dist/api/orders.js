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

// api/orders.ts
var orders_exports = {};
__export(orders_exports, {
  createOrder: () => createOrder,
  getOrderHistory: () => getOrderHistory,
  updateOrderStatus: () => updateOrderStatus
});
module.exports = __toCommonJS(orders_exports);

// src/supabase.ts
var import_supabase_js = require("@supabase/supabase-js");
var import_meta = {};
var SUPABASE_URL = import_meta.env.VITE_SUPABASE_URL;
var SUPABASE_ANON_KEY = import_meta.env.VITE_SUPABASE_ANON_KEY;
var createSupabaseClient = () => {
  if (typeof window === "undefined") {
    return (0, import_supabase_js.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  if (window.__SUPABASE_INSTANCE) {
    return window.__SUPABASE_INSTANCE;
  }
  const instance = (0, import_supabase_js.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.__SUPABASE_INSTANCE = instance;
  return instance;
};
var supabase = createSupabaseClient();

// api/orders.ts
var createOrder = async (userId, wines, totalAmount) => {
  const { data: order, error: orderError } = await supabase.from("orders").insert({ user_id: userId, total_amount: totalAmount, status: "pending" }).single();
  if (orderError) {
    console.error("Error creating order:", orderError);
    return null;
  }
  if (!order) {
    console.error("No order data returned");
    return null;
  }
  const orderWines = wines.map((wine) => ({
    order_id: order.id,
    wine_id: wine.id,
    quantity: wine.quantity
  }));
  const { error: orderWinesError } = await supabase.from("order_wines").insert(orderWines);
  if (orderWinesError) {
    console.error("Error adding wines to order:", orderWinesError);
    return null;
  }
  return order;
};
var getOrderHistory = async (userId) => {
  const { data, error } = await supabase.from("orders").select(
    `
      *,
      order_wines (
        quantity,
        wine_inventory (id, name, price)
      )
      `
  ).eq("user_id", userId);
  if (error) {
    console.error("Error fetching order history:", error);
    return [];
  }
  return data || [];
};
var updateOrderStatus = async (orderId, status) => {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).single();
  if (error) {
    console.error("Error updating order status:", error);
    return null;
  }
  return data;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createOrder,
  getOrderHistory,
  updateOrderStatus
});
//# sourceMappingURL=orders.js.map
