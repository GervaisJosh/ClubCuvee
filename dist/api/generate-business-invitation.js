"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var supabaseAdmin_1 = require("../../lib/supabaseAdmin");
var error_handler_1 = require("./utils/error-handler");
exports.default = (0, error_handler_1.withErrorHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, user, authError, _b, userProfile, profileError, _c, business_name, business_email, pricing_tier, emailRegex, uuidRegex, _d, tierExists, tierError, invitationToken, expiresAt, _e, data, error, invitationData, protocol, host, fullInvitationUrl;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (req.method !== 'POST') {
                    throw new error_handler_1.APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
                }
                authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    throw new error_handler_1.APIError(401, 'Missing or invalid authorization header', 'UNAUTHORIZED');
                }
                token = authHeader.split(' ')[1];
                if (!token) {
                    throw new error_handler_1.APIError(401, 'Invalid authorization token format', 'UNAUTHORIZED');
                }
                return [4 /*yield*/, supabaseAdmin_1.supabaseAdmin.auth.getUser(token)];
            case 1:
                _a = _f.sent(), user = _a.data.user, authError = _a.error;
                if (authError || !user) {
                    console.error('Auth error:', authError);
                    throw new error_handler_1.APIError(401, 'Invalid authentication token', 'UNAUTHORIZED');
                }
                return [4 /*yield*/, supabaseAdmin_1.supabaseAdmin
                        .from('Users')
                        .select('is_admin')
                        .eq('auth_id', user.id)
                        .single()];
            case 2:
                _b = _f.sent(), userProfile = _b.data, profileError = _b.error;
                if (profileError || !userProfile || !userProfile.is_admin) {
                    console.error('Admin check failed:', { profileError: profileError, userProfile: userProfile, userId: user.id });
                    throw new error_handler_1.APIError(403, 'Only admin users can generate business invitations', 'FORBIDDEN');
                }
                _c = req.body, business_name = _c.business_name, business_email = _c.business_email, pricing_tier = _c.pricing_tier;
                // Validate required fields
                if (!business_name || !business_email) {
                    throw new error_handler_1.APIError(400, 'Business name and email are required', 'VALIDATION_ERROR');
                }
                emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(business_email)) {
                    throw new error_handler_1.APIError(400, 'Invalid email format', 'VALIDATION_ERROR');
                }
                if (!pricing_tier) return [3 /*break*/, 4];
                uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                if (!uuidRegex.test(pricing_tier)) {
                    throw new error_handler_1.APIError(400, 'Invalid pricing tier ID format', 'VALIDATION_ERROR');
                }
                return [4 /*yield*/, supabaseAdmin_1.supabaseAdmin
                        .from('business_pricing_tiers')
                        .select('id')
                        .eq('id', pricing_tier)
                        .eq('is_active', true)
                        .single()];
            case 3:
                _d = _f.sent(), tierExists = _d.data, tierError = _d.error;
                if (tierError || !tierExists) {
                    throw new error_handler_1.APIError(400, 'Invalid pricing tier selected', 'VALIDATION_ERROR');
                }
                _f.label = 4;
            case 4:
                invitationToken = (0, crypto_1.randomUUID)();
                expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                return [4 /*yield*/, supabaseAdmin_1.supabaseAdmin
                        .from('restaurant_invitations')
                        .insert({
                        token: invitationToken,
                        email: business_email,
                        restaurant_name: business_name,
                        tier: pricing_tier || 'standard',
                        expires_at: expiresAt.toISOString(),
                        status: 'pending'
                    })
                        .select('token, expires_at')
                        .single()];
            case 5:
                _e = _f.sent(), data = _e.data, error = _e.error;
                if (error) {
                    console.error('Error generating restaurant invitation:', error);
                    throw new error_handler_1.APIError(500, 'Failed to generate restaurant invitation', 'DATABASE_ERROR');
                }
                if (!data) {
                    throw new error_handler_1.APIError(500, 'Failed to generate invitation token', 'DATABASE_ERROR');
                }
                invitationData = data;
                protocol = req.headers['x-forwarded-proto'] || 'http';
                host = req.headers.host;
                fullInvitationUrl = "".concat(protocol, "://").concat(host, "/onboarding/").concat(invitationData.token);
                res.status(200).json({
                    success: true,
                    data: {
                        token: invitationData.token,
                        invitation_url: fullInvitationUrl,
                        expires_at: invitationData.expires_at
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
