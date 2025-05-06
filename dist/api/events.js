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

// api/events.ts
var events_exports = {};
__export(events_exports, {
  createEvent: () => createEvent,
  deleteEvent: () => deleteEvent,
  getEvents: () => getEvents,
  updateEvent: () => updateEvent
});
module.exports = __toCommonJS(events_exports);

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

// api/events.ts
var getEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  return data || [];
};
var createEvent = async (eventData) => {
  const { data, error } = await supabase.from("events").insert(eventData).single();
  if (error) {
    console.error("Error creating event:", error);
    return null;
  }
  return data;
};
var updateEvent = async (id, updates) => {
  const { data, error } = await supabase.from("events").update(updates).eq("id", id).single();
  if (error) {
    console.error("Error updating event:", error);
    return null;
  }
  return data;
};
var deleteEvent = async (id) => {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    console.error("Error deleting event:", error);
    return false;
  }
  return true;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent
});
//# sourceMappingURL=events.js.map
