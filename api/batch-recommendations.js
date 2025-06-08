// @ts-nocheck

"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/runtime.js
var require_runtime = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/runtime.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TextApiResponse = exports2.BlobApiResponse = exports2.VoidApiResponse = exports2.JSONApiResponse = exports2.canConsumeForm = exports2.mapValues = exports2.querystring = exports2.exists = exports2.COLLECTION_FORMATS = exports2.RequiredError = exports2.FetchError = exports2.ResponseError = exports2.BaseAPI = exports2.DefaultConfig = exports2.Configuration = exports2.BASE_PATH = void 0;
    exports2.BASE_PATH = "https://api.pinecone.io".replace(/\/+$/, "");
    var Configuration = (
      /** @class */
      function() {
        function Configuration2(configuration) {
          if (configuration === void 0) {
            configuration = {};
          }
          this.configuration = configuration;
        }
        Object.defineProperty(Configuration2.prototype, "config", {
          set: function(configuration) {
            this.configuration = configuration;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "basePath", {
          get: function() {
            return this.configuration.basePath != null ? this.configuration.basePath : exports2.BASE_PATH;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "fetchApi", {
          get: function() {
            return this.configuration.fetchApi;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "middleware", {
          get: function() {
            return this.configuration.middleware || [];
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "queryParamsStringify", {
          get: function() {
            return this.configuration.queryParamsStringify || querystring;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "username", {
          get: function() {
            return this.configuration.username;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "password", {
          get: function() {
            return this.configuration.password;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "apiKey", {
          get: function() {
            var apiKey = this.configuration.apiKey;
            if (apiKey) {
              return typeof apiKey === "function" ? apiKey : function() {
                return apiKey;
              };
            }
            return void 0;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "accessToken", {
          get: function() {
            var _this = this;
            var accessToken = this.configuration.accessToken;
            if (accessToken) {
              return typeof accessToken === "function" ? accessToken : function() {
                return __awaiter(_this, void 0, void 0, function() {
                  return __generator(this, function(_a) {
                    return [2, accessToken];
                  });
                });
              };
            }
            return void 0;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "headers", {
          get: function() {
            return this.configuration.headers;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "credentials", {
          get: function() {
            return this.configuration.credentials;
          },
          enumerable: false,
          configurable: true
        });
        return Configuration2;
      }()
    );
    exports2.Configuration = Configuration;
    exports2.DefaultConfig = new Configuration();
    var BaseAPI = (
      /** @class */
      function() {
        function BaseAPI2(configuration) {
          if (configuration === void 0) {
            configuration = exports2.DefaultConfig;
          }
          var _this = this;
          this.configuration = configuration;
          this.fetchApi = function(url, init) {
            return __awaiter(_this, void 0, void 0, function() {
              var fetchParams, _i, _a, middleware, response, e_1, _b, _c, middleware, _d, _e, middleware;
              return __generator(this, function(_f) {
                switch (_f.label) {
                  case 0:
                    fetchParams = { url, init };
                    _i = 0, _a = this.middleware;
                    _f.label = 1;
                  case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    middleware = _a[_i];
                    if (!middleware.pre) return [3, 3];
                    return [4, middleware.pre(__assign({ fetch: this.fetchApi }, fetchParams))];
                  case 2:
                    fetchParams = _f.sent() || fetchParams;
                    _f.label = 3;
                  case 3:
                    _i++;
                    return [3, 1];
                  case 4:
                    response = void 0;
                    _f.label = 5;
                  case 5:
                    _f.trys.push([5, 7, , 12]);
                    return [4, (this.configuration.fetchApi || fetch)(fetchParams.url, fetchParams.init)];
                  case 6:
                    response = _f.sent();
                    return [3, 12];
                  case 7:
                    e_1 = _f.sent();
                    _b = 0, _c = this.middleware;
                    _f.label = 8;
                  case 8:
                    if (!(_b < _c.length)) return [3, 11];
                    middleware = _c[_b];
                    if (!middleware.onError) return [3, 10];
                    return [4, middleware.onError({
                      fetch: this.fetchApi,
                      url: fetchParams.url,
                      init: fetchParams.init,
                      error: e_1,
                      response: response ? response.clone() : void 0
                    })];
                  case 9:
                    response = _f.sent() || response;
                    _f.label = 10;
                  case 10:
                    _b++;
                    return [3, 8];
                  case 11:
                    if (response === void 0) {
                      if (e_1 instanceof Error) {
                        throw new FetchError(e_1, "The request failed and the interceptors did not return an alternative response");
                      } else {
                        throw e_1;
                      }
                    }
                    return [3, 12];
                  case 12:
                    _d = 0, _e = this.middleware;
                    _f.label = 13;
                  case 13:
                    if (!(_d < _e.length)) return [3, 16];
                    middleware = _e[_d];
                    if (!middleware.post) return [3, 15];
                    return [4, middleware.post({
                      fetch: this.fetchApi,
                      url: fetchParams.url,
                      init: fetchParams.init,
                      response: response.clone()
                    })];
                  case 14:
                    response = _f.sent() || response;
                    _f.label = 15;
                  case 15:
                    _d++;
                    return [3, 13];
                  case 16:
                    return [2, response];
                }
              });
            });
          };
          this.middleware = configuration.middleware;
        }
        BaseAPI2.prototype.withMiddleware = function() {
          var _a;
          var middlewares = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            middlewares[_i] = arguments[_i];
          }
          var next = this.clone();
          next.middleware = (_a = next.middleware).concat.apply(_a, middlewares);
          return next;
        };
        BaseAPI2.prototype.withPreMiddleware = function() {
          var preMiddlewares = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            preMiddlewares[_i] = arguments[_i];
          }
          var middlewares = preMiddlewares.map(function(pre) {
            return { pre };
          });
          return this.withMiddleware.apply(this, middlewares);
        };
        BaseAPI2.prototype.withPostMiddleware = function() {
          var postMiddlewares = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            postMiddlewares[_i] = arguments[_i];
          }
          var middlewares = postMiddlewares.map(function(post) {
            return { post };
          });
          return this.withMiddleware.apply(this, middlewares);
        };
        BaseAPI2.prototype.isJsonMime = function(mime) {
          if (!mime) {
            return false;
          }
          return BaseAPI2.jsonRegex.test(mime);
        };
        BaseAPI2.prototype.request = function(context, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var _a, url, init, response;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, this.createFetchParams(context, initOverrides)];
                case 1:
                  _a = _b.sent(), url = _a.url, init = _a.init;
                  return [4, this.fetchApi(url, init)];
                case 2:
                  response = _b.sent();
                  if (response && (response.status >= 200 && response.status < 300)) {
                    return [2, response];
                  }
                  throw new ResponseError(response, "Response returned an error code");
              }
            });
          });
        };
        BaseAPI2.prototype.createFetchParams = function(context, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var url, headers, initOverrideFn, initParams, overriddenInit, _a, body, init;
            var _this = this;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  url = this.configuration.basePath + context.path;
                  if (context.query !== void 0 && Object.keys(context.query).length !== 0) {
                    url += "?" + this.configuration.queryParamsStringify(context.query);
                  }
                  headers = Object.assign({}, this.configuration.headers, context.headers);
                  Object.keys(headers).forEach(function(key) {
                    return headers[key] === void 0 ? delete headers[key] : {};
                  });
                  initOverrideFn = typeof initOverrides === "function" ? initOverrides : function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      return __generator(this, function(_a2) {
                        return [2, initOverrides];
                      });
                    });
                  };
                  initParams = {
                    method: context.method,
                    headers,
                    body: context.body,
                    credentials: this.configuration.credentials
                  };
                  _a = [__assign({}, initParams)];
                  return [4, initOverrideFn({
                    init: initParams,
                    context
                  })];
                case 1:
                  overriddenInit = __assign.apply(void 0, _a.concat([_b.sent()]));
                  if (isFormData(overriddenInit.body) || overriddenInit.body instanceof URLSearchParams || isBlob(overriddenInit.body)) {
                    body = overriddenInit.body;
                  } else if (this.isJsonMime(headers["Content-Type"])) {
                    body = JSON.stringify(overriddenInit.body);
                  } else {
                    body = overriddenInit.body;
                  }
                  init = __assign(__assign({}, overriddenInit), { body });
                  return [2, { url, init }];
              }
            });
          });
        };
        BaseAPI2.prototype.clone = function() {
          var constructor = this.constructor;
          var next = new constructor(this.configuration);
          next.middleware = this.middleware.slice();
          return next;
        };
        BaseAPI2.jsonRegex = new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$", "i");
        return BaseAPI2;
      }()
    );
    exports2.BaseAPI = BaseAPI;
    function isBlob(value) {
      return typeof Blob !== "undefined" && value instanceof Blob;
    }
    function isFormData(value) {
      return typeof FormData !== "undefined" && value instanceof FormData;
    }
    var ResponseError = (
      /** @class */
      function(_super) {
        __extends(ResponseError2, _super);
        function ResponseError2(response, msg) {
          var _this = _super.call(this, msg) || this;
          _this.response = response;
          _this.name = "ResponseError";
          return _this;
        }
        return ResponseError2;
      }(Error)
    );
    exports2.ResponseError = ResponseError;
    var FetchError = (
      /** @class */
      function(_super) {
        __extends(FetchError2, _super);
        function FetchError2(cause, msg) {
          var _this = _super.call(this, msg) || this;
          _this.cause = cause;
          _this.name = "FetchError";
          return _this;
        }
        return FetchError2;
      }(Error)
    );
    exports2.FetchError = FetchError;
    var RequiredError = (
      /** @class */
      function(_super) {
        __extends(RequiredError2, _super);
        function RequiredError2(field, msg) {
          var _this = _super.call(this, msg) || this;
          _this.field = field;
          _this.name = "RequiredError";
          return _this;
        }
        return RequiredError2;
      }(Error)
    );
    exports2.RequiredError = RequiredError;
    exports2.COLLECTION_FORMATS = {
      csv: ",",
      ssv: " ",
      tsv: "	",
      pipes: "|"
    };
    function exists(json, key) {
      var value = json[key];
      return value !== null && value !== void 0;
    }
    exports2.exists = exists;
    function querystring(params, prefix) {
      if (prefix === void 0) {
        prefix = "";
      }
      return Object.keys(params).map(function(key) {
        return querystringSingleKey(key, params[key], prefix);
      }).filter(function(part) {
        return part.length > 0;
      }).join("&");
    }
    exports2.querystring = querystring;
    function querystringSingleKey(key, value, keyPrefix) {
      if (keyPrefix === void 0) {
        keyPrefix = "";
      }
      var fullKey = keyPrefix + (keyPrefix.length ? "[".concat(key, "]") : key);
      if (value instanceof Array) {
        var multiValue = value.map(function(singleValue) {
          return encodeURIComponent(String(singleValue));
        }).join("&".concat(encodeURIComponent(fullKey), "="));
        return "".concat(encodeURIComponent(fullKey), "=").concat(multiValue);
      }
      if (value instanceof Set) {
        var valueAsArray = Array.from(value);
        return querystringSingleKey(key, valueAsArray, keyPrefix);
      }
      if (value instanceof Date) {
        return "".concat(encodeURIComponent(fullKey), "=").concat(encodeURIComponent(value.toISOString()));
      }
      if (value instanceof Object) {
        return querystring(value, fullKey);
      }
      return "".concat(encodeURIComponent(fullKey), "=").concat(encodeURIComponent(String(value)));
    }
    function mapValues(data, fn) {
      return Object.keys(data).reduce(function(acc, key) {
        var _a;
        return __assign(__assign({}, acc), (_a = {}, _a[key] = fn(data[key]), _a));
      }, {});
    }
    exports2.mapValues = mapValues;
    function canConsumeForm(consumes) {
      for (var _i = 0, consumes_1 = consumes; _i < consumes_1.length; _i++) {
        var consume = consumes_1[_i];
        if ("multipart/form-data" === consume.contentType) {
          return true;
        }
      }
      return false;
    }
    exports2.canConsumeForm = canConsumeForm;
    var JSONApiResponse = (
      /** @class */
      function() {
        function JSONApiResponse2(raw, transformer) {
          if (transformer === void 0) {
            transformer = function(jsonValue) {
              return jsonValue;
            };
          }
          this.raw = raw;
          this.transformer = transformer;
        }
        JSONApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _a = this.transformer;
                  return [4, this.raw.json()];
                case 1:
                  return [2, _a.apply(this, [_b.sent()])];
              }
            });
          });
        };
        return JSONApiResponse2;
      }()
    );
    exports2.JSONApiResponse = JSONApiResponse;
    var VoidApiResponse = (
      /** @class */
      function() {
        function VoidApiResponse2(raw) {
          this.raw = raw;
        }
        VoidApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, void 0];
            });
          });
        };
        return VoidApiResponse2;
      }()
    );
    exports2.VoidApiResponse = VoidApiResponse;
    var BlobApiResponse = (
      /** @class */
      function() {
        function BlobApiResponse2(raw) {
          this.raw = raw;
        }
        BlobApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.raw.blob()];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ;
        return BlobApiResponse2;
      }()
    );
    exports2.BlobApiResponse = BlobApiResponse;
    var TextApiResponse = (
      /** @class */
      function() {
        function TextApiResponse2(raw) {
          this.raw = raw;
        }
        TextApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.raw.text()];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ;
        return TextApiResponse2;
      }()
    );
    exports2.TextApiResponse = TextApiResponse;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/CollectionModel.js
var require_CollectionModel = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/CollectionModel.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CollectionModelToJSON = exports2.CollectionModelFromJSONTyped = exports2.CollectionModelFromJSON = exports2.instanceOfCollectionModel = exports2.CollectionModelStatusEnum = void 0;
    var runtime_1 = require_runtime();
    exports2.CollectionModelStatusEnum = {
      Initializing: "Initializing",
      Ready: "Ready",
      Terminating: "Terminating"
    };
    function instanceOfCollectionModel(value) {
      var isInstance = true;
      isInstance = isInstance && "name" in value;
      isInstance = isInstance && "status" in value;
      isInstance = isInstance && "environment" in value;
      return isInstance;
    }
    exports2.instanceOfCollectionModel = instanceOfCollectionModel;
    function CollectionModelFromJSON(json) {
      return CollectionModelFromJSONTyped(json, false);
    }
    exports2.CollectionModelFromJSON = CollectionModelFromJSON;
    function CollectionModelFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "name": json["name"],
        "size": !(0, runtime_1.exists)(json, "size") ? void 0 : json["size"],
        "status": json["status"],
        "dimension": !(0, runtime_1.exists)(json, "dimension") ? void 0 : json["dimension"],
        "vectorCount": !(0, runtime_1.exists)(json, "vector_count") ? void 0 : json["vector_count"],
        "environment": json["environment"]
      };
    }
    exports2.CollectionModelFromJSONTyped = CollectionModelFromJSONTyped;
    function CollectionModelToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "name": value.name,
        "size": value.size,
        "status": value.status,
        "dimension": value.dimension,
        "vector_count": value.vectorCount,
        "environment": value.environment
      };
    }
    exports2.CollectionModelToJSON = CollectionModelToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/CollectionList.js
var require_CollectionList = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/CollectionList.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CollectionListToJSON = exports2.CollectionListFromJSONTyped = exports2.CollectionListFromJSON = exports2.instanceOfCollectionList = void 0;
    var runtime_1 = require_runtime();
    var CollectionModel_1 = require_CollectionModel();
    function instanceOfCollectionList(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfCollectionList = instanceOfCollectionList;
    function CollectionListFromJSON(json) {
      return CollectionListFromJSONTyped(json, false);
    }
    exports2.CollectionListFromJSON = CollectionListFromJSON;
    function CollectionListFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "collections": !(0, runtime_1.exists)(json, "collections") ? void 0 : json["collections"].map(CollectionModel_1.CollectionModelFromJSON)
      };
    }
    exports2.CollectionListFromJSONTyped = CollectionListFromJSONTyped;
    function CollectionListToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "collections": value.collections === void 0 ? void 0 : value.collections.map(CollectionModel_1.CollectionModelToJSON)
      };
    }
    exports2.CollectionListToJSON = CollectionListToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ConfigureIndexRequestSpecPod.js
var require_ConfigureIndexRequestSpecPod = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ConfigureIndexRequestSpecPod.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ConfigureIndexRequestSpecPodToJSON = exports2.ConfigureIndexRequestSpecPodFromJSONTyped = exports2.ConfigureIndexRequestSpecPodFromJSON = exports2.instanceOfConfigureIndexRequestSpecPod = void 0;
    var runtime_1 = require_runtime();
    function instanceOfConfigureIndexRequestSpecPod(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfConfigureIndexRequestSpecPod = instanceOfConfigureIndexRequestSpecPod;
    function ConfigureIndexRequestSpecPodFromJSON(json) {
      return ConfigureIndexRequestSpecPodFromJSONTyped(json, false);
    }
    exports2.ConfigureIndexRequestSpecPodFromJSON = ConfigureIndexRequestSpecPodFromJSON;
    function ConfigureIndexRequestSpecPodFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "replicas": !(0, runtime_1.exists)(json, "replicas") ? void 0 : json["replicas"],
        "podType": !(0, runtime_1.exists)(json, "pod_type") ? void 0 : json["pod_type"]
      };
    }
    exports2.ConfigureIndexRequestSpecPodFromJSONTyped = ConfigureIndexRequestSpecPodFromJSONTyped;
    function ConfigureIndexRequestSpecPodToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "replicas": value.replicas,
        "pod_type": value.podType
      };
    }
    exports2.ConfigureIndexRequestSpecPodToJSON = ConfigureIndexRequestSpecPodToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ConfigureIndexRequestSpec.js
var require_ConfigureIndexRequestSpec = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ConfigureIndexRequestSpec.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ConfigureIndexRequestSpecToJSON = exports2.ConfigureIndexRequestSpecFromJSONTyped = exports2.ConfigureIndexRequestSpecFromJSON = exports2.instanceOfConfigureIndexRequestSpec = void 0;
    var ConfigureIndexRequestSpecPod_1 = require_ConfigureIndexRequestSpecPod();
    function instanceOfConfigureIndexRequestSpec(value) {
      var isInstance = true;
      isInstance = isInstance && "pod" in value;
      return isInstance;
    }
    exports2.instanceOfConfigureIndexRequestSpec = instanceOfConfigureIndexRequestSpec;
    function ConfigureIndexRequestSpecFromJSON(json) {
      return ConfigureIndexRequestSpecFromJSONTyped(json, false);
    }
    exports2.ConfigureIndexRequestSpecFromJSON = ConfigureIndexRequestSpecFromJSON;
    function ConfigureIndexRequestSpecFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "pod": (0, ConfigureIndexRequestSpecPod_1.ConfigureIndexRequestSpecPodFromJSON)(json["pod"])
      };
    }
    exports2.ConfigureIndexRequestSpecFromJSONTyped = ConfigureIndexRequestSpecFromJSONTyped;
    function ConfigureIndexRequestSpecToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "pod": (0, ConfigureIndexRequestSpecPod_1.ConfigureIndexRequestSpecPodToJSON)(value.pod)
      };
    }
    exports2.ConfigureIndexRequestSpecToJSON = ConfigureIndexRequestSpecToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/DeletionProtection.js
var require_DeletionProtection = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/DeletionProtection.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DeletionProtectionToJSON = exports2.DeletionProtectionFromJSONTyped = exports2.DeletionProtectionFromJSON = exports2.DeletionProtection = void 0;
    exports2.DeletionProtection = {
      Disabled: "disabled",
      Enabled: "enabled"
    };
    function DeletionProtectionFromJSON(json) {
      return DeletionProtectionFromJSONTyped(json, false);
    }
    exports2.DeletionProtectionFromJSON = DeletionProtectionFromJSON;
    function DeletionProtectionFromJSONTyped(json, ignoreDiscriminator) {
      return json;
    }
    exports2.DeletionProtectionFromJSONTyped = DeletionProtectionFromJSONTyped;
    function DeletionProtectionToJSON(value) {
      return value;
    }
    exports2.DeletionProtectionToJSON = DeletionProtectionToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ConfigureIndexRequest.js
var require_ConfigureIndexRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ConfigureIndexRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ConfigureIndexRequestToJSON = exports2.ConfigureIndexRequestFromJSONTyped = exports2.ConfigureIndexRequestFromJSON = exports2.instanceOfConfigureIndexRequest = void 0;
    var runtime_1 = require_runtime();
    var ConfigureIndexRequestSpec_1 = require_ConfigureIndexRequestSpec();
    var DeletionProtection_1 = require_DeletionProtection();
    function instanceOfConfigureIndexRequest(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfConfigureIndexRequest = instanceOfConfigureIndexRequest;
    function ConfigureIndexRequestFromJSON(json) {
      return ConfigureIndexRequestFromJSONTyped(json, false);
    }
    exports2.ConfigureIndexRequestFromJSON = ConfigureIndexRequestFromJSON;
    function ConfigureIndexRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "spec": !(0, runtime_1.exists)(json, "spec") ? void 0 : (0, ConfigureIndexRequestSpec_1.ConfigureIndexRequestSpecFromJSON)(json["spec"]),
        "deletionProtection": !(0, runtime_1.exists)(json, "deletion_protection") ? void 0 : (0, DeletionProtection_1.DeletionProtectionFromJSON)(json["deletion_protection"]),
        "tags": !(0, runtime_1.exists)(json, "tags") ? void 0 : json["tags"]
      };
    }
    exports2.ConfigureIndexRequestFromJSONTyped = ConfigureIndexRequestFromJSONTyped;
    function ConfigureIndexRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "spec": (0, ConfigureIndexRequestSpec_1.ConfigureIndexRequestSpecToJSON)(value.spec),
        "deletion_protection": (0, DeletionProtection_1.DeletionProtectionToJSON)(value.deletionProtection),
        "tags": value.tags
      };
    }
    exports2.ConfigureIndexRequestToJSON = ConfigureIndexRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/CreateCollectionRequest.js
var require_CreateCollectionRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/CreateCollectionRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CreateCollectionRequestToJSON = exports2.CreateCollectionRequestFromJSONTyped = exports2.CreateCollectionRequestFromJSON = exports2.instanceOfCreateCollectionRequest = void 0;
    function instanceOfCreateCollectionRequest(value) {
      var isInstance = true;
      isInstance = isInstance && "name" in value;
      isInstance = isInstance && "source" in value;
      return isInstance;
    }
    exports2.instanceOfCreateCollectionRequest = instanceOfCreateCollectionRequest;
    function CreateCollectionRequestFromJSON(json) {
      return CreateCollectionRequestFromJSONTyped(json, false);
    }
    exports2.CreateCollectionRequestFromJSON = CreateCollectionRequestFromJSON;
    function CreateCollectionRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "name": json["name"],
        "source": json["source"]
      };
    }
    exports2.CreateCollectionRequestFromJSONTyped = CreateCollectionRequestFromJSONTyped;
    function CreateCollectionRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "name": value.name,
        "source": value.source
      };
    }
    exports2.CreateCollectionRequestToJSON = CreateCollectionRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/PodSpecMetadataConfig.js
var require_PodSpecMetadataConfig = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/PodSpecMetadataConfig.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PodSpecMetadataConfigToJSON = exports2.PodSpecMetadataConfigFromJSONTyped = exports2.PodSpecMetadataConfigFromJSON = exports2.instanceOfPodSpecMetadataConfig = void 0;
    var runtime_1 = require_runtime();
    function instanceOfPodSpecMetadataConfig(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfPodSpecMetadataConfig = instanceOfPodSpecMetadataConfig;
    function PodSpecMetadataConfigFromJSON(json) {
      return PodSpecMetadataConfigFromJSONTyped(json, false);
    }
    exports2.PodSpecMetadataConfigFromJSON = PodSpecMetadataConfigFromJSON;
    function PodSpecMetadataConfigFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "indexed": !(0, runtime_1.exists)(json, "indexed") ? void 0 : json["indexed"]
      };
    }
    exports2.PodSpecMetadataConfigFromJSONTyped = PodSpecMetadataConfigFromJSONTyped;
    function PodSpecMetadataConfigToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "indexed": value.indexed
      };
    }
    exports2.PodSpecMetadataConfigToJSON = PodSpecMetadataConfigToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/PodSpec.js
var require_PodSpec = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/PodSpec.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PodSpecToJSON = exports2.PodSpecFromJSONTyped = exports2.PodSpecFromJSON = exports2.instanceOfPodSpec = void 0;
    var runtime_1 = require_runtime();
    var PodSpecMetadataConfig_1 = require_PodSpecMetadataConfig();
    function instanceOfPodSpec(value) {
      var isInstance = true;
      isInstance = isInstance && "environment" in value;
      isInstance = isInstance && "podType" in value;
      return isInstance;
    }
    exports2.instanceOfPodSpec = instanceOfPodSpec;
    function PodSpecFromJSON(json) {
      return PodSpecFromJSONTyped(json, false);
    }
    exports2.PodSpecFromJSON = PodSpecFromJSON;
    function PodSpecFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "environment": json["environment"],
        "replicas": !(0, runtime_1.exists)(json, "replicas") ? void 0 : json["replicas"],
        "shards": !(0, runtime_1.exists)(json, "shards") ? void 0 : json["shards"],
        "podType": json["pod_type"],
        "pods": !(0, runtime_1.exists)(json, "pods") ? void 0 : json["pods"],
        "metadataConfig": !(0, runtime_1.exists)(json, "metadata_config") ? void 0 : (0, PodSpecMetadataConfig_1.PodSpecMetadataConfigFromJSON)(json["metadata_config"]),
        "sourceCollection": !(0, runtime_1.exists)(json, "source_collection") ? void 0 : json["source_collection"]
      };
    }
    exports2.PodSpecFromJSONTyped = PodSpecFromJSONTyped;
    function PodSpecToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "environment": value.environment,
        "replicas": value.replicas,
        "shards": value.shards,
        "pod_type": value.podType,
        "pods": value.pods,
        "metadata_config": (0, PodSpecMetadataConfig_1.PodSpecMetadataConfigToJSON)(value.metadataConfig),
        "source_collection": value.sourceCollection
      };
    }
    exports2.PodSpecToJSON = PodSpecToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ServerlessSpec.js
var require_ServerlessSpec = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ServerlessSpec.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ServerlessSpecToJSON = exports2.ServerlessSpecFromJSONTyped = exports2.ServerlessSpecFromJSON = exports2.instanceOfServerlessSpec = exports2.ServerlessSpecCloudEnum = void 0;
    exports2.ServerlessSpecCloudEnum = {
      Gcp: "gcp",
      Aws: "aws",
      Azure: "azure"
    };
    function instanceOfServerlessSpec(value) {
      var isInstance = true;
      isInstance = isInstance && "cloud" in value;
      isInstance = isInstance && "region" in value;
      return isInstance;
    }
    exports2.instanceOfServerlessSpec = instanceOfServerlessSpec;
    function ServerlessSpecFromJSON(json) {
      return ServerlessSpecFromJSONTyped(json, false);
    }
    exports2.ServerlessSpecFromJSON = ServerlessSpecFromJSON;
    function ServerlessSpecFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "cloud": json["cloud"],
        "region": json["region"]
      };
    }
    exports2.ServerlessSpecFromJSONTyped = ServerlessSpecFromJSONTyped;
    function ServerlessSpecToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "cloud": value.cloud,
        "region": value.region
      };
    }
    exports2.ServerlessSpecToJSON = ServerlessSpecToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/IndexSpec.js
var require_IndexSpec = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/IndexSpec.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IndexSpecToJSON = exports2.IndexSpecFromJSONTyped = exports2.IndexSpecFromJSON = exports2.instanceOfIndexSpec = void 0;
    var runtime_1 = require_runtime();
    var PodSpec_1 = require_PodSpec();
    var ServerlessSpec_1 = require_ServerlessSpec();
    function instanceOfIndexSpec(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfIndexSpec = instanceOfIndexSpec;
    function IndexSpecFromJSON(json) {
      return IndexSpecFromJSONTyped(json, false);
    }
    exports2.IndexSpecFromJSON = IndexSpecFromJSON;
    function IndexSpecFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "serverless": !(0, runtime_1.exists)(json, "serverless") ? void 0 : (0, ServerlessSpec_1.ServerlessSpecFromJSON)(json["serverless"]),
        "pod": !(0, runtime_1.exists)(json, "pod") ? void 0 : (0, PodSpec_1.PodSpecFromJSON)(json["pod"])
      };
    }
    exports2.IndexSpecFromJSONTyped = IndexSpecFromJSONTyped;
    function IndexSpecToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "serverless": (0, ServerlessSpec_1.ServerlessSpecToJSON)(value.serverless),
        "pod": (0, PodSpec_1.PodSpecToJSON)(value.pod)
      };
    }
    exports2.IndexSpecToJSON = IndexSpecToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/CreateIndexRequest.js
var require_CreateIndexRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/CreateIndexRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CreateIndexRequestToJSON = exports2.CreateIndexRequestFromJSONTyped = exports2.CreateIndexRequestFromJSON = exports2.instanceOfCreateIndexRequest = exports2.CreateIndexRequestMetricEnum = void 0;
    var runtime_1 = require_runtime();
    var DeletionProtection_1 = require_DeletionProtection();
    var IndexSpec_1 = require_IndexSpec();
    exports2.CreateIndexRequestMetricEnum = {
      Cosine: "cosine",
      Euclidean: "euclidean",
      Dotproduct: "dotproduct"
    };
    function instanceOfCreateIndexRequest(value) {
      var isInstance = true;
      isInstance = isInstance && "name" in value;
      isInstance = isInstance && "dimension" in value;
      isInstance = isInstance && "spec" in value;
      return isInstance;
    }
    exports2.instanceOfCreateIndexRequest = instanceOfCreateIndexRequest;
    function CreateIndexRequestFromJSON(json) {
      return CreateIndexRequestFromJSONTyped(json, false);
    }
    exports2.CreateIndexRequestFromJSON = CreateIndexRequestFromJSON;
    function CreateIndexRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "name": json["name"],
        "dimension": json["dimension"],
        "metric": !(0, runtime_1.exists)(json, "metric") ? void 0 : json["metric"],
        "deletionProtection": !(0, runtime_1.exists)(json, "deletion_protection") ? void 0 : (0, DeletionProtection_1.DeletionProtectionFromJSON)(json["deletion_protection"]),
        "tags": !(0, runtime_1.exists)(json, "tags") ? void 0 : json["tags"],
        "spec": (0, IndexSpec_1.IndexSpecFromJSON)(json["spec"])
      };
    }
    exports2.CreateIndexRequestFromJSONTyped = CreateIndexRequestFromJSONTyped;
    function CreateIndexRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "name": value.name,
        "dimension": value.dimension,
        "metric": value.metric,
        "deletion_protection": (0, DeletionProtection_1.DeletionProtectionToJSON)(value.deletionProtection),
        "tags": value.tags,
        "spec": (0, IndexSpec_1.IndexSpecToJSON)(value.spec)
      };
    }
    exports2.CreateIndexRequestToJSON = CreateIndexRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ErrorResponseError.js
var require_ErrorResponseError = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ErrorResponseError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ErrorResponseErrorToJSON = exports2.ErrorResponseErrorFromJSONTyped = exports2.ErrorResponseErrorFromJSON = exports2.instanceOfErrorResponseError = exports2.ErrorResponseErrorCodeEnum = void 0;
    var runtime_1 = require_runtime();
    exports2.ErrorResponseErrorCodeEnum = {
      Ok: "OK",
      Unknown: "UNKNOWN",
      InvalidArgument: "INVALID_ARGUMENT",
      DeadlineExceeded: "DEADLINE_EXCEEDED",
      QuotaExceeded: "QUOTA_EXCEEDED",
      NotFound: "NOT_FOUND",
      AlreadyExists: "ALREADY_EXISTS",
      PermissionDenied: "PERMISSION_DENIED",
      Unauthenticated: "UNAUTHENTICATED",
      ResourceExhausted: "RESOURCE_EXHAUSTED",
      FailedPrecondition: "FAILED_PRECONDITION",
      Aborted: "ABORTED",
      OutOfRange: "OUT_OF_RANGE",
      Unimplemented: "UNIMPLEMENTED",
      Internal: "INTERNAL",
      Unavailable: "UNAVAILABLE",
      DataLoss: "DATA_LOSS",
      Forbidden: "FORBIDDEN",
      UnprocessableEntity: "UNPROCESSABLE_ENTITY",
      PaymentRequired: "PAYMENT_REQUIRED"
    };
    function instanceOfErrorResponseError(value) {
      var isInstance = true;
      isInstance = isInstance && "code" in value;
      isInstance = isInstance && "message" in value;
      return isInstance;
    }
    exports2.instanceOfErrorResponseError = instanceOfErrorResponseError;
    function ErrorResponseErrorFromJSON(json) {
      return ErrorResponseErrorFromJSONTyped(json, false);
    }
    exports2.ErrorResponseErrorFromJSON = ErrorResponseErrorFromJSON;
    function ErrorResponseErrorFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "code": json["code"],
        "message": json["message"],
        "details": !(0, runtime_1.exists)(json, "details") ? void 0 : json["details"]
      };
    }
    exports2.ErrorResponseErrorFromJSONTyped = ErrorResponseErrorFromJSONTyped;
    function ErrorResponseErrorToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "code": value.code,
        "message": value.message,
        "details": value.details
      };
    }
    exports2.ErrorResponseErrorToJSON = ErrorResponseErrorToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ErrorResponse.js
var require_ErrorResponse = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/ErrorResponse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ErrorResponseToJSON = exports2.ErrorResponseFromJSONTyped = exports2.ErrorResponseFromJSON = exports2.instanceOfErrorResponse = void 0;
    var ErrorResponseError_1 = require_ErrorResponseError();
    function instanceOfErrorResponse(value) {
      var isInstance = true;
      isInstance = isInstance && "status" in value;
      isInstance = isInstance && "error" in value;
      return isInstance;
    }
    exports2.instanceOfErrorResponse = instanceOfErrorResponse;
    function ErrorResponseFromJSON(json) {
      return ErrorResponseFromJSONTyped(json, false);
    }
    exports2.ErrorResponseFromJSON = ErrorResponseFromJSON;
    function ErrorResponseFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "status": json["status"],
        "error": (0, ErrorResponseError_1.ErrorResponseErrorFromJSON)(json["error"])
      };
    }
    exports2.ErrorResponseFromJSONTyped = ErrorResponseFromJSONTyped;
    function ErrorResponseToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "status": value.status,
        "error": (0, ErrorResponseError_1.ErrorResponseErrorToJSON)(value.error)
      };
    }
    exports2.ErrorResponseToJSON = ErrorResponseToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/IndexModelSpec.js
var require_IndexModelSpec = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/IndexModelSpec.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IndexModelSpecToJSON = exports2.IndexModelSpecFromJSONTyped = exports2.IndexModelSpecFromJSON = exports2.instanceOfIndexModelSpec = void 0;
    var runtime_1 = require_runtime();
    var PodSpec_1 = require_PodSpec();
    var ServerlessSpec_1 = require_ServerlessSpec();
    function instanceOfIndexModelSpec(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfIndexModelSpec = instanceOfIndexModelSpec;
    function IndexModelSpecFromJSON(json) {
      return IndexModelSpecFromJSONTyped(json, false);
    }
    exports2.IndexModelSpecFromJSON = IndexModelSpecFromJSON;
    function IndexModelSpecFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "pod": !(0, runtime_1.exists)(json, "pod") ? void 0 : (0, PodSpec_1.PodSpecFromJSON)(json["pod"]),
        "serverless": !(0, runtime_1.exists)(json, "serverless") ? void 0 : (0, ServerlessSpec_1.ServerlessSpecFromJSON)(json["serverless"])
      };
    }
    exports2.IndexModelSpecFromJSONTyped = IndexModelSpecFromJSONTyped;
    function IndexModelSpecToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "pod": (0, PodSpec_1.PodSpecToJSON)(value.pod),
        "serverless": (0, ServerlessSpec_1.ServerlessSpecToJSON)(value.serverless)
      };
    }
    exports2.IndexModelSpecToJSON = IndexModelSpecToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/IndexModelStatus.js
var require_IndexModelStatus = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/IndexModelStatus.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IndexModelStatusToJSON = exports2.IndexModelStatusFromJSONTyped = exports2.IndexModelStatusFromJSON = exports2.instanceOfIndexModelStatus = exports2.IndexModelStatusStateEnum = void 0;
    exports2.IndexModelStatusStateEnum = {
      Initializing: "Initializing",
      InitializationFailed: "InitializationFailed",
      ScalingUp: "ScalingUp",
      ScalingDown: "ScalingDown",
      ScalingUpPodSize: "ScalingUpPodSize",
      ScalingDownPodSize: "ScalingDownPodSize",
      Terminating: "Terminating",
      Ready: "Ready"
    };
    function instanceOfIndexModelStatus(value) {
      var isInstance = true;
      isInstance = isInstance && "ready" in value;
      isInstance = isInstance && "state" in value;
      return isInstance;
    }
    exports2.instanceOfIndexModelStatus = instanceOfIndexModelStatus;
    function IndexModelStatusFromJSON(json) {
      return IndexModelStatusFromJSONTyped(json, false);
    }
    exports2.IndexModelStatusFromJSON = IndexModelStatusFromJSON;
    function IndexModelStatusFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "ready": json["ready"],
        "state": json["state"]
      };
    }
    exports2.IndexModelStatusFromJSONTyped = IndexModelStatusFromJSONTyped;
    function IndexModelStatusToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "ready": value.ready,
        "state": value.state
      };
    }
    exports2.IndexModelStatusToJSON = IndexModelStatusToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/IndexModel.js
var require_IndexModel = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/IndexModel.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IndexModelToJSON = exports2.IndexModelFromJSONTyped = exports2.IndexModelFromJSON = exports2.instanceOfIndexModel = exports2.IndexModelMetricEnum = void 0;
    var runtime_1 = require_runtime();
    var DeletionProtection_1 = require_DeletionProtection();
    var IndexModelSpec_1 = require_IndexModelSpec();
    var IndexModelStatus_1 = require_IndexModelStatus();
    exports2.IndexModelMetricEnum = {
      Cosine: "cosine",
      Euclidean: "euclidean",
      Dotproduct: "dotproduct"
    };
    function instanceOfIndexModel(value) {
      var isInstance = true;
      isInstance = isInstance && "name" in value;
      isInstance = isInstance && "dimension" in value;
      isInstance = isInstance && "metric" in value;
      isInstance = isInstance && "host" in value;
      isInstance = isInstance && "spec" in value;
      isInstance = isInstance && "status" in value;
      return isInstance;
    }
    exports2.instanceOfIndexModel = instanceOfIndexModel;
    function IndexModelFromJSON(json) {
      return IndexModelFromJSONTyped(json, false);
    }
    exports2.IndexModelFromJSON = IndexModelFromJSON;
    function IndexModelFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "name": json["name"],
        "dimension": json["dimension"],
        "metric": json["metric"],
        "host": json["host"],
        "deletionProtection": !(0, runtime_1.exists)(json, "deletion_protection") ? void 0 : (0, DeletionProtection_1.DeletionProtectionFromJSON)(json["deletion_protection"]),
        "tags": !(0, runtime_1.exists)(json, "tags") ? void 0 : json["tags"],
        "spec": (0, IndexModelSpec_1.IndexModelSpecFromJSON)(json["spec"]),
        "status": (0, IndexModelStatus_1.IndexModelStatusFromJSON)(json["status"])
      };
    }
    exports2.IndexModelFromJSONTyped = IndexModelFromJSONTyped;
    function IndexModelToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "name": value.name,
        "dimension": value.dimension,
        "metric": value.metric,
        "host": value.host,
        "deletion_protection": (0, DeletionProtection_1.DeletionProtectionToJSON)(value.deletionProtection),
        "tags": value.tags,
        "spec": (0, IndexModelSpec_1.IndexModelSpecToJSON)(value.spec),
        "status": (0, IndexModelStatus_1.IndexModelStatusToJSON)(value.status)
      };
    }
    exports2.IndexModelToJSON = IndexModelToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/IndexList.js
var require_IndexList = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/IndexList.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IndexListToJSON = exports2.IndexListFromJSONTyped = exports2.IndexListFromJSON = exports2.instanceOfIndexList = void 0;
    var runtime_1 = require_runtime();
    var IndexModel_1 = require_IndexModel();
    function instanceOfIndexList(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfIndexList = instanceOfIndexList;
    function IndexListFromJSON(json) {
      return IndexListFromJSONTyped(json, false);
    }
    exports2.IndexListFromJSON = IndexListFromJSON;
    function IndexListFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "indexes": !(0, runtime_1.exists)(json, "indexes") ? void 0 : json["indexes"].map(IndexModel_1.IndexModelFromJSON)
      };
    }
    exports2.IndexListFromJSONTyped = IndexListFromJSONTyped;
    function IndexListToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "indexes": value.indexes === void 0 ? void 0 : value.indexes.map(IndexModel_1.IndexModelToJSON)
      };
    }
    exports2.IndexListToJSON = IndexListToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/index.js
var require_models = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/models/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_CollectionList(), exports2);
    __exportStar(require_CollectionModel(), exports2);
    __exportStar(require_ConfigureIndexRequest(), exports2);
    __exportStar(require_ConfigureIndexRequestSpec(), exports2);
    __exportStar(require_ConfigureIndexRequestSpecPod(), exports2);
    __exportStar(require_CreateCollectionRequest(), exports2);
    __exportStar(require_CreateIndexRequest(), exports2);
    __exportStar(require_DeletionProtection(), exports2);
    __exportStar(require_ErrorResponse(), exports2);
    __exportStar(require_ErrorResponseError(), exports2);
    __exportStar(require_IndexList(), exports2);
    __exportStar(require_IndexModel(), exports2);
    __exportStar(require_IndexModelSpec(), exports2);
    __exportStar(require_IndexModelStatus(), exports2);
    __exportStar(require_IndexSpec(), exports2);
    __exportStar(require_PodSpec(), exports2);
    __exportStar(require_PodSpecMetadataConfig(), exports2);
    __exportStar(require_ServerlessSpec(), exports2);
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/apis/ManageIndexesApi.js
var require_ManageIndexesApi = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/apis/ManageIndexesApi.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ManageIndexesApi = void 0;
    var runtime = __importStar(require_runtime());
    var index_1 = require_models();
    var ManageIndexesApi = (
      /** @class */
      function(_super) {
        __extends(ManageIndexesApi2, _super);
        function ManageIndexesApi2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        ManageIndexesApi2.prototype.configureIndexRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.indexName === null || requestParameters.indexName === void 0) {
                    throw new runtime.RequiredError("indexName", "Required parameter requestParameters.indexName was null or undefined when calling configureIndex.");
                  }
                  if (requestParameters.configureIndexRequest === null || requestParameters.configureIndexRequest === void 0) {
                    throw new runtime.RequiredError("configureIndexRequest", "Required parameter requestParameters.configureIndexRequest was null or undefined when calling configureIndex.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/indexes/{index_name}".replace("{".concat("index_name", "}"), encodeURIComponent(String(requestParameters.indexName))),
                    method: "PATCH",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.ConfigureIndexRequestToJSON)(requestParameters.configureIndexRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.IndexModelFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.configureIndex = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.configureIndexRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.createCollectionRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.createCollectionRequest === null || requestParameters.createCollectionRequest === void 0) {
                    throw new runtime.RequiredError("createCollectionRequest", "Required parameter requestParameters.createCollectionRequest was null or undefined when calling createCollection.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/collections",
                    method: "POST",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.CreateCollectionRequestToJSON)(requestParameters.createCollectionRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.CollectionModelFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.createCollection = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.createCollectionRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.createIndexRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.createIndexRequest === null || requestParameters.createIndexRequest === void 0) {
                    throw new runtime.RequiredError("createIndexRequest", "Required parameter requestParameters.createIndexRequest was null or undefined when calling createIndex.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/indexes",
                    method: "POST",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.CreateIndexRequestToJSON)(requestParameters.createIndexRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.IndexModelFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.createIndex = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.createIndexRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.deleteCollectionRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.collectionName === null || requestParameters.collectionName === void 0) {
                    throw new runtime.RequiredError("collectionName", "Required parameter requestParameters.collectionName was null or undefined when calling deleteCollection.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/collections/{collection_name}".replace("{".concat("collection_name", "}"), encodeURIComponent(String(requestParameters.collectionName))),
                    method: "DELETE",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.VoidApiResponse(response)];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.deleteCollection = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.deleteCollectionRaw(requestParameters, initOverrides)];
                case 1:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.deleteIndexRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.indexName === null || requestParameters.indexName === void 0) {
                    throw new runtime.RequiredError("indexName", "Required parameter requestParameters.indexName was null or undefined when calling deleteIndex.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/indexes/{index_name}".replace("{".concat("index_name", "}"), encodeURIComponent(String(requestParameters.indexName))),
                    method: "DELETE",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.VoidApiResponse(response)];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.deleteIndex = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.deleteIndexRaw(requestParameters, initOverrides)];
                case 1:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.describeCollectionRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.collectionName === null || requestParameters.collectionName === void 0) {
                    throw new runtime.RequiredError("collectionName", "Required parameter requestParameters.collectionName was null or undefined when calling describeCollection.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/collections/{collection_name}".replace("{".concat("collection_name", "}"), encodeURIComponent(String(requestParameters.collectionName))),
                    method: "GET",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.CollectionModelFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.describeCollection = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.describeCollectionRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.describeIndexRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.indexName === null || requestParameters.indexName === void 0) {
                    throw new runtime.RequiredError("indexName", "Required parameter requestParameters.indexName was null or undefined when calling describeIndex.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/indexes/{index_name}".replace("{".concat("index_name", "}"), encodeURIComponent(String(requestParameters.indexName))),
                    method: "GET",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.IndexModelFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.describeIndex = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.describeIndexRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.listCollectionsRaw = function(initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  queryParameters = {};
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/collections",
                    method: "GET",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.CollectionListFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.listCollections = function(initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.listCollectionsRaw(initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.listIndexesRaw = function(initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  queryParameters = {};
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/indexes",
                    method: "GET",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.IndexListFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        ManageIndexesApi2.prototype.listIndexes = function(initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.listIndexesRaw(initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        return ManageIndexesApi2;
      }(runtime.BaseAPI)
    );
    exports2.ManageIndexesApi = ManageIndexesApi;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/apis/index.js
var require_apis = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/apis/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_ManageIndexesApi(), exports2);
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/api_version.js
var require_api_version = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/api_version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.X_PINECONE_API_VERSION = void 0;
    exports2.X_PINECONE_API_VERSION = "2024-10";
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/index.js
var require_db_control = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_runtime(), exports2);
    __exportStar(require_apis(), exports2);
    __exportStar(require_models(), exports2);
    __exportStar(require_api_version(), exports2);
  }
});

// node_modules/@pinecone-database/pinecone/dist/utils/debugLog.js
var require_debugLog = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/utils/debugLog.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.debugLog = void 0;
    var debugLog = function(str) {
      if (typeof process !== "undefined" && process && process.env && process.env.PINECONE_DEBUG) {
        console.log(str);
      }
    };
    exports2.debugLog = debugLog;
  }
});

// node_modules/@pinecone-database/pinecone/dist/utils/normalizeUrl.js
var require_normalizeUrl = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/utils/normalizeUrl.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.normalizeUrl = void 0;
    function normalizeUrl(url) {
      if (!url || url.trim().length === 0) {
        return;
      }
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url;
      }
      return url;
    }
    exports2.normalizeUrl = normalizeUrl;
  }
});

// node_modules/@pinecone-database/pinecone/dist/utils/queryParamsStringify.js
var require_queryParamsStringify = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/utils/queryParamsStringify.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.queryParamsStringify = void 0;
    function queryParamsStringify(params, prefix) {
      if (prefix === void 0) {
        prefix = "";
      }
      return Object.keys(params).map(function(key) {
        return querystringSingleKey(key, params[key], prefix);
      }).filter(function(part) {
        return part.length > 0;
      }).join("&");
    }
    exports2.queryParamsStringify = queryParamsStringify;
    function querystringSingleKey(key, value, keyPrefix) {
      if (keyPrefix === void 0) {
        keyPrefix = "";
      }
      var fullKey = keyPrefix + (keyPrefix.length ? "[".concat(key, "]") : key);
      if (Array.isArray(value)) {
        var multiValue = value.map(function(singleValue) {
          return encodeURIComponent(String(singleValue));
        }).join("&".concat(encodeURIComponent(fullKey), "="));
        return "".concat(encodeURIComponent(fullKey), "=").concat(multiValue);
      }
      if (value instanceof Set) {
        var valueAsArray = Array.from(value);
        return querystringSingleKey(key, valueAsArray, keyPrefix);
      }
      if (value instanceof Date) {
        return "".concat(encodeURIComponent(fullKey), "=").concat(encodeURIComponent(value.toISOString()));
      }
      if (value instanceof Object) {
        return queryParamsStringify(value, fullKey);
      }
      return "".concat(encodeURIComponent(fullKey), "=").concat(encodeURIComponent(String(value)));
    }
  }
});

// node_modules/@pinecone-database/pinecone/dist/utils/environment.js
var require_environment = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/utils/environment.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isBrowser = exports2.isEdge = void 0;
    var isEdge = function() {
      return typeof EdgeRuntime === "string";
    };
    exports2.isEdge = isEdge;
    var isBrowser = function() {
      return typeof window !== "undefined";
    };
    exports2.isBrowser = isBrowser;
  }
});

// node_modules/@pinecone-database/pinecone/dist/version.json
var require_version = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/version.json"(exports2, module2) {
    module2.exports = {
      name: "@pinecone-database/pinecone",
      version: "3.0.3"
    };
  }
});

// node_modules/@pinecone-database/pinecone/dist/utils/user-agent.js
var require_user_agent = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/utils/user-agent.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.buildUserAgent = void 0;
    var environment_1 = require_environment();
    var packageInfo = __importStar(require_version());
    var buildUserAgent = function(config2) {
      var userAgentParts = [
        "".concat(packageInfo.name, " v").concat(packageInfo.version),
        "lang=typescript"
      ];
      if ((0, environment_1.isEdge)()) {
        userAgentParts.push("Edge Runtime");
      }
      if (typeof process !== "undefined" && process && process.version) {
        userAgentParts.push("node ".concat(process.version));
      }
      if (config2.sourceTag) {
        userAgentParts.push("source_tag=".concat(normalizeSourceTag(config2.sourceTag)));
      }
      return userAgentParts.join("; ");
    };
    exports2.buildUserAgent = buildUserAgent;
    var normalizeSourceTag = function(sourceTag) {
      if (!sourceTag) {
        return;
      }
      return sourceTag.toLowerCase().replace(/[^a-z0-9_ :]/g, "").trim().replace(/[ ]+/g, "_");
    };
  }
});

// node_modules/@pinecone-database/pinecone/dist/errors/base.js
var require_base = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/errors/base.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.BasePineconeError = void 0;
    var BasePineconeError = (
      /** @class */
      function(_super) {
        __extends(BasePineconeError2, _super);
        function BasePineconeError2(message, cause) {
          var _newTarget = this.constructor;
          var _this = _super.call(this, message) || this;
          Object.setPrototypeOf(_this, _newTarget.prototype);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, _newTarget);
          }
          _this.name = _this.constructor.name;
          _this.cause = cause;
          return _this;
        }
        return BasePineconeError2;
      }(Error)
    );
    exports2.BasePineconeError = BasePineconeError;
  }
});

// node_modules/@pinecone-database/pinecone/dist/errors/config.js
var require_config = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/errors/config.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PineconeUnableToResolveHostError = exports2.PineconeEnvironmentVarsNotSupportedError = exports2.PineconeUnexpectedResponseError = exports2.PineconeConfigurationError = void 0;
    var base_1 = require_base();
    var CONFIG_HELP = "You can find the configuration values for your project in the Pinecone developer console at https://app.pinecone.io.";
    var PineconeConfigurationError = (
      /** @class */
      function(_super) {
        __extends(PineconeConfigurationError2, _super);
        function PineconeConfigurationError2(message) {
          var _this = _super.call(this, "".concat(message, " ").concat(CONFIG_HELP)) || this;
          _this.name = "PineconeConfigurationError";
          return _this;
        }
        return PineconeConfigurationError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeConfigurationError = PineconeConfigurationError;
    var PineconeUnexpectedResponseError = (
      /** @class */
      function(_super) {
        __extends(PineconeUnexpectedResponseError2, _super);
        function PineconeUnexpectedResponseError2(url, status, body, message) {
          var _this = _super.call(this, "Unexpected response while calling ".concat(url, ". ").concat(message ? message + " " : "", "Status: ").concat(status, ". Body: ").concat(body)) || this;
          _this.name = "PineconeUnexpectedResponseError";
          return _this;
        }
        return PineconeUnexpectedResponseError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeUnexpectedResponseError = PineconeUnexpectedResponseError;
    var PineconeEnvironmentVarsNotSupportedError = (
      /** @class */
      function(_super) {
        __extends(PineconeEnvironmentVarsNotSupportedError2, _super);
        function PineconeEnvironmentVarsNotSupportedError2(message) {
          var _this = _super.call(this, message) || this;
          _this.name = "PineconeEnvironmentVarsNotSupportedError";
          return _this;
        }
        return PineconeEnvironmentVarsNotSupportedError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeEnvironmentVarsNotSupportedError = PineconeEnvironmentVarsNotSupportedError;
    var PineconeUnableToResolveHostError = (
      /** @class */
      function(_super) {
        __extends(PineconeUnableToResolveHostError2, _super);
        function PineconeUnableToResolveHostError2(message) {
          var _this = _super.call(this, message) || this;
          _this.name = "PineconeUnableToResolveHostError";
          return _this;
        }
        return PineconeUnableToResolveHostError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeUnableToResolveHostError = PineconeUnableToResolveHostError;
  }
});

// node_modules/@pinecone-database/pinecone/dist/errors/http.js
var require_http = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/errors/http.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.mapHttpStatusError = exports2.PineconeUnmappedHttpError = exports2.PineconeNotImplementedError = exports2.PineconeInternalServerError = exports2.PineconeConflictError = exports2.PineconeNotFoundError = exports2.PineconeAuthorizationError = exports2.PineconeBadRequestError = void 0;
    var base_1 = require_base();
    var CONFIG_HELP = "You can find the configuration values for your project in the Pinecone developer console at https://app.pinecone.io";
    var PineconeBadRequestError = (
      /** @class */
      function(_super) {
        __extends(PineconeBadRequestError2, _super);
        function PineconeBadRequestError2(failedRequest) {
          var _this = this;
          var message = failedRequest.message;
          _this = _super.call(this, message) || this;
          _this.name = "PineconeBadRequestError";
          return _this;
        }
        return PineconeBadRequestError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeBadRequestError = PineconeBadRequestError;
    var PineconeAuthorizationError = (
      /** @class */
      function(_super) {
        __extends(PineconeAuthorizationError2, _super);
        function PineconeAuthorizationError2(failedRequest) {
          var _this = this;
          var url = failedRequest.url;
          if (url) {
            _this = _super.call(this, "The API key you provided was rejected while calling ".concat(url, ". Please check your configuration values and try again. ").concat(CONFIG_HELP)) || this;
          } else {
            _this = _super.call(this, "The API key you provided was rejected. Please check your configuration values and try again. ".concat(CONFIG_HELP)) || this;
          }
          _this.name = "PineconeAuthorizationError";
          return _this;
        }
        return PineconeAuthorizationError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeAuthorizationError = PineconeAuthorizationError;
    var PineconeNotFoundError = (
      /** @class */
      function(_super) {
        __extends(PineconeNotFoundError2, _super);
        function PineconeNotFoundError2(failedRequest) {
          var _this = this;
          var url = failedRequest.url;
          if (url) {
            _this = _super.call(this, "A call to ".concat(url, " returned HTTP status 404.")) || this;
          } else {
            _this = _super.call(this, "The requested resource could not be found.") || this;
          }
          _this.name = "PineconeNotFoundError";
          return _this;
        }
        return PineconeNotFoundError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeNotFoundError = PineconeNotFoundError;
    var PineconeConflictError = (
      /** @class */
      function(_super) {
        __extends(PineconeConflictError2, _super);
        function PineconeConflictError2(failedRequest) {
          var _this = this;
          var url = failedRequest.url, message = failedRequest.message;
          if (url) {
            _this = _super.call(this, "A call to ".concat(url, " returned HTTP status 409. ").concat(message ? message : "")) || this;
          } else {
            _this = _super.call(this, "The resource you are attempting to create already exists.") || this;
          }
          _this.name = "PineconeConflictError";
          return _this;
        }
        return PineconeConflictError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeConflictError = PineconeConflictError;
    var PineconeInternalServerError = (
      /** @class */
      function(_super) {
        __extends(PineconeInternalServerError2, _super);
        function PineconeInternalServerError2(failedRequest) {
          var _this = this;
          var url = failedRequest.url, body = failedRequest.body;
          var intro = url ? "An internal server error occured while calling the ".concat(url, " endpoint.") : "";
          var help = "To see overall service health and learn whether this seems like a large-scale problem or one specific to your request, please go to https://status.pinecone.io/ to view our status page. If you believe the error reflects a problem with this client, please file a bug report in the github issue tracker at https://github.com/pinecone-io/pinecone-ts-client";
          var bodyMessage = body ? "Body: ".concat(body) : "";
          _this = _super.call(this, [intro, help, bodyMessage].join(" ").trim()) || this;
          _this.name = "PineconeInternalServerError";
          return _this;
        }
        return PineconeInternalServerError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeInternalServerError = PineconeInternalServerError;
    var PineconeNotImplementedError = (
      /** @class */
      function(_super) {
        __extends(PineconeNotImplementedError2, _super);
        function PineconeNotImplementedError2(requestInfo) {
          var _this = this;
          var url = requestInfo.url, message = requestInfo.message;
          if (url) {
            _this = _super.call(this, "A call to ".concat(url, " returned HTTP status 501. ").concat(message ? message : "")) || this;
          } else {
            _this = _super.call(this) || this;
          }
          _this.name = "PineconeNotImplementedError";
          return _this;
        }
        return PineconeNotImplementedError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeNotImplementedError = PineconeNotImplementedError;
    var PineconeUnmappedHttpError = (
      /** @class */
      function(_super) {
        __extends(PineconeUnmappedHttpError2, _super);
        function PineconeUnmappedHttpError2(failedRequest) {
          var _this = this;
          var url = failedRequest.url, status = failedRequest.status, body = failedRequest.body, message = failedRequest.message;
          var intro = url ? "An unexpected error occured while calling the ".concat(url, " endpoint. ") : "";
          var statusMsg = status ? "Status: ".concat(status, ". ") : "";
          var bodyMsg = body ? "Body: ".concat(body) : "";
          _this = _super.call(this, [intro, message, statusMsg, bodyMsg].join(" ").trim()) || this;
          _this.name = "PineconeUnmappedHttpError";
          return _this;
        }
        return PineconeUnmappedHttpError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeUnmappedHttpError = PineconeUnmappedHttpError;
    var mapHttpStatusError = function(failedRequestInfo) {
      switch (failedRequestInfo.status) {
        case 400:
          return new PineconeBadRequestError(failedRequestInfo);
        case 401:
          return new PineconeAuthorizationError(failedRequestInfo);
        case 403:
          return new PineconeBadRequestError(failedRequestInfo);
        case 404:
          return new PineconeNotFoundError(failedRequestInfo);
        case 409:
          return new PineconeConflictError(failedRequestInfo);
        case 500:
          return new PineconeInternalServerError(failedRequestInfo);
        case 501:
          return new PineconeNotImplementedError(failedRequestInfo);
        default:
          throw new PineconeUnmappedHttpError(failedRequestInfo);
      }
    };
    exports2.mapHttpStatusError = mapHttpStatusError;
  }
});

// node_modules/@pinecone-database/pinecone/dist/errors/request.js
var require_request = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/errors/request.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PineconeRequestError = exports2.PineconeConnectionError = void 0;
    var base_1 = require_base();
    var PineconeConnectionError = (
      /** @class */
      function(_super) {
        __extends(PineconeConnectionError2, _super);
        function PineconeConnectionError2(e, url) {
          var _this = this;
          var urlMessage = "";
          if (url) {
            urlMessage = " while calling ".concat(url);
          }
          _this = _super.call(this, "Request failed to reach Pinecone".concat(urlMessage, ". This can occur for reasons such as network problems that prevent the request from being completed, or a Pinecone API outage. Check your network connection, and visit https://status.pinecone.io/ to see whether any outages are ongoing."), e) || this;
          _this.name = "PineconeConnectionError";
          return _this;
        }
        return PineconeConnectionError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeConnectionError = PineconeConnectionError;
    var PineconeRequestError = (
      /** @class */
      function(_super) {
        __extends(PineconeRequestError2, _super);
        function PineconeRequestError2(context) {
          var _this = this;
          if (context.response) {
            _this = _super.call(this, "Request failed during a call to ".concat(context.init.method, " ").concat(context.url, " with status ").concat(context.response.status), context.error) || this;
          } else {
            _this = _super.call(this, "Request failed during a call to ".concat(context.init.method, " ").concat(context.url), context.error) || this;
          }
          return _this;
        }
        return PineconeRequestError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeRequestError = PineconeRequestError;
  }
});

// node_modules/@pinecone-database/pinecone/dist/errors/validation.js
var require_validation = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/errors/validation.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PineconeArgumentError = void 0;
    var base_1 = require_base();
    var PineconeArgumentError = (
      /** @class */
      function(_super) {
        __extends(PineconeArgumentError2, _super);
        function PineconeArgumentError2(message) {
          var _this = _super.call(this, "".concat(message)) || this;
          _this.name = "PineconeArgumentError";
          return _this;
        }
        return PineconeArgumentError2;
      }(base_1.BasePineconeError)
    );
    exports2.PineconeArgumentError = PineconeArgumentError;
  }
});

// node_modules/@pinecone-database/pinecone/dist/errors/utils.js
var require_utils = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/errors/utils.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.extractMessage = void 0;
    var extractMessage = function(error) {
      return __awaiter(void 0, void 0, void 0, function() {
        var message, messageJSON;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, error.response.text()];
            case 1:
              message = _a.sent();
              try {
                messageJSON = JSON.parse(message);
                if (messageJSON.message) {
                  message = messageJSON.message;
                }
              } catch (e) {
              }
              return [2, message];
          }
        });
      });
    };
    exports2.extractMessage = extractMessage;
  }
});

// node_modules/@pinecone-database/pinecone/dist/errors/handling.js
var require_handling = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/errors/handling.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.handleApiError = void 0;
    var utils_1 = require_utils();
    var http_1 = require_http();
    var request_1 = require_request();
    var handleApiError = function(e, customMessage, url) {
      return __awaiter(void 0, void 0, void 0, function() {
        var responseError, rawMessage, statusCode, message, _a, err;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              if (!(e instanceof Error && e.name === "ResponseError")) return [3, 5];
              responseError = e;
              return [4, (0, utils_1.extractMessage)(responseError)];
            case 1:
              rawMessage = _b.sent();
              statusCode = responseError.response.status;
              if (!customMessage) return [3, 3];
              return [4, customMessage(statusCode, rawMessage)];
            case 2:
              _a = _b.sent();
              return [3, 4];
            case 3:
              _a = rawMessage;
              _b.label = 4;
            case 4:
              message = _a;
              return [2, (0, http_1.mapHttpStatusError)({
                status: responseError.response.status,
                url: responseError.response.url || url,
                message
              })];
            case 5:
              if (e instanceof request_1.PineconeConnectionError) {
                return [2, e];
              } else {
                err = e;
                return [2, new request_1.PineconeConnectionError(err)];
              }
              _b.label = 6;
            case 6:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    exports2.handleApiError = handleApiError;
  }
});

// node_modules/@pinecone-database/pinecone/dist/errors/index.js
var require_errors = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/errors/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.handleApiError = exports2.extractMessage = exports2.PineconeArgumentError = exports2.BasePineconeError = exports2.PineconeRequestError = exports2.PineconeConnectionError = exports2.PineconeUnableToResolveHostError = exports2.PineconeEnvironmentVarsNotSupportedError = exports2.PineconeUnexpectedResponseError = exports2.PineconeConfigurationError = void 0;
    var config_1 = require_config();
    Object.defineProperty(exports2, "PineconeConfigurationError", { enumerable: true, get: function() {
      return config_1.PineconeConfigurationError;
    } });
    Object.defineProperty(exports2, "PineconeUnexpectedResponseError", { enumerable: true, get: function() {
      return config_1.PineconeUnexpectedResponseError;
    } });
    Object.defineProperty(exports2, "PineconeEnvironmentVarsNotSupportedError", { enumerable: true, get: function() {
      return config_1.PineconeEnvironmentVarsNotSupportedError;
    } });
    Object.defineProperty(exports2, "PineconeUnableToResolveHostError", { enumerable: true, get: function() {
      return config_1.PineconeUnableToResolveHostError;
    } });
    __exportStar(require_http(), exports2);
    var request_1 = require_request();
    Object.defineProperty(exports2, "PineconeConnectionError", { enumerable: true, get: function() {
      return request_1.PineconeConnectionError;
    } });
    Object.defineProperty(exports2, "PineconeRequestError", { enumerable: true, get: function() {
      return request_1.PineconeRequestError;
    } });
    var base_1 = require_base();
    Object.defineProperty(exports2, "BasePineconeError", { enumerable: true, get: function() {
      return base_1.BasePineconeError;
    } });
    var validation_1 = require_validation();
    Object.defineProperty(exports2, "PineconeArgumentError", { enumerable: true, get: function() {
      return validation_1.PineconeArgumentError;
    } });
    var utils_1 = require_utils();
    Object.defineProperty(exports2, "extractMessage", { enumerable: true, get: function() {
      return utils_1.extractMessage;
    } });
    var handling_1 = require_handling();
    Object.defineProperty(exports2, "handleApiError", { enumerable: true, get: function() {
      return handling_1.handleApiError;
    } });
  }
});

// node_modules/@pinecone-database/pinecone/dist/utils/fetch.js
var require_fetch = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/utils/fetch.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getFetch = void 0;
    var errors_1 = require_errors();
    var getFetch = function(config2) {
      if (config2.fetchApi) {
        return config2.fetchApi;
      } else if (global.fetch) {
        return global.fetch;
      } else {
        throw new errors_1.PineconeConfigurationError("No global or user-provided fetch implementations found. Please supply a fetch implementation.");
      }
    };
    exports2.getFetch = getFetch;
  }
});

// node_modules/@pinecone-database/pinecone/dist/utils/index.js
var require_utils2 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/utils/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getFetch = exports2.buildUserAgent = exports2.queryParamsStringify = exports2.normalizeUrl = exports2.debugLog = void 0;
    var debugLog_1 = require_debugLog();
    Object.defineProperty(exports2, "debugLog", { enumerable: true, get: function() {
      return debugLog_1.debugLog;
    } });
    var normalizeUrl_1 = require_normalizeUrl();
    Object.defineProperty(exports2, "normalizeUrl", { enumerable: true, get: function() {
      return normalizeUrl_1.normalizeUrl;
    } });
    var queryParamsStringify_1 = require_queryParamsStringify();
    Object.defineProperty(exports2, "queryParamsStringify", { enumerable: true, get: function() {
      return queryParamsStringify_1.queryParamsStringify;
    } });
    var user_agent_1 = require_user_agent();
    Object.defineProperty(exports2, "buildUserAgent", { enumerable: true, get: function() {
      return user_agent_1.buildUserAgent;
    } });
    var fetch_1 = require_fetch();
    Object.defineProperty(exports2, "getFetch", { enumerable: true, get: function() {
      return fetch_1.getFetch;
    } });
  }
});

// node_modules/@pinecone-database/pinecone/dist/utils/middleware.js
var require_middleware = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/utils/middleware.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    var __spreadArray = exports2 && exports2.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.middleware = void 0;
    var db_control_1 = require_db_control();
    var errors_1 = require_errors();
    var debugMiddleware = [];
    var chalk = function(str, color) {
      var colors = {
        blue: "\x1B[34m",
        red: "\x1B[31m",
        green: "\x1B[32m",
        yellow: "\x1B[33m"
      };
      return colors[color] + str + "\x1B[39m";
    };
    if (typeof process !== "undefined" && process && process.env && process.env.PINECONE_DEBUG) {
      debugLogMiddleware = {
        pre: function(context) {
          return __awaiter(void 0, void 0, void 0, function() {
            var headers;
            return __generator(this, function(_a) {
              console.debug(chalk(">>> Request: ".concat(context.init.method, " ").concat(context.url), "blue"));
              headers = JSON.parse(JSON.stringify(context.init.headers));
              headers["Api-Key"] = "***REDACTED***";
              console.debug(chalk(">>> Headers: ".concat(JSON.stringify(headers)), "blue"));
              if (context.init.body) {
                console.debug(chalk(">>> Body: ".concat(context.init.body), "blue"));
              }
              console.debug("");
              return [
                2
                /*return*/
              ];
            });
          });
        },
        post: function(context) {
          return __awaiter(void 0, void 0, void 0, function() {
            var _a, _b, _c, _d;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  console.debug(chalk("<<< Status: ".concat(context.response.status), "green"));
                  _b = (_a = console).debug;
                  _c = chalk;
                  _d = "<<< Body: ".concat;
                  return [4, context.response.text()];
                case 1:
                  _b.apply(_a, [_c.apply(void 0, [_d.apply("<<< Body: ", [_e.sent()]), "green"])]);
                  console.debug("");
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        }
      };
      debugMiddleware.push(debugLogMiddleware);
    }
    var debugLogMiddleware;
    if (typeof process !== "undefined" && process && process.env && process.env.PINECONE_DEBUG_CURL) {
      debugCurlMiddleware = {
        post: function(context) {
          return __awaiter(void 0, void 0, void 0, function() {
            var headers, cmd;
            return __generator(this, function(_a) {
              headers = '-H "Api-Key: '.concat((context.init.headers || {})["Api-Key"], '"');
              if (context.init.headers && context.init.headers["Content-Type"]) {
                headers += ' -H "Content-Type: '.concat(context.init.headers["Content-Type"], '"');
              }
              cmd = "curl -X ".concat(context.init.method, " ").concat(context.url, " ").concat(headers, " ").concat(context.init.body ? "-d '".concat(context.init.body, "'") : "");
              console.debug(chalk(cmd, "red"));
              console.debug("");
              return [
                2
                /*return*/
              ];
            });
          });
        }
      };
      debugMiddleware.push(debugCurlMiddleware);
    }
    var debugCurlMiddleware;
    exports2.middleware = __spreadArray(__spreadArray([], debugMiddleware, true), [
      {
        onError: function(context) {
          return __awaiter(void 0, void 0, void 0, function() {
            var err;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, (0, errors_1.handleApiError)(context.error, void 0, context.url)];
                case 1:
                  err = _a.sent();
                  throw err;
              }
            });
          });
        },
        post: function(context) {
          return __awaiter(void 0, void 0, void 0, function() {
            var response, err;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  response = context.response;
                  if (!(response.status >= 200 && response.status < 300)) return [3, 1];
                  return [2, response];
                case 1:
                  return [4, (0, errors_1.handleApiError)(new db_control_1.ResponseError(response, "Response returned an error"), void 0, context.url)];
                case 2:
                  err = _a.sent();
                  throw err;
              }
            });
          });
        }
      }
    ], false);
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/indexOperationsBuilder.js
var require_indexOperationsBuilder = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/indexOperationsBuilder.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.indexOperationsBuilder = void 0;
    var db_control_1 = require_db_control();
    var utils_1 = require_utils2();
    var middleware_1 = require_middleware();
    var indexOperationsBuilder = function(config2) {
      var apiKey = config2.apiKey;
      var controllerPath = (0, utils_1.normalizeUrl)(config2.controllerHostUrl) || "https://api.pinecone.io";
      var headers = config2.additionalHeaders || null;
      var apiConfig = {
        basePath: controllerPath,
        apiKey,
        queryParamsStringify: utils_1.queryParamsStringify,
        headers: __assign({ "User-Agent": (0, utils_1.buildUserAgent)(config2), "X-Pinecone-Api-Version": db_control_1.X_PINECONE_API_VERSION }, headers),
        fetchApi: (0, utils_1.getFetch)(config2),
        middleware: middleware_1.middleware
      };
      return new db_control_1.ManageIndexesApi(new db_control_1.Configuration(apiConfig));
    };
    exports2.indexOperationsBuilder = indexOperationsBuilder;
  }
});

// node_modules/@pinecone-database/pinecone/dist/utils/validateProperties.js
var require_validateProperties = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/utils/validateProperties.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ValidateProperties = void 0;
    var errors_1 = require_errors();
    function ValidateProperties(item, validProperties) {
      var itemKeys = Object.keys(item);
      var invalidKeys = itemKeys.filter(function(key) {
        return !validProperties.includes(key);
      });
      if (invalidKeys.length > 0) {
        throw new errors_1.PineconeArgumentError("Object contained invalid properties: ".concat(invalidKeys.join(", "), ". Valid properties include ").concat(validProperties.join(", "), "."));
      }
    }
    exports2.ValidateProperties = ValidateProperties;
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/configureIndex.js
var require_configureIndex = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/configureIndex.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.configureIndex = exports2.ConfigureIndexRequestProperties = void 0;
    var errors_1 = require_errors();
    var validateProperties_1 = require_validateProperties();
    exports2.ConfigureIndexRequestProperties = [
      "deletionProtection",
      "spec"
    ];
    var configureIndex = function(api) {
      var validator = function(indexName, options) {
        if (options) {
          (0, validateProperties_1.ValidateProperties)(options, exports2.ConfigureIndexRequestProperties);
        }
        if (!indexName) {
          throw new errors_1.PineconeArgumentError("You must pass a non-empty string for `indexName` to configureIndex.");
        }
        if (!options.spec && !options.deletionProtection) {
          throw new errors_1.PineconeArgumentError("You must pass either a `spec`, `deletionProtection` or both to configureIndex in order to update.");
        }
        if (options.spec) {
          if (options.spec.pod) {
            (0, validateProperties_1.ValidateProperties)(options.spec.pod, ["replicas", "podType"]);
          }
          if (options.spec.pod && options.spec.pod.replicas) {
            if (options.spec.pod.replicas <= 0) {
              throw new errors_1.PineconeArgumentError("`replicas` must be a positive integer.");
            }
          }
        }
      };
      return function(indexName, options) {
        return __awaiter(void 0, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                validator(indexName, options);
                return [4, api.configureIndex({
                  indexName,
                  configureIndexRequest: options
                })];
              case 1:
                return [2, _a.sent()];
            }
          });
        });
      };
    };
    exports2.configureIndex = configureIndex;
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/types.js
var require_types = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ValidPodTypes = void 0;
    exports2.ValidPodTypes = [
      "s1.x1",
      "s1.x2",
      "s1.x4",
      "s1.x8",
      "p1.x1",
      "p1.x2",
      "p1.x4",
      "p1.x8",
      "p2.x1",
      "p2.x2",
      "p2.x4",
      "p2.x8"
    ];
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/createIndex.js
var require_createIndex = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/createIndex.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createIndex = void 0;
    var db_control_1 = require_db_control();
    var utils_1 = require_utils2();
    var types_1 = require_types();
    var errors_1 = require_errors();
    var validateProperties_1 = require_validateProperties();
    var CreateIndexOptionsProperties = [
      "spec",
      "name",
      "dimension",
      "metric",
      "deletionProtection",
      "waitUntilReady",
      "suppressConflicts"
    ];
    var CreateIndexSpecProperties = ["serverless", "pod"];
    var CreateIndexServerlessSpecProperties = [
      "cloud",
      "region"
    ];
    var CreateIndexPodSpecProperties = [
      "environment",
      "replicas",
      "shards",
      "podType",
      "pods",
      "metadataConfig",
      "sourceCollection"
    ];
    var createIndex = function(api) {
      var validator = function(options) {
        if (options) {
          (0, validateProperties_1.ValidateProperties)(options, CreateIndexOptionsProperties);
        }
        if (!options) {
          throw new errors_1.PineconeArgumentError("You must pass an object with required properties (`name`, `dimension`, `spec`) to create an index.");
        }
        if (!options.name) {
          throw new errors_1.PineconeArgumentError("You must pass a non-empty string for `name` in order to create an index.");
        }
        if (!options.dimension || options.dimension <= 0) {
          throw new errors_1.PineconeArgumentError("You must pass a positive integer for `dimension` in order to create an index.");
        }
        if (!options.spec) {
          throw new errors_1.PineconeArgumentError("You must pass a `pods` or `serverless` `spec` object in order to create an index.");
        }
        if (options.spec) {
          (0, validateProperties_1.ValidateProperties)(options.spec, CreateIndexSpecProperties);
        }
        if (options.spec.serverless) {
          (0, validateProperties_1.ValidateProperties)(options.spec.serverless, CreateIndexServerlessSpecProperties);
          if (!options.spec.serverless.cloud) {
            throw new errors_1.PineconeArgumentError("You must pass a `cloud` for the serverless `spec` object in order to create an index.");
          }
          if (!options.spec.serverless.region) {
            throw new errors_1.PineconeArgumentError("You must pass a `region` for the serverless `spec` object in order to create an index.");
          }
        }
        if (options.spec.pod) {
          (0, validateProperties_1.ValidateProperties)(options.spec.pod, CreateIndexPodSpecProperties);
          if (!options.spec.pod.environment) {
            throw new errors_1.PineconeArgumentError("You must pass an `environment` for the pod `spec` object in order to create an index.");
          }
          if (!options.spec.pod.podType) {
            throw new errors_1.PineconeArgumentError("You must pass a `podType` for the pod `spec` object in order to create an index.");
          }
        }
        if (options.spec.serverless && options.spec.serverless.cloud && !Object.values(db_control_1.ServerlessSpecCloudEnum).includes(options.spec.serverless.cloud)) {
          throw new errors_1.PineconeArgumentError("Invalid cloud value: ".concat(options.spec.serverless.cloud, ". Valid values are: ").concat(Object.values(db_control_1.ServerlessSpecCloudEnum).join(", "), "."));
        }
        if (options.metric && !Object.values(db_control_1.IndexModelMetricEnum).includes(options.metric)) {
          {
            throw new errors_1.PineconeArgumentError("Invalid metric value: ".concat(options.metric, ". Valid values are: 'cosine', 'euclidean', or 'dotproduct.'"));
          }
        }
        if (options.spec.pod && options.spec.pod.replicas && options.spec.pod.replicas <= 0) {
          throw new errors_1.PineconeArgumentError("You must pass a positive integer for `replicas` in order to create an index.");
        }
        if (options.spec.pod && options.spec.pod.pods && options.spec.pod.pods <= 0) {
          throw new errors_1.PineconeArgumentError("You must pass a positive integer for `pods` in order to create an index.");
        }
        if (options.spec.pod && !types_1.ValidPodTypes.includes(options.spec.pod.podType)) {
          throw new errors_1.PineconeArgumentError("Invalid pod type: ".concat(options.spec.pod.podType, ". Valid values are: ").concat(types_1.ValidPodTypes.join(", "), "."));
        }
      };
      return function(options) {
        return __awaiter(void 0, void 0, void 0, function() {
          var createResponse, e_1;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (options && !options.metric) {
                  options.metric = db_control_1.IndexModelMetricEnum.Cosine;
                }
                validator(options);
                _a.label = 1;
              case 1:
                _a.trys.push([1, 5, , 6]);
                return [4, api.createIndex({
                  createIndexRequest: options
                })];
              case 2:
                createResponse = _a.sent();
                if (!options.waitUntilReady) return [3, 4];
                return [4, waitUntilIndexIsReady(api, options.name)];
              case 3:
                return [2, _a.sent()];
              case 4:
                return [2, createResponse];
              case 5:
                e_1 = _a.sent();
                if (!(options.suppressConflicts && e_1 instanceof Error && e_1.name === "PineconeConflictError")) {
                  throw e_1;
                }
                return [3, 6];
              case 6:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
    };
    exports2.createIndex = createIndex;
    var waitUntilIndexIsReady = function(api, indexName, seconds) {
      if (seconds === void 0) {
        seconds = 0;
      }
      return __awaiter(void 0, void 0, void 0, function() {
        var indexDescription, e_2, err;
        var _a;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              _b.trys.push([0, 6, , 8]);
              return [4, api.describeIndex({ indexName })];
            case 1:
              indexDescription = _b.sent();
              if (!!((_a = indexDescription.status) === null || _a === void 0 ? void 0 : _a.ready)) return [3, 4];
              return [4, new Promise(function(r) {
                return setTimeout(r, 1e3);
              })];
            case 2:
              _b.sent();
              return [4, waitUntilIndexIsReady(api, indexName, seconds + 1)];
            case 3:
              return [2, _b.sent()];
            case 4:
              (0, utils_1.debugLog)("Index ".concat(indexName, " is ready after ").concat(seconds));
              return [2, indexDescription];
            case 5:
              return [3, 8];
            case 6:
              e_2 = _b.sent();
              return [4, (0, errors_1.handleApiError)(e_2, function(_, rawMessageText) {
                return __awaiter(void 0, void 0, void 0, function() {
                  return __generator(this, function(_a2) {
                    return [2, "Error creating index ".concat(indexName, ": ").concat(rawMessageText)];
                  });
                });
              })];
            case 7:
              err = _b.sent();
              throw err;
            case 8:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/deleteIndex.js
var require_deleteIndex = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/deleteIndex.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deleteIndex = void 0;
    var errors_1 = require_errors();
    var deleteIndex = function(api) {
      return function(indexName) {
        return __awaiter(void 0, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!indexName) {
                  throw new errors_1.PineconeArgumentError("You must pass a non-empty string for `indexName` in order to delete an index");
                }
                return [4, api.deleteIndex({ indexName })];
              case 1:
                _a.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
    };
    exports2.deleteIndex = deleteIndex;
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/describeIndex.js
var require_describeIndex = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/describeIndex.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.describeIndex = void 0;
    var errors_1 = require_errors();
    var describeIndex = function(api) {
      var removeDeprecatedFields = function(result) {
        if (result.database) {
          for (var _i = 0, _a = Object.keys(result.database); _i < _a.length; _i++) {
            var key = _a[_i];
            if (result.database[key] === void 0) {
              delete result.database[key];
            }
          }
        }
      };
      return function(indexName) {
        return __awaiter(void 0, void 0, void 0, function() {
          var result;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!indexName) {
                  throw new errors_1.PineconeArgumentError("You must pass a non-empty string for `name` in order to describe an index");
                }
                return [4, api.describeIndex({ indexName })];
              case 1:
                result = _a.sent();
                removeDeprecatedFields(result);
                return [2, result];
            }
          });
        });
      };
    };
    exports2.describeIndex = describeIndex;
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/listIndexes.js
var require_listIndexes = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/listIndexes.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.listIndexes = void 0;
    var listIndexes = function(api) {
      return function() {
        return __awaiter(void 0, void 0, void 0, function() {
          var response;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, api.listIndexes()];
              case 1:
                response = _a.sent();
                return [2, response];
            }
          });
        });
      };
    };
    exports2.listIndexes = listIndexes;
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/createCollection.js
var require_createCollection = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/createCollection.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createCollection = exports2.CreateCollectionRequestProperties = void 0;
    var errors_1 = require_errors();
    var validateProperties_1 = require_validateProperties();
    exports2.CreateCollectionRequestProperties = ["source", "name"];
    var createCollection = function(api) {
      var validator = function(options) {
        if (options) {
          (0, validateProperties_1.ValidateProperties)(options, exports2.CreateCollectionRequestProperties);
        }
        if (!options || typeof options !== "object") {
          throw new errors_1.PineconeArgumentError("You must pass a non-empty object with `name` and `source` fields in order to create a collection.");
        }
        if (!options.name && !options.source) {
          throw new errors_1.PineconeArgumentError("The argument to createCollection must have required properties: `name`, `source`.");
        }
        if (!options.name) {
          throw new errors_1.PineconeArgumentError("You must pass a non-empty string for `name` in order to create a collection.");
        }
        if (!options.source) {
          throw new errors_1.PineconeArgumentError("You must pass a non-empty string for `source` in order to create a collection.");
        }
      };
      return function(options) {
        return __awaiter(void 0, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                validator(options);
                return [4, api.createCollection({ createCollectionRequest: options })];
              case 1:
                return [2, _a.sent()];
            }
          });
        });
      };
    };
    exports2.createCollection = createCollection;
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/deleteCollection.js
var require_deleteCollection = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/deleteCollection.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deleteCollection = void 0;
    var errors_1 = require_errors();
    var deleteCollection = function(api) {
      return function(collectionName) {
        return __awaiter(void 0, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!collectionName) {
                  throw new errors_1.PineconeArgumentError("You must pass a non-empty string for `collectionName`");
                }
                return [4, api.deleteCollection({ collectionName })];
              case 1:
                _a.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
    };
    exports2.deleteCollection = deleteCollection;
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/describeCollection.js
var require_describeCollection = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/describeCollection.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.describeCollection = void 0;
    var errors_1 = require_errors();
    var describeCollection = function(api) {
      return function(name) {
        return __awaiter(void 0, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!name || name.length === 0) {
                  throw new errors_1.PineconeArgumentError("You must pass a non-empty string for `name` in order to describe a collection");
                }
                return [4, api.describeCollection({ collectionName: name })];
              case 1:
                return [2, _a.sent()];
            }
          });
        });
      };
    };
    exports2.describeCollection = describeCollection;
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/listCollections.js
var require_listCollections = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/listCollections.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.listCollections = void 0;
    var listCollections = function(api) {
      return function() {
        return __awaiter(void 0, void 0, void 0, function() {
          var results;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, api.listCollections()];
              case 1:
                results = _a.sent();
                return [2, results];
            }
          });
        });
      };
    };
    exports2.listCollections = listCollections;
  }
});

// node_modules/@pinecone-database/pinecone/dist/control/index.js
var require_control = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/control/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.listCollections = exports2.describeCollection = exports2.deleteCollection = exports2.createCollection = exports2.listIndexes = exports2.describeIndex = exports2.deleteIndex = exports2.createIndex = exports2.configureIndex = exports2.indexOperationsBuilder = void 0;
    var indexOperationsBuilder_1 = require_indexOperationsBuilder();
    Object.defineProperty(exports2, "indexOperationsBuilder", { enumerable: true, get: function() {
      return indexOperationsBuilder_1.indexOperationsBuilder;
    } });
    var configureIndex_1 = require_configureIndex();
    Object.defineProperty(exports2, "configureIndex", { enumerable: true, get: function() {
      return configureIndex_1.configureIndex;
    } });
    var createIndex_1 = require_createIndex();
    Object.defineProperty(exports2, "createIndex", { enumerable: true, get: function() {
      return createIndex_1.createIndex;
    } });
    var deleteIndex_1 = require_deleteIndex();
    Object.defineProperty(exports2, "deleteIndex", { enumerable: true, get: function() {
      return deleteIndex_1.deleteIndex;
    } });
    var describeIndex_1 = require_describeIndex();
    Object.defineProperty(exports2, "describeIndex", { enumerable: true, get: function() {
      return describeIndex_1.describeIndex;
    } });
    var listIndexes_1 = require_listIndexes();
    Object.defineProperty(exports2, "listIndexes", { enumerable: true, get: function() {
      return listIndexes_1.listIndexes;
    } });
    var createCollection_1 = require_createCollection();
    Object.defineProperty(exports2, "createCollection", { enumerable: true, get: function() {
      return createCollection_1.createCollection;
    } });
    var deleteCollection_1 = require_deleteCollection();
    Object.defineProperty(exports2, "deleteCollection", { enumerable: true, get: function() {
      return deleteCollection_1.deleteCollection;
    } });
    var describeCollection_1 = require_describeCollection();
    Object.defineProperty(exports2, "describeCollection", { enumerable: true, get: function() {
      return describeCollection_1.describeCollection;
    } });
    var listCollections_1 = require_listCollections();
    Object.defineProperty(exports2, "listCollections", { enumerable: true, get: function() {
      return listCollections_1.listCollections;
    } });
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/indexHostSingleton.js
var require_indexHostSingleton = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/indexHostSingleton.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IndexHostSingleton = void 0;
    var control_1 = require_control();
    var errors_1 = require_errors();
    var utils_1 = require_utils2();
    exports2.IndexHostSingleton = /* @__PURE__ */ function() {
      var _this = this;
      var hostUrls = {};
      var _describeIndex = function(config2, indexName) {
        return __awaiter(_this, void 0, void 0, function() {
          var indexOperationsApi, describeResponse, host;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                indexOperationsApi = (0, control_1.indexOperationsBuilder)(config2);
                return [4, (0, control_1.describeIndex)(indexOperationsApi)(indexName)];
              case 1:
                describeResponse = _a.sent();
                host = describeResponse.host;
                if (!host) {
                  throw new errors_1.PineconeUnableToResolveHostError("The HTTP call succeeded but the host URL could not be resolved. Please make sure the index exists and is in a ready state.");
                } else {
                  return [2, host];
                }
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      var _key = function(config2, indexName) {
        return "".concat(config2.apiKey, "-").concat(indexName);
      };
      var singleton = {
        getHostUrl: function(config2, indexName) {
          return __awaiter(_this, void 0, void 0, function() {
            var cacheKey, hostUrl;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cacheKey = _key(config2, indexName);
                  if (!(cacheKey in hostUrls)) return [3, 1];
                  return [2, hostUrls[cacheKey]];
                case 1:
                  return [4, _describeIndex(config2, indexName)];
                case 2:
                  hostUrl = _a.sent();
                  singleton._set(config2, indexName, hostUrl);
                  if (!hostUrls[cacheKey]) {
                    throw new errors_1.PineconeUnableToResolveHostError("Could not get host for index: ".concat(indexName, ". Call describeIndex('").concat(indexName, "') to check the current status."));
                  }
                  return [2, hostUrls[cacheKey]];
              }
            });
          });
        },
        _reset: function() {
          for (var _i = 0, _a = Object.keys(hostUrls); _i < _a.length; _i++) {
            var key = _a[_i];
            delete hostUrls[key];
          }
        },
        _set: function(config2, indexName, hostUrl) {
          var normalizedHostUrl = (0, utils_1.normalizeUrl)(hostUrl);
          if (!normalizedHostUrl) {
            return;
          }
          var cacheKey = _key(config2, indexName);
          hostUrls[cacheKey] = normalizedHostUrl;
        },
        _delete: function(config2, indexName) {
          var cacheKey = _key(config2, indexName);
          delete hostUrls[cacheKey];
        }
      };
      return singleton;
    }();
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/types.js
var require_types2 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PineconeRecordsProperties = exports2.PineconeConfigurationProperties = void 0;
    exports2.PineconeConfigurationProperties = [
      "apiKey",
      "controllerHostUrl",
      "fetchApi",
      "additionalHeaders",
      "sourceTag"
    ];
    exports2.PineconeRecordsProperties = [
      "id",
      "values",
      "sparseValues",
      "metadata"
    ];
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/upsert.js
var require_upsert = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/upsert.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UpsertCommand = void 0;
    var types_1 = require_types2();
    var errors_1 = require_errors();
    var validateProperties_1 = require_validateProperties();
    var UpsertCommand = (
      /** @class */
      function() {
        function UpsertCommand2(apiProvider, namespace) {
          this.validator = function(records) {
            for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
              var record = records_1[_i];
              (0, validateProperties_1.ValidateProperties)(record, types_1.PineconeRecordsProperties);
            }
            if (records.length === 0) {
              throw new errors_1.PineconeArgumentError("Must pass in at least 1 record to upsert.");
            }
            records.forEach(function(record2) {
              if (!record2.id) {
                throw new errors_1.PineconeArgumentError("Every record must include an `id` property in order to upsert.");
              }
              if (!record2.values) {
                throw new errors_1.PineconeArgumentError("Every record must include a `values` property in order to upsert.");
              }
            });
          };
          this.apiProvider = apiProvider;
          this.namespace = namespace;
        }
        UpsertCommand2.prototype.run = function(records) {
          return __awaiter(this, void 0, void 0, function() {
            var api;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this.validator(records);
                  return [4, this.apiProvider.provide()];
                case 1:
                  api = _a.sent();
                  return [4, api.upsertVectors({
                    upsertRequest: {
                      vectors: records,
                      namespace: this.namespace
                    }
                  })];
                case 2:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return UpsertCommand2;
      }()
    );
    exports2.UpsertCommand = UpsertCommand;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/fetch.js
var require_fetch2 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/fetch.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FetchCommand = void 0;
    var errors_1 = require_errors();
    var FetchCommand = (
      /** @class */
      function() {
        function FetchCommand2(apiProvider, namespace) {
          this.validator = function(options) {
            if (options.length === 0) {
              throw new errors_1.PineconeArgumentError("Must pass in at least 1 recordID.");
            }
          };
          this.apiProvider = apiProvider;
          this.namespace = namespace;
        }
        FetchCommand2.prototype.run = function(ids) {
          return __awaiter(this, void 0, void 0, function() {
            var api, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this.validator(ids);
                  return [4, this.apiProvider.provide()];
                case 1:
                  api = _a.sent();
                  return [4, api.fetchVectors({
                    ids,
                    namespace: this.namespace
                  })];
                case 2:
                  response = _a.sent();
                  return [2, __assign({ records: response.vectors ? response.vectors : {}, namespace: response.namespace ? response.namespace : "" }, response.usage && { usage: response.usage })];
              }
            });
          });
        };
        return FetchCommand2;
      }()
    );
    exports2.FetchCommand = FetchCommand;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/update.js
var require_update = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/update.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UpdateCommand = void 0;
    var errors_1 = require_errors();
    var validateProperties_1 = require_validateProperties();
    var UpdateOptionsProperties = [
      "id",
      "values",
      "sparseValues",
      "metadata"
    ];
    var UpdateCommand = (
      /** @class */
      function() {
        function UpdateCommand2(apiProvider, namespace) {
          this.validator = function(options) {
            if (options) {
              (0, validateProperties_1.ValidateProperties)(options, UpdateOptionsProperties);
            }
            if (options && !options.id) {
              throw new errors_1.PineconeArgumentError("You must enter a non-empty string for the `id` field in order to update a record.");
            }
          };
          this.apiProvider = apiProvider;
          this.namespace = namespace;
        }
        UpdateCommand2.prototype.run = function(options) {
          return __awaiter(this, void 0, void 0, function() {
            var requestOptions, api;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this.validator(options);
                  requestOptions = {
                    id: options["id"],
                    values: options["values"],
                    sparseValues: options["sparseValues"],
                    setMetadata: options["metadata"]
                  };
                  return [4, this.apiProvider.provide()];
                case 1:
                  api = _a.sent();
                  return [4, api.updateVector({
                    updateRequest: __assign(__assign({}, requestOptions), { namespace: this.namespace })
                  })];
                case 2:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return UpdateCommand2;
      }()
    );
    exports2.UpdateCommand = UpdateCommand;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/query.js
var require_query = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/query.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.QueryCommand = void 0;
    var errors_1 = require_errors();
    var validateProperties_1 = require_validateProperties();
    var QueryOptionsProperties = [
      "id",
      "vector",
      "sparseVector",
      "includeValues",
      "includeMetadata",
      "filter",
      "topK"
    ];
    var QueryCommand = (
      /** @class */
      function() {
        function QueryCommand2(apiProvider, namespace) {
          this.validator = function(options) {
            var _a, _b;
            if (options) {
              (0, validateProperties_1.ValidateProperties)(options, QueryOptionsProperties);
            }
            if (!options) {
              throw new errors_1.PineconeArgumentError("You must enter a query configuration object to query the index.");
            }
            if (options && !options.topK) {
              throw new errors_1.PineconeArgumentError("You must enter an integer for the `topK` search results to be returned.");
            }
            if (options && options.topK && options.topK < 1) {
              throw new errors_1.PineconeArgumentError("`topK` property must be greater than 0.");
            }
            if (options && options.filter) {
              var keys = Object.keys(options.filter);
              if (keys.length === 0) {
                throw new errors_1.PineconeArgumentError("You must enter a `filter` object with at least one key-value pair.");
              }
            }
            if ("id" in options) {
              if (!options.id) {
                throw new errors_1.PineconeArgumentError("You must enter non-empty string for `id` to query by record ID.");
              }
            }
            if ("vector" in options) {
              if (options.vector.length === 0) {
                throw new errors_1.PineconeArgumentError("You must enter an array of `RecordValues` in order to query by vector values.");
              }
            }
            if ("sparseVector" in options) {
              if (((_a = options.sparseVector) === null || _a === void 0 ? void 0 : _a.indices.length) === 0 || ((_b = options.sparseVector) === null || _b === void 0 ? void 0 : _b.values.length) === 0) {
                throw new errors_1.PineconeArgumentError("You must enter a `RecordSparseValues` object with `indices` and `values` properties in order to query by sparse vector values.");
              }
            }
          };
          this.apiProvider = apiProvider;
          this.namespace = namespace;
        }
        QueryCommand2.prototype.run = function(query) {
          return __awaiter(this, void 0, void 0, function() {
            var api, results, matches;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this.validator(query);
                  return [4, this.apiProvider.provide()];
                case 1:
                  api = _a.sent();
                  return [4, api.queryVectors({
                    queryRequest: __assign(__assign({}, query), { namespace: this.namespace })
                  })];
                case 2:
                  results = _a.sent();
                  matches = results.matches ? results.matches : [];
                  return [2, __assign({ matches, namespace: this.namespace }, results.usage && { usage: results.usage })];
              }
            });
          });
        };
        return QueryCommand2;
      }()
    );
    exports2.QueryCommand = QueryCommand;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/deleteOne.js
var require_deleteOne = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/deleteOne.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deleteOne = void 0;
    var errors_1 = require_errors();
    var deleteOne = function(apiProvider, namespace) {
      var validator = function(options) {
        if (!options) {
          throw new errors_1.PineconeArgumentError("You must pass a non-empty string for `options` in order to delete a record.");
        }
      };
      return function(options) {
        return __awaiter(void 0, void 0, void 0, function() {
          var api;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                validator(options);
                return [4, apiProvider.provide()];
              case 1:
                api = _a.sent();
                return [4, api.deleteVectors({ deleteRequest: { ids: [options], namespace } })];
              case 2:
                _a.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
    };
    exports2.deleteOne = deleteOne;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/deleteMany.js
var require_deleteMany = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/deleteMany.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deleteMany = void 0;
    var errors_1 = require_errors();
    var deleteMany = function(apiProvider, namespace) {
      var FilterValidator = function(options) {
        for (var key in options) {
          if (!options[key]) {
            throw new errors_1.PineconeArgumentError("`filter` property cannot be empty for key ".concat(key));
          }
        }
      };
      var validator = function(options) {
        if (!Array.isArray(options)) {
          return FilterValidator(options);
        } else {
          if (options.length === 0) {
            throw new errors_1.PineconeArgumentError("Must pass in at least 1 record ID.");
          }
        }
      };
      return function(options) {
        return __awaiter(void 0, void 0, void 0, function() {
          var requestOptions, api;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                validator(options);
                requestOptions = {};
                if (Array.isArray(options)) {
                  requestOptions.ids = options;
                } else {
                  requestOptions.filter = options;
                }
                return [4, apiProvider.provide()];
              case 1:
                api = _a.sent();
                return [4, api.deleteVectors({
                  deleteRequest: __assign(__assign({}, requestOptions), { namespace })
                })];
              case 2:
                _a.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
    };
    exports2.deleteMany = deleteMany;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/deleteAll.js
var require_deleteAll = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/deleteAll.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deleteAll = void 0;
    var deleteAll = function(apiProvider, namespace) {
      return function() {
        return __awaiter(void 0, void 0, void 0, function() {
          var api;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, apiProvider.provide()];
              case 1:
                api = _a.sent();
                return [4, api.deleteVectors({ deleteRequest: { deleteAll: true, namespace } })];
              case 2:
                _a.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
    };
    exports2.deleteAll = deleteAll;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/describeIndexStats.js
var require_describeIndexStats = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/describeIndexStats.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.describeIndexStats = void 0;
    var errors_1 = require_errors();
    var validateProperties_1 = require_validateProperties();
    var describeIndexStats = function(apiProvider) {
      var validator = function(options) {
        if (options) {
          (0, validateProperties_1.ValidateProperties)(options, ["filter"]);
        }
        var map = options["filter"];
        for (var key in map) {
          if (!map[key]) {
            throw new errors_1.PineconeArgumentError("`filter` property cannot be empty for ".concat(key));
          }
        }
      };
      return function(options) {
        return __awaiter(void 0, void 0, void 0, function() {
          var api, results, mappedResult, key;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (options) {
                  validator(options);
                }
                return [4, apiProvider.provide()];
              case 1:
                api = _a.sent();
                return [4, api.describeIndexStats({
                  describeIndexStatsRequest: __assign({}, options)
                })];
              case 2:
                results = _a.sent();
                mappedResult = {
                  namespaces: {},
                  dimension: results.dimension,
                  indexFullness: results.indexFullness,
                  totalRecordCount: results.totalVectorCount
                };
                if (results.namespaces) {
                  for (key in results.namespaces) {
                    mappedResult.namespaces[key] = {
                      recordCount: results.namespaces[key].vectorCount
                    };
                  }
                }
                return [2, mappedResult];
            }
          });
        });
      };
    };
    exports2.describeIndexStats = describeIndexStats;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/runtime.js
var require_runtime2 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/runtime.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TextApiResponse = exports2.BlobApiResponse = exports2.VoidApiResponse = exports2.JSONApiResponse = exports2.canConsumeForm = exports2.mapValues = exports2.querystring = exports2.exists = exports2.COLLECTION_FORMATS = exports2.RequiredError = exports2.FetchError = exports2.ResponseError = exports2.BaseAPI = exports2.DefaultConfig = exports2.Configuration = exports2.BASE_PATH = void 0;
    exports2.BASE_PATH = "https://unknown".replace(/\/+$/, "");
    var Configuration = (
      /** @class */
      function() {
        function Configuration2(configuration) {
          if (configuration === void 0) {
            configuration = {};
          }
          this.configuration = configuration;
        }
        Object.defineProperty(Configuration2.prototype, "config", {
          set: function(configuration) {
            this.configuration = configuration;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "basePath", {
          get: function() {
            return this.configuration.basePath != null ? this.configuration.basePath : exports2.BASE_PATH;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "fetchApi", {
          get: function() {
            return this.configuration.fetchApi;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "middleware", {
          get: function() {
            return this.configuration.middleware || [];
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "queryParamsStringify", {
          get: function() {
            return this.configuration.queryParamsStringify || querystring;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "username", {
          get: function() {
            return this.configuration.username;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "password", {
          get: function() {
            return this.configuration.password;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "apiKey", {
          get: function() {
            var apiKey = this.configuration.apiKey;
            if (apiKey) {
              return typeof apiKey === "function" ? apiKey : function() {
                return apiKey;
              };
            }
            return void 0;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "accessToken", {
          get: function() {
            var _this = this;
            var accessToken = this.configuration.accessToken;
            if (accessToken) {
              return typeof accessToken === "function" ? accessToken : function() {
                return __awaiter(_this, void 0, void 0, function() {
                  return __generator(this, function(_a) {
                    return [2, accessToken];
                  });
                });
              };
            }
            return void 0;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "headers", {
          get: function() {
            return this.configuration.headers;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "credentials", {
          get: function() {
            return this.configuration.credentials;
          },
          enumerable: false,
          configurable: true
        });
        return Configuration2;
      }()
    );
    exports2.Configuration = Configuration;
    exports2.DefaultConfig = new Configuration();
    var BaseAPI = (
      /** @class */
      function() {
        function BaseAPI2(configuration) {
          if (configuration === void 0) {
            configuration = exports2.DefaultConfig;
          }
          var _this = this;
          this.configuration = configuration;
          this.fetchApi = function(url, init) {
            return __awaiter(_this, void 0, void 0, function() {
              var fetchParams, _i, _a, middleware, response, e_1, _b, _c, middleware, _d, _e, middleware;
              return __generator(this, function(_f) {
                switch (_f.label) {
                  case 0:
                    fetchParams = { url, init };
                    _i = 0, _a = this.middleware;
                    _f.label = 1;
                  case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    middleware = _a[_i];
                    if (!middleware.pre) return [3, 3];
                    return [4, middleware.pre(__assign({ fetch: this.fetchApi }, fetchParams))];
                  case 2:
                    fetchParams = _f.sent() || fetchParams;
                    _f.label = 3;
                  case 3:
                    _i++;
                    return [3, 1];
                  case 4:
                    response = void 0;
                    _f.label = 5;
                  case 5:
                    _f.trys.push([5, 7, , 12]);
                    return [4, (this.configuration.fetchApi || fetch)(fetchParams.url, fetchParams.init)];
                  case 6:
                    response = _f.sent();
                    return [3, 12];
                  case 7:
                    e_1 = _f.sent();
                    _b = 0, _c = this.middleware;
                    _f.label = 8;
                  case 8:
                    if (!(_b < _c.length)) return [3, 11];
                    middleware = _c[_b];
                    if (!middleware.onError) return [3, 10];
                    return [4, middleware.onError({
                      fetch: this.fetchApi,
                      url: fetchParams.url,
                      init: fetchParams.init,
                      error: e_1,
                      response: response ? response.clone() : void 0
                    })];
                  case 9:
                    response = _f.sent() || response;
                    _f.label = 10;
                  case 10:
                    _b++;
                    return [3, 8];
                  case 11:
                    if (response === void 0) {
                      if (e_1 instanceof Error) {
                        throw new FetchError(e_1, "The request failed and the interceptors did not return an alternative response");
                      } else {
                        throw e_1;
                      }
                    }
                    return [3, 12];
                  case 12:
                    _d = 0, _e = this.middleware;
                    _f.label = 13;
                  case 13:
                    if (!(_d < _e.length)) return [3, 16];
                    middleware = _e[_d];
                    if (!middleware.post) return [3, 15];
                    return [4, middleware.post({
                      fetch: this.fetchApi,
                      url: fetchParams.url,
                      init: fetchParams.init,
                      response: response.clone()
                    })];
                  case 14:
                    response = _f.sent() || response;
                    _f.label = 15;
                  case 15:
                    _d++;
                    return [3, 13];
                  case 16:
                    return [2, response];
                }
              });
            });
          };
          this.middleware = configuration.middleware;
        }
        BaseAPI2.prototype.withMiddleware = function() {
          var _a;
          var middlewares = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            middlewares[_i] = arguments[_i];
          }
          var next = this.clone();
          next.middleware = (_a = next.middleware).concat.apply(_a, middlewares);
          return next;
        };
        BaseAPI2.prototype.withPreMiddleware = function() {
          var preMiddlewares = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            preMiddlewares[_i] = arguments[_i];
          }
          var middlewares = preMiddlewares.map(function(pre) {
            return { pre };
          });
          return this.withMiddleware.apply(this, middlewares);
        };
        BaseAPI2.prototype.withPostMiddleware = function() {
          var postMiddlewares = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            postMiddlewares[_i] = arguments[_i];
          }
          var middlewares = postMiddlewares.map(function(post) {
            return { post };
          });
          return this.withMiddleware.apply(this, middlewares);
        };
        BaseAPI2.prototype.isJsonMime = function(mime) {
          if (!mime) {
            return false;
          }
          return BaseAPI2.jsonRegex.test(mime);
        };
        BaseAPI2.prototype.request = function(context, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var _a, url, init, response;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, this.createFetchParams(context, initOverrides)];
                case 1:
                  _a = _b.sent(), url = _a.url, init = _a.init;
                  return [4, this.fetchApi(url, init)];
                case 2:
                  response = _b.sent();
                  if (response && (response.status >= 200 && response.status < 300)) {
                    return [2, response];
                  }
                  throw new ResponseError(response, "Response returned an error code");
              }
            });
          });
        };
        BaseAPI2.prototype.createFetchParams = function(context, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var url, headers, initOverrideFn, initParams, overriddenInit, _a, body, init;
            var _this = this;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  url = this.configuration.basePath + context.path;
                  if (context.query !== void 0 && Object.keys(context.query).length !== 0) {
                    url += "?" + this.configuration.queryParamsStringify(context.query);
                  }
                  headers = Object.assign({}, this.configuration.headers, context.headers);
                  Object.keys(headers).forEach(function(key) {
                    return headers[key] === void 0 ? delete headers[key] : {};
                  });
                  initOverrideFn = typeof initOverrides === "function" ? initOverrides : function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      return __generator(this, function(_a2) {
                        return [2, initOverrides];
                      });
                    });
                  };
                  initParams = {
                    method: context.method,
                    headers,
                    body: context.body,
                    credentials: this.configuration.credentials
                  };
                  _a = [__assign({}, initParams)];
                  return [4, initOverrideFn({
                    init: initParams,
                    context
                  })];
                case 1:
                  overriddenInit = __assign.apply(void 0, _a.concat([_b.sent()]));
                  if (isFormData(overriddenInit.body) || overriddenInit.body instanceof URLSearchParams || isBlob(overriddenInit.body)) {
                    body = overriddenInit.body;
                  } else if (this.isJsonMime(headers["Content-Type"])) {
                    body = JSON.stringify(overriddenInit.body);
                  } else {
                    body = overriddenInit.body;
                  }
                  init = __assign(__assign({}, overriddenInit), { body });
                  return [2, { url, init }];
              }
            });
          });
        };
        BaseAPI2.prototype.clone = function() {
          var constructor = this.constructor;
          var next = new constructor(this.configuration);
          next.middleware = this.middleware.slice();
          return next;
        };
        BaseAPI2.jsonRegex = new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$", "i");
        return BaseAPI2;
      }()
    );
    exports2.BaseAPI = BaseAPI;
    function isBlob(value) {
      return typeof Blob !== "undefined" && value instanceof Blob;
    }
    function isFormData(value) {
      return typeof FormData !== "undefined" && value instanceof FormData;
    }
    var ResponseError = (
      /** @class */
      function(_super) {
        __extends(ResponseError2, _super);
        function ResponseError2(response, msg) {
          var _this = _super.call(this, msg) || this;
          _this.response = response;
          _this.name = "ResponseError";
          return _this;
        }
        return ResponseError2;
      }(Error)
    );
    exports2.ResponseError = ResponseError;
    var FetchError = (
      /** @class */
      function(_super) {
        __extends(FetchError2, _super);
        function FetchError2(cause, msg) {
          var _this = _super.call(this, msg) || this;
          _this.cause = cause;
          _this.name = "FetchError";
          return _this;
        }
        return FetchError2;
      }(Error)
    );
    exports2.FetchError = FetchError;
    var RequiredError = (
      /** @class */
      function(_super) {
        __extends(RequiredError2, _super);
        function RequiredError2(field, msg) {
          var _this = _super.call(this, msg) || this;
          _this.field = field;
          _this.name = "RequiredError";
          return _this;
        }
        return RequiredError2;
      }(Error)
    );
    exports2.RequiredError = RequiredError;
    exports2.COLLECTION_FORMATS = {
      csv: ",",
      ssv: " ",
      tsv: "	",
      pipes: "|"
    };
    function exists(json, key) {
      var value = json[key];
      return value !== null && value !== void 0;
    }
    exports2.exists = exists;
    function querystring(params, prefix) {
      if (prefix === void 0) {
        prefix = "";
      }
      return Object.keys(params).map(function(key) {
        return querystringSingleKey(key, params[key], prefix);
      }).filter(function(part) {
        return part.length > 0;
      }).join("&");
    }
    exports2.querystring = querystring;
    function querystringSingleKey(key, value, keyPrefix) {
      if (keyPrefix === void 0) {
        keyPrefix = "";
      }
      var fullKey = keyPrefix + (keyPrefix.length ? "[".concat(key, "]") : key);
      if (value instanceof Array) {
        var multiValue = value.map(function(singleValue) {
          return encodeURIComponent(String(singleValue));
        }).join("&".concat(encodeURIComponent(fullKey), "="));
        return "".concat(encodeURIComponent(fullKey), "=").concat(multiValue);
      }
      if (value instanceof Set) {
        var valueAsArray = Array.from(value);
        return querystringSingleKey(key, valueAsArray, keyPrefix);
      }
      if (value instanceof Date) {
        return "".concat(encodeURIComponent(fullKey), "=").concat(encodeURIComponent(value.toISOString()));
      }
      if (value instanceof Object) {
        return querystring(value, fullKey);
      }
      return "".concat(encodeURIComponent(fullKey), "=").concat(encodeURIComponent(String(value)));
    }
    function mapValues(data, fn) {
      return Object.keys(data).reduce(function(acc, key) {
        var _a;
        return __assign(__assign({}, acc), (_a = {}, _a[key] = fn(data[key]), _a));
      }, {});
    }
    exports2.mapValues = mapValues;
    function canConsumeForm(consumes) {
      for (var _i = 0, consumes_1 = consumes; _i < consumes_1.length; _i++) {
        var consume = consumes_1[_i];
        if ("multipart/form-data" === consume.contentType) {
          return true;
        }
      }
      return false;
    }
    exports2.canConsumeForm = canConsumeForm;
    var JSONApiResponse = (
      /** @class */
      function() {
        function JSONApiResponse2(raw, transformer) {
          if (transformer === void 0) {
            transformer = function(jsonValue) {
              return jsonValue;
            };
          }
          this.raw = raw;
          this.transformer = transformer;
        }
        JSONApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _a = this.transformer;
                  return [4, this.raw.json()];
                case 1:
                  return [2, _a.apply(this, [_b.sent()])];
              }
            });
          });
        };
        return JSONApiResponse2;
      }()
    );
    exports2.JSONApiResponse = JSONApiResponse;
    var VoidApiResponse = (
      /** @class */
      function() {
        function VoidApiResponse2(raw) {
          this.raw = raw;
        }
        VoidApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, void 0];
            });
          });
        };
        return VoidApiResponse2;
      }()
    );
    exports2.VoidApiResponse = VoidApiResponse;
    var BlobApiResponse = (
      /** @class */
      function() {
        function BlobApiResponse2(raw) {
          this.raw = raw;
        }
        BlobApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.raw.blob()];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ;
        return BlobApiResponse2;
      }()
    );
    exports2.BlobApiResponse = BlobApiResponse;
    var TextApiResponse = (
      /** @class */
      function() {
        function TextApiResponse2(raw) {
          this.raw = raw;
        }
        TextApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.raw.text()];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ;
        return TextApiResponse2;
      }()
    );
    exports2.TextApiResponse = TextApiResponse;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/DeleteRequest.js
var require_DeleteRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/DeleteRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DeleteRequestToJSON = exports2.DeleteRequestFromJSONTyped = exports2.DeleteRequestFromJSON = exports2.instanceOfDeleteRequest = void 0;
    var runtime_1 = require_runtime2();
    function instanceOfDeleteRequest(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfDeleteRequest = instanceOfDeleteRequest;
    function DeleteRequestFromJSON(json) {
      return DeleteRequestFromJSONTyped(json, false);
    }
    exports2.DeleteRequestFromJSON = DeleteRequestFromJSON;
    function DeleteRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "ids": !(0, runtime_1.exists)(json, "ids") ? void 0 : json["ids"],
        "deleteAll": !(0, runtime_1.exists)(json, "deleteAll") ? void 0 : json["deleteAll"],
        "namespace": !(0, runtime_1.exists)(json, "namespace") ? void 0 : json["namespace"],
        "filter": !(0, runtime_1.exists)(json, "filter") ? void 0 : json["filter"]
      };
    }
    exports2.DeleteRequestFromJSONTyped = DeleteRequestFromJSONTyped;
    function DeleteRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "ids": value.ids,
        "deleteAll": value.deleteAll,
        "namespace": value.namespace,
        "filter": value.filter
      };
    }
    exports2.DeleteRequestToJSON = DeleteRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/DescribeIndexStatsRequest.js
var require_DescribeIndexStatsRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/DescribeIndexStatsRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DescribeIndexStatsRequestToJSON = exports2.DescribeIndexStatsRequestFromJSONTyped = exports2.DescribeIndexStatsRequestFromJSON = exports2.instanceOfDescribeIndexStatsRequest = void 0;
    var runtime_1 = require_runtime2();
    function instanceOfDescribeIndexStatsRequest(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfDescribeIndexStatsRequest = instanceOfDescribeIndexStatsRequest;
    function DescribeIndexStatsRequestFromJSON(json) {
      return DescribeIndexStatsRequestFromJSONTyped(json, false);
    }
    exports2.DescribeIndexStatsRequestFromJSON = DescribeIndexStatsRequestFromJSON;
    function DescribeIndexStatsRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "filter": !(0, runtime_1.exists)(json, "filter") ? void 0 : json["filter"]
      };
    }
    exports2.DescribeIndexStatsRequestFromJSONTyped = DescribeIndexStatsRequestFromJSONTyped;
    function DescribeIndexStatsRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "filter": value.filter
      };
    }
    exports2.DescribeIndexStatsRequestToJSON = DescribeIndexStatsRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/Usage.js
var require_Usage = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/Usage.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UsageToJSON = exports2.UsageFromJSONTyped = exports2.UsageFromJSON = exports2.instanceOfUsage = void 0;
    var runtime_1 = require_runtime2();
    function instanceOfUsage(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfUsage = instanceOfUsage;
    function UsageFromJSON(json) {
      return UsageFromJSONTyped(json, false);
    }
    exports2.UsageFromJSON = UsageFromJSON;
    function UsageFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "readUnits": !(0, runtime_1.exists)(json, "readUnits") ? void 0 : json["readUnits"]
      };
    }
    exports2.UsageFromJSONTyped = UsageFromJSONTyped;
    function UsageToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "readUnits": value.readUnits
      };
    }
    exports2.UsageToJSON = UsageToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/SparseValues.js
var require_SparseValues = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/SparseValues.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SparseValuesToJSON = exports2.SparseValuesFromJSONTyped = exports2.SparseValuesFromJSON = exports2.instanceOfSparseValues = void 0;
    function instanceOfSparseValues(value) {
      var isInstance = true;
      isInstance = isInstance && "indices" in value;
      isInstance = isInstance && "values" in value;
      return isInstance;
    }
    exports2.instanceOfSparseValues = instanceOfSparseValues;
    function SparseValuesFromJSON(json) {
      return SparseValuesFromJSONTyped(json, false);
    }
    exports2.SparseValuesFromJSON = SparseValuesFromJSON;
    function SparseValuesFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "indices": json["indices"],
        "values": json["values"]
      };
    }
    exports2.SparseValuesFromJSONTyped = SparseValuesFromJSONTyped;
    function SparseValuesToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "indices": value.indices,
        "values": value.values
      };
    }
    exports2.SparseValuesToJSON = SparseValuesToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/Vector.js
var require_Vector = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/Vector.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.VectorToJSON = exports2.VectorFromJSONTyped = exports2.VectorFromJSON = exports2.instanceOfVector = void 0;
    var runtime_1 = require_runtime2();
    var SparseValues_1 = require_SparseValues();
    function instanceOfVector(value) {
      var isInstance = true;
      isInstance = isInstance && "id" in value;
      isInstance = isInstance && "values" in value;
      return isInstance;
    }
    exports2.instanceOfVector = instanceOfVector;
    function VectorFromJSON(json) {
      return VectorFromJSONTyped(json, false);
    }
    exports2.VectorFromJSON = VectorFromJSON;
    function VectorFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "id": json["id"],
        "values": json["values"],
        "sparseValues": !(0, runtime_1.exists)(json, "sparseValues") ? void 0 : (0, SparseValues_1.SparseValuesFromJSON)(json["sparseValues"]),
        "metadata": !(0, runtime_1.exists)(json, "metadata") ? void 0 : json["metadata"]
      };
    }
    exports2.VectorFromJSONTyped = VectorFromJSONTyped;
    function VectorToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "id": value.id,
        "values": value.values,
        "sparseValues": (0, SparseValues_1.SparseValuesToJSON)(value.sparseValues),
        "metadata": value.metadata
      };
    }
    exports2.VectorToJSON = VectorToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/FetchResponse.js
var require_FetchResponse = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/FetchResponse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FetchResponseToJSON = exports2.FetchResponseFromJSONTyped = exports2.FetchResponseFromJSON = exports2.instanceOfFetchResponse = void 0;
    var runtime_1 = require_runtime2();
    var Usage_1 = require_Usage();
    var Vector_1 = require_Vector();
    function instanceOfFetchResponse(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfFetchResponse = instanceOfFetchResponse;
    function FetchResponseFromJSON(json) {
      return FetchResponseFromJSONTyped(json, false);
    }
    exports2.FetchResponseFromJSON = FetchResponseFromJSON;
    function FetchResponseFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "vectors": !(0, runtime_1.exists)(json, "vectors") ? void 0 : (0, runtime_1.mapValues)(json["vectors"], Vector_1.VectorFromJSON),
        "namespace": !(0, runtime_1.exists)(json, "namespace") ? void 0 : json["namespace"],
        "usage": !(0, runtime_1.exists)(json, "usage") ? void 0 : (0, Usage_1.UsageFromJSON)(json["usage"])
      };
    }
    exports2.FetchResponseFromJSONTyped = FetchResponseFromJSONTyped;
    function FetchResponseToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "vectors": value.vectors === void 0 ? void 0 : (0, runtime_1.mapValues)(value.vectors, Vector_1.VectorToJSON),
        "namespace": value.namespace,
        "usage": (0, Usage_1.UsageToJSON)(value.usage)
      };
    }
    exports2.FetchResponseToJSON = FetchResponseToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ImportErrorMode.js
var require_ImportErrorMode = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ImportErrorMode.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ImportErrorModeToJSON = exports2.ImportErrorModeFromJSONTyped = exports2.ImportErrorModeFromJSON = exports2.instanceOfImportErrorMode = exports2.ImportErrorModeOnErrorEnum = void 0;
    var runtime_1 = require_runtime2();
    exports2.ImportErrorModeOnErrorEnum = {
      Abort: "abort",
      Continue: "continue"
    };
    function instanceOfImportErrorMode(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfImportErrorMode = instanceOfImportErrorMode;
    function ImportErrorModeFromJSON(json) {
      return ImportErrorModeFromJSONTyped(json, false);
    }
    exports2.ImportErrorModeFromJSON = ImportErrorModeFromJSON;
    function ImportErrorModeFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "onError": !(0, runtime_1.exists)(json, "onError") ? void 0 : json["onError"]
      };
    }
    exports2.ImportErrorModeFromJSONTyped = ImportErrorModeFromJSONTyped;
    function ImportErrorModeToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "onError": value.onError
      };
    }
    exports2.ImportErrorModeToJSON = ImportErrorModeToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ImportModel.js
var require_ImportModel = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ImportModel.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ImportModelToJSON = exports2.ImportModelFromJSONTyped = exports2.ImportModelFromJSON = exports2.instanceOfImportModel = exports2.ImportModelStatusEnum = void 0;
    var runtime_1 = require_runtime2();
    exports2.ImportModelStatusEnum = {
      Pending: "Pending",
      InProgress: "InProgress",
      Failed: "Failed",
      Completed: "Completed",
      Cancelled: "Cancelled"
    };
    function instanceOfImportModel(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfImportModel = instanceOfImportModel;
    function ImportModelFromJSON(json) {
      return ImportModelFromJSONTyped(json, false);
    }
    exports2.ImportModelFromJSON = ImportModelFromJSON;
    function ImportModelFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "id": !(0, runtime_1.exists)(json, "id") ? void 0 : json["id"],
        "uri": !(0, runtime_1.exists)(json, "uri") ? void 0 : json["uri"],
        "status": !(0, runtime_1.exists)(json, "status") ? void 0 : json["status"],
        "createdAt": !(0, runtime_1.exists)(json, "createdAt") ? void 0 : new Date(json["createdAt"]),
        "finishedAt": !(0, runtime_1.exists)(json, "finishedAt") ? void 0 : new Date(json["finishedAt"]),
        "percentComplete": !(0, runtime_1.exists)(json, "percentComplete") ? void 0 : json["percentComplete"],
        "recordsImported": !(0, runtime_1.exists)(json, "recordsImported") ? void 0 : json["recordsImported"],
        "error": !(0, runtime_1.exists)(json, "error") ? void 0 : json["error"]
      };
    }
    exports2.ImportModelFromJSONTyped = ImportModelFromJSONTyped;
    function ImportModelToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "id": value.id,
        "uri": value.uri,
        "status": value.status,
        "createdAt": value.createdAt === void 0 ? void 0 : value.createdAt.toISOString(),
        "finishedAt": value.finishedAt === void 0 ? void 0 : value.finishedAt.toISOString(),
        "percentComplete": value.percentComplete,
        "recordsImported": value.recordsImported,
        "error": value.error
      };
    }
    exports2.ImportModelToJSON = ImportModelToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/NamespaceSummary.js
var require_NamespaceSummary = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/NamespaceSummary.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NamespaceSummaryToJSON = exports2.NamespaceSummaryFromJSONTyped = exports2.NamespaceSummaryFromJSON = exports2.instanceOfNamespaceSummary = void 0;
    var runtime_1 = require_runtime2();
    function instanceOfNamespaceSummary(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfNamespaceSummary = instanceOfNamespaceSummary;
    function NamespaceSummaryFromJSON(json) {
      return NamespaceSummaryFromJSONTyped(json, false);
    }
    exports2.NamespaceSummaryFromJSON = NamespaceSummaryFromJSON;
    function NamespaceSummaryFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "vectorCount": !(0, runtime_1.exists)(json, "vectorCount") ? void 0 : json["vectorCount"]
      };
    }
    exports2.NamespaceSummaryFromJSONTyped = NamespaceSummaryFromJSONTyped;
    function NamespaceSummaryToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "vectorCount": value.vectorCount
      };
    }
    exports2.NamespaceSummaryToJSON = NamespaceSummaryToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/IndexDescription.js
var require_IndexDescription = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/IndexDescription.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IndexDescriptionToJSON = exports2.IndexDescriptionFromJSONTyped = exports2.IndexDescriptionFromJSON = exports2.instanceOfIndexDescription = void 0;
    var runtime_1 = require_runtime2();
    var NamespaceSummary_1 = require_NamespaceSummary();
    function instanceOfIndexDescription(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfIndexDescription = instanceOfIndexDescription;
    function IndexDescriptionFromJSON(json) {
      return IndexDescriptionFromJSONTyped(json, false);
    }
    exports2.IndexDescriptionFromJSON = IndexDescriptionFromJSON;
    function IndexDescriptionFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "namespaces": !(0, runtime_1.exists)(json, "namespaces") ? void 0 : (0, runtime_1.mapValues)(json["namespaces"], NamespaceSummary_1.NamespaceSummaryFromJSON),
        "dimension": !(0, runtime_1.exists)(json, "dimension") ? void 0 : json["dimension"],
        "indexFullness": !(0, runtime_1.exists)(json, "indexFullness") ? void 0 : json["indexFullness"],
        "totalVectorCount": !(0, runtime_1.exists)(json, "totalVectorCount") ? void 0 : json["totalVectorCount"]
      };
    }
    exports2.IndexDescriptionFromJSONTyped = IndexDescriptionFromJSONTyped;
    function IndexDescriptionToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "namespaces": value.namespaces === void 0 ? void 0 : (0, runtime_1.mapValues)(value.namespaces, NamespaceSummary_1.NamespaceSummaryToJSON),
        "dimension": value.dimension,
        "indexFullness": value.indexFullness,
        "totalVectorCount": value.totalVectorCount
      };
    }
    exports2.IndexDescriptionToJSON = IndexDescriptionToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/Pagination.js
var require_Pagination = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/Pagination.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PaginationToJSON = exports2.PaginationFromJSONTyped = exports2.PaginationFromJSON = exports2.instanceOfPagination = void 0;
    var runtime_1 = require_runtime2();
    function instanceOfPagination(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfPagination = instanceOfPagination;
    function PaginationFromJSON(json) {
      return PaginationFromJSONTyped(json, false);
    }
    exports2.PaginationFromJSON = PaginationFromJSON;
    function PaginationFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "next": !(0, runtime_1.exists)(json, "next") ? void 0 : json["next"]
      };
    }
    exports2.PaginationFromJSONTyped = PaginationFromJSONTyped;
    function PaginationToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "next": value.next
      };
    }
    exports2.PaginationToJSON = PaginationToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ListImportsResponse.js
var require_ListImportsResponse = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ListImportsResponse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ListImportsResponseToJSON = exports2.ListImportsResponseFromJSONTyped = exports2.ListImportsResponseFromJSON = exports2.instanceOfListImportsResponse = void 0;
    var runtime_1 = require_runtime2();
    var ImportModel_1 = require_ImportModel();
    var Pagination_1 = require_Pagination();
    function instanceOfListImportsResponse(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfListImportsResponse = instanceOfListImportsResponse;
    function ListImportsResponseFromJSON(json) {
      return ListImportsResponseFromJSONTyped(json, false);
    }
    exports2.ListImportsResponseFromJSON = ListImportsResponseFromJSON;
    function ListImportsResponseFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "data": !(0, runtime_1.exists)(json, "data") ? void 0 : json["data"].map(ImportModel_1.ImportModelFromJSON),
        "pagination": !(0, runtime_1.exists)(json, "pagination") ? void 0 : (0, Pagination_1.PaginationFromJSON)(json["pagination"])
      };
    }
    exports2.ListImportsResponseFromJSONTyped = ListImportsResponseFromJSONTyped;
    function ListImportsResponseToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "data": value.data === void 0 ? void 0 : value.data.map(ImportModel_1.ImportModelToJSON),
        "pagination": (0, Pagination_1.PaginationToJSON)(value.pagination)
      };
    }
    exports2.ListImportsResponseToJSON = ListImportsResponseToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ListItem.js
var require_ListItem = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ListItem.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ListItemToJSON = exports2.ListItemFromJSONTyped = exports2.ListItemFromJSON = exports2.instanceOfListItem = void 0;
    var runtime_1 = require_runtime2();
    function instanceOfListItem(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfListItem = instanceOfListItem;
    function ListItemFromJSON(json) {
      return ListItemFromJSONTyped(json, false);
    }
    exports2.ListItemFromJSON = ListItemFromJSON;
    function ListItemFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "id": !(0, runtime_1.exists)(json, "id") ? void 0 : json["id"]
      };
    }
    exports2.ListItemFromJSONTyped = ListItemFromJSONTyped;
    function ListItemToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "id": value.id
      };
    }
    exports2.ListItemToJSON = ListItemToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ListResponse.js
var require_ListResponse = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ListResponse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ListResponseToJSON = exports2.ListResponseFromJSONTyped = exports2.ListResponseFromJSON = exports2.instanceOfListResponse = void 0;
    var runtime_1 = require_runtime2();
    var ListItem_1 = require_ListItem();
    var Pagination_1 = require_Pagination();
    var Usage_1 = require_Usage();
    function instanceOfListResponse(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfListResponse = instanceOfListResponse;
    function ListResponseFromJSON(json) {
      return ListResponseFromJSONTyped(json, false);
    }
    exports2.ListResponseFromJSON = ListResponseFromJSON;
    function ListResponseFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "vectors": !(0, runtime_1.exists)(json, "vectors") ? void 0 : json["vectors"].map(ListItem_1.ListItemFromJSON),
        "pagination": !(0, runtime_1.exists)(json, "pagination") ? void 0 : (0, Pagination_1.PaginationFromJSON)(json["pagination"]),
        "namespace": !(0, runtime_1.exists)(json, "namespace") ? void 0 : json["namespace"],
        "usage": !(0, runtime_1.exists)(json, "usage") ? void 0 : (0, Usage_1.UsageFromJSON)(json["usage"])
      };
    }
    exports2.ListResponseFromJSONTyped = ListResponseFromJSONTyped;
    function ListResponseToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "vectors": value.vectors === void 0 ? void 0 : value.vectors.map(ListItem_1.ListItemToJSON),
        "pagination": (0, Pagination_1.PaginationToJSON)(value.pagination),
        "namespace": value.namespace,
        "usage": (0, Usage_1.UsageToJSON)(value.usage)
      };
    }
    exports2.ListResponseToJSON = ListResponseToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ProtobufAny.js
var require_ProtobufAny = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ProtobufAny.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProtobufAnyToJSON = exports2.ProtobufAnyFromJSONTyped = exports2.ProtobufAnyFromJSON = exports2.instanceOfProtobufAny = void 0;
    var runtime_1 = require_runtime2();
    function instanceOfProtobufAny(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfProtobufAny = instanceOfProtobufAny;
    function ProtobufAnyFromJSON(json) {
      return ProtobufAnyFromJSONTyped(json, false);
    }
    exports2.ProtobufAnyFromJSON = ProtobufAnyFromJSON;
    function ProtobufAnyFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "typeUrl": !(0, runtime_1.exists)(json, "typeUrl") ? void 0 : json["typeUrl"],
        "value": !(0, runtime_1.exists)(json, "value") ? void 0 : json["value"]
      };
    }
    exports2.ProtobufAnyFromJSONTyped = ProtobufAnyFromJSONTyped;
    function ProtobufAnyToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "typeUrl": value.typeUrl,
        "value": value.value
      };
    }
    exports2.ProtobufAnyToJSON = ProtobufAnyToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ProtobufNullValue.js
var require_ProtobufNullValue = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ProtobufNullValue.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProtobufNullValueToJSON = exports2.ProtobufNullValueFromJSONTyped = exports2.ProtobufNullValueFromJSON = exports2.ProtobufNullValue = void 0;
    exports2.ProtobufNullValue = {
      NullValue: "NULL_VALUE"
    };
    function ProtobufNullValueFromJSON(json) {
      return ProtobufNullValueFromJSONTyped(json, false);
    }
    exports2.ProtobufNullValueFromJSON = ProtobufNullValueFromJSON;
    function ProtobufNullValueFromJSONTyped(json, ignoreDiscriminator) {
      return json;
    }
    exports2.ProtobufNullValueFromJSONTyped = ProtobufNullValueFromJSONTyped;
    function ProtobufNullValueToJSON(value) {
      return value;
    }
    exports2.ProtobufNullValueToJSON = ProtobufNullValueToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/QueryVector.js
var require_QueryVector = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/QueryVector.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.QueryVectorToJSON = exports2.QueryVectorFromJSONTyped = exports2.QueryVectorFromJSON = exports2.instanceOfQueryVector = void 0;
    var runtime_1 = require_runtime2();
    var SparseValues_1 = require_SparseValues();
    function instanceOfQueryVector(value) {
      var isInstance = true;
      isInstance = isInstance && "values" in value;
      return isInstance;
    }
    exports2.instanceOfQueryVector = instanceOfQueryVector;
    function QueryVectorFromJSON(json) {
      return QueryVectorFromJSONTyped(json, false);
    }
    exports2.QueryVectorFromJSON = QueryVectorFromJSON;
    function QueryVectorFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "values": json["values"],
        "sparseValues": !(0, runtime_1.exists)(json, "sparseValues") ? void 0 : (0, SparseValues_1.SparseValuesFromJSON)(json["sparseValues"]),
        "topK": !(0, runtime_1.exists)(json, "topK") ? void 0 : json["topK"],
        "namespace": !(0, runtime_1.exists)(json, "namespace") ? void 0 : json["namespace"],
        "filter": !(0, runtime_1.exists)(json, "filter") ? void 0 : json["filter"]
      };
    }
    exports2.QueryVectorFromJSONTyped = QueryVectorFromJSONTyped;
    function QueryVectorToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "values": value.values,
        "sparseValues": (0, SparseValues_1.SparseValuesToJSON)(value.sparseValues),
        "topK": value.topK,
        "namespace": value.namespace,
        "filter": value.filter
      };
    }
    exports2.QueryVectorToJSON = QueryVectorToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/QueryRequest.js
var require_QueryRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/QueryRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.QueryRequestToJSON = exports2.QueryRequestFromJSONTyped = exports2.QueryRequestFromJSON = exports2.instanceOfQueryRequest = void 0;
    var runtime_1 = require_runtime2();
    var QueryVector_1 = require_QueryVector();
    var SparseValues_1 = require_SparseValues();
    function instanceOfQueryRequest(value) {
      var isInstance = true;
      isInstance = isInstance && "topK" in value;
      return isInstance;
    }
    exports2.instanceOfQueryRequest = instanceOfQueryRequest;
    function QueryRequestFromJSON(json) {
      return QueryRequestFromJSONTyped(json, false);
    }
    exports2.QueryRequestFromJSON = QueryRequestFromJSON;
    function QueryRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "namespace": !(0, runtime_1.exists)(json, "namespace") ? void 0 : json["namespace"],
        "topK": json["topK"],
        "filter": !(0, runtime_1.exists)(json, "filter") ? void 0 : json["filter"],
        "includeValues": !(0, runtime_1.exists)(json, "includeValues") ? void 0 : json["includeValues"],
        "includeMetadata": !(0, runtime_1.exists)(json, "includeMetadata") ? void 0 : json["includeMetadata"],
        "queries": !(0, runtime_1.exists)(json, "queries") ? void 0 : json["queries"].map(QueryVector_1.QueryVectorFromJSON),
        "vector": !(0, runtime_1.exists)(json, "vector") ? void 0 : json["vector"],
        "sparseVector": !(0, runtime_1.exists)(json, "sparseVector") ? void 0 : (0, SparseValues_1.SparseValuesFromJSON)(json["sparseVector"]),
        "id": !(0, runtime_1.exists)(json, "id") ? void 0 : json["id"]
      };
    }
    exports2.QueryRequestFromJSONTyped = QueryRequestFromJSONTyped;
    function QueryRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "namespace": value.namespace,
        "topK": value.topK,
        "filter": value.filter,
        "includeValues": value.includeValues,
        "includeMetadata": value.includeMetadata,
        "queries": value.queries === void 0 ? void 0 : value.queries.map(QueryVector_1.QueryVectorToJSON),
        "vector": value.vector,
        "sparseVector": (0, SparseValues_1.SparseValuesToJSON)(value.sparseVector),
        "id": value.id
      };
    }
    exports2.QueryRequestToJSON = QueryRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ScoredVector.js
var require_ScoredVector = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/ScoredVector.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ScoredVectorToJSON = exports2.ScoredVectorFromJSONTyped = exports2.ScoredVectorFromJSON = exports2.instanceOfScoredVector = void 0;
    var runtime_1 = require_runtime2();
    var SparseValues_1 = require_SparseValues();
    function instanceOfScoredVector(value) {
      var isInstance = true;
      isInstance = isInstance && "id" in value;
      return isInstance;
    }
    exports2.instanceOfScoredVector = instanceOfScoredVector;
    function ScoredVectorFromJSON(json) {
      return ScoredVectorFromJSONTyped(json, false);
    }
    exports2.ScoredVectorFromJSON = ScoredVectorFromJSON;
    function ScoredVectorFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "id": json["id"],
        "score": !(0, runtime_1.exists)(json, "score") ? void 0 : json["score"],
        "values": !(0, runtime_1.exists)(json, "values") ? void 0 : json["values"],
        "sparseValues": !(0, runtime_1.exists)(json, "sparseValues") ? void 0 : (0, SparseValues_1.SparseValuesFromJSON)(json["sparseValues"]),
        "metadata": !(0, runtime_1.exists)(json, "metadata") ? void 0 : json["metadata"]
      };
    }
    exports2.ScoredVectorFromJSONTyped = ScoredVectorFromJSONTyped;
    function ScoredVectorToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "id": value.id,
        "score": value.score,
        "values": value.values,
        "sparseValues": (0, SparseValues_1.SparseValuesToJSON)(value.sparseValues),
        "metadata": value.metadata
      };
    }
    exports2.ScoredVectorToJSON = ScoredVectorToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/SingleQueryResults.js
var require_SingleQueryResults = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/SingleQueryResults.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SingleQueryResultsToJSON = exports2.SingleQueryResultsFromJSONTyped = exports2.SingleQueryResultsFromJSON = exports2.instanceOfSingleQueryResults = void 0;
    var runtime_1 = require_runtime2();
    var ScoredVector_1 = require_ScoredVector();
    function instanceOfSingleQueryResults(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfSingleQueryResults = instanceOfSingleQueryResults;
    function SingleQueryResultsFromJSON(json) {
      return SingleQueryResultsFromJSONTyped(json, false);
    }
    exports2.SingleQueryResultsFromJSON = SingleQueryResultsFromJSON;
    function SingleQueryResultsFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "matches": !(0, runtime_1.exists)(json, "matches") ? void 0 : json["matches"].map(ScoredVector_1.ScoredVectorFromJSON),
        "namespace": !(0, runtime_1.exists)(json, "namespace") ? void 0 : json["namespace"]
      };
    }
    exports2.SingleQueryResultsFromJSONTyped = SingleQueryResultsFromJSONTyped;
    function SingleQueryResultsToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "matches": value.matches === void 0 ? void 0 : value.matches.map(ScoredVector_1.ScoredVectorToJSON),
        "namespace": value.namespace
      };
    }
    exports2.SingleQueryResultsToJSON = SingleQueryResultsToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/QueryResponse.js
var require_QueryResponse = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/QueryResponse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.QueryResponseToJSON = exports2.QueryResponseFromJSONTyped = exports2.QueryResponseFromJSON = exports2.instanceOfQueryResponse = void 0;
    var runtime_1 = require_runtime2();
    var ScoredVector_1 = require_ScoredVector();
    var SingleQueryResults_1 = require_SingleQueryResults();
    var Usage_1 = require_Usage();
    function instanceOfQueryResponse(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfQueryResponse = instanceOfQueryResponse;
    function QueryResponseFromJSON(json) {
      return QueryResponseFromJSONTyped(json, false);
    }
    exports2.QueryResponseFromJSON = QueryResponseFromJSON;
    function QueryResponseFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "results": !(0, runtime_1.exists)(json, "results") ? void 0 : json["results"].map(SingleQueryResults_1.SingleQueryResultsFromJSON),
        "matches": !(0, runtime_1.exists)(json, "matches") ? void 0 : json["matches"].map(ScoredVector_1.ScoredVectorFromJSON),
        "namespace": !(0, runtime_1.exists)(json, "namespace") ? void 0 : json["namespace"],
        "usage": !(0, runtime_1.exists)(json, "usage") ? void 0 : (0, Usage_1.UsageFromJSON)(json["usage"])
      };
    }
    exports2.QueryResponseFromJSONTyped = QueryResponseFromJSONTyped;
    function QueryResponseToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "results": value.results === void 0 ? void 0 : value.results.map(SingleQueryResults_1.SingleQueryResultsToJSON),
        "matches": value.matches === void 0 ? void 0 : value.matches.map(ScoredVector_1.ScoredVectorToJSON),
        "namespace": value.namespace,
        "usage": (0, Usage_1.UsageToJSON)(value.usage)
      };
    }
    exports2.QueryResponseToJSON = QueryResponseToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/RpcStatus.js
var require_RpcStatus = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/RpcStatus.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RpcStatusToJSON = exports2.RpcStatusFromJSONTyped = exports2.RpcStatusFromJSON = exports2.instanceOfRpcStatus = void 0;
    var runtime_1 = require_runtime2();
    var ProtobufAny_1 = require_ProtobufAny();
    function instanceOfRpcStatus(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfRpcStatus = instanceOfRpcStatus;
    function RpcStatusFromJSON(json) {
      return RpcStatusFromJSONTyped(json, false);
    }
    exports2.RpcStatusFromJSON = RpcStatusFromJSON;
    function RpcStatusFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "code": !(0, runtime_1.exists)(json, "code") ? void 0 : json["code"],
        "message": !(0, runtime_1.exists)(json, "message") ? void 0 : json["message"],
        "details": !(0, runtime_1.exists)(json, "details") ? void 0 : json["details"].map(ProtobufAny_1.ProtobufAnyFromJSON)
      };
    }
    exports2.RpcStatusFromJSONTyped = RpcStatusFromJSONTyped;
    function RpcStatusToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "code": value.code,
        "message": value.message,
        "details": value.details === void 0 ? void 0 : value.details.map(ProtobufAny_1.ProtobufAnyToJSON)
      };
    }
    exports2.RpcStatusToJSON = RpcStatusToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/StartImportRequest.js
var require_StartImportRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/StartImportRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StartImportRequestToJSON = exports2.StartImportRequestFromJSONTyped = exports2.StartImportRequestFromJSON = exports2.instanceOfStartImportRequest = void 0;
    var runtime_1 = require_runtime2();
    var ImportErrorMode_1 = require_ImportErrorMode();
    function instanceOfStartImportRequest(value) {
      var isInstance = true;
      isInstance = isInstance && "uri" in value;
      return isInstance;
    }
    exports2.instanceOfStartImportRequest = instanceOfStartImportRequest;
    function StartImportRequestFromJSON(json) {
      return StartImportRequestFromJSONTyped(json, false);
    }
    exports2.StartImportRequestFromJSON = StartImportRequestFromJSON;
    function StartImportRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "integrationId": !(0, runtime_1.exists)(json, "integrationId") ? void 0 : json["integrationId"],
        "uri": json["uri"],
        "errorMode": !(0, runtime_1.exists)(json, "errorMode") ? void 0 : (0, ImportErrorMode_1.ImportErrorModeFromJSON)(json["errorMode"])
      };
    }
    exports2.StartImportRequestFromJSONTyped = StartImportRequestFromJSONTyped;
    function StartImportRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "integrationId": value.integrationId,
        "uri": value.uri,
        "errorMode": (0, ImportErrorMode_1.ImportErrorModeToJSON)(value.errorMode)
      };
    }
    exports2.StartImportRequestToJSON = StartImportRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/StartImportResponse.js
var require_StartImportResponse = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/StartImportResponse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StartImportResponseToJSON = exports2.StartImportResponseFromJSONTyped = exports2.StartImportResponseFromJSON = exports2.instanceOfStartImportResponse = void 0;
    var runtime_1 = require_runtime2();
    function instanceOfStartImportResponse(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfStartImportResponse = instanceOfStartImportResponse;
    function StartImportResponseFromJSON(json) {
      return StartImportResponseFromJSONTyped(json, false);
    }
    exports2.StartImportResponseFromJSON = StartImportResponseFromJSON;
    function StartImportResponseFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "id": !(0, runtime_1.exists)(json, "id") ? void 0 : json["id"]
      };
    }
    exports2.StartImportResponseFromJSONTyped = StartImportResponseFromJSONTyped;
    function StartImportResponseToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "id": value.id
      };
    }
    exports2.StartImportResponseToJSON = StartImportResponseToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/UpdateRequest.js
var require_UpdateRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/UpdateRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UpdateRequestToJSON = exports2.UpdateRequestFromJSONTyped = exports2.UpdateRequestFromJSON = exports2.instanceOfUpdateRequest = void 0;
    var runtime_1 = require_runtime2();
    var SparseValues_1 = require_SparseValues();
    function instanceOfUpdateRequest(value) {
      var isInstance = true;
      isInstance = isInstance && "id" in value;
      return isInstance;
    }
    exports2.instanceOfUpdateRequest = instanceOfUpdateRequest;
    function UpdateRequestFromJSON(json) {
      return UpdateRequestFromJSONTyped(json, false);
    }
    exports2.UpdateRequestFromJSON = UpdateRequestFromJSON;
    function UpdateRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "id": json["id"],
        "values": !(0, runtime_1.exists)(json, "values") ? void 0 : json["values"],
        "sparseValues": !(0, runtime_1.exists)(json, "sparseValues") ? void 0 : (0, SparseValues_1.SparseValuesFromJSON)(json["sparseValues"]),
        "setMetadata": !(0, runtime_1.exists)(json, "setMetadata") ? void 0 : json["setMetadata"],
        "namespace": !(0, runtime_1.exists)(json, "namespace") ? void 0 : json["namespace"]
      };
    }
    exports2.UpdateRequestFromJSONTyped = UpdateRequestFromJSONTyped;
    function UpdateRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "id": value.id,
        "values": value.values,
        "sparseValues": (0, SparseValues_1.SparseValuesToJSON)(value.sparseValues),
        "setMetadata": value.setMetadata,
        "namespace": value.namespace
      };
    }
    exports2.UpdateRequestToJSON = UpdateRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/UpsertRequest.js
var require_UpsertRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/UpsertRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UpsertRequestToJSON = exports2.UpsertRequestFromJSONTyped = exports2.UpsertRequestFromJSON = exports2.instanceOfUpsertRequest = void 0;
    var runtime_1 = require_runtime2();
    var Vector_1 = require_Vector();
    function instanceOfUpsertRequest(value) {
      var isInstance = true;
      isInstance = isInstance && "vectors" in value;
      return isInstance;
    }
    exports2.instanceOfUpsertRequest = instanceOfUpsertRequest;
    function UpsertRequestFromJSON(json) {
      return UpsertRequestFromJSONTyped(json, false);
    }
    exports2.UpsertRequestFromJSON = UpsertRequestFromJSON;
    function UpsertRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "vectors": json["vectors"].map(Vector_1.VectorFromJSON),
        "namespace": !(0, runtime_1.exists)(json, "namespace") ? void 0 : json["namespace"]
      };
    }
    exports2.UpsertRequestFromJSONTyped = UpsertRequestFromJSONTyped;
    function UpsertRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "vectors": value.vectors.map(Vector_1.VectorToJSON),
        "namespace": value.namespace
      };
    }
    exports2.UpsertRequestToJSON = UpsertRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/UpsertResponse.js
var require_UpsertResponse = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/UpsertResponse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UpsertResponseToJSON = exports2.UpsertResponseFromJSONTyped = exports2.UpsertResponseFromJSON = exports2.instanceOfUpsertResponse = void 0;
    var runtime_1 = require_runtime2();
    function instanceOfUpsertResponse(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfUpsertResponse = instanceOfUpsertResponse;
    function UpsertResponseFromJSON(json) {
      return UpsertResponseFromJSONTyped(json, false);
    }
    exports2.UpsertResponseFromJSON = UpsertResponseFromJSON;
    function UpsertResponseFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "upsertedCount": !(0, runtime_1.exists)(json, "upsertedCount") ? void 0 : json["upsertedCount"]
      };
    }
    exports2.UpsertResponseFromJSONTyped = UpsertResponseFromJSONTyped;
    function UpsertResponseToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "upsertedCount": value.upsertedCount
      };
    }
    exports2.UpsertResponseToJSON = UpsertResponseToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/index.js
var require_models2 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_DeleteRequest(), exports2);
    __exportStar(require_DescribeIndexStatsRequest(), exports2);
    __exportStar(require_FetchResponse(), exports2);
    __exportStar(require_ImportErrorMode(), exports2);
    __exportStar(require_ImportModel(), exports2);
    __exportStar(require_IndexDescription(), exports2);
    __exportStar(require_ListImportsResponse(), exports2);
    __exportStar(require_ListItem(), exports2);
    __exportStar(require_ListResponse(), exports2);
    __exportStar(require_NamespaceSummary(), exports2);
    __exportStar(require_Pagination(), exports2);
    __exportStar(require_ProtobufAny(), exports2);
    __exportStar(require_ProtobufNullValue(), exports2);
    __exportStar(require_QueryRequest(), exports2);
    __exportStar(require_QueryResponse(), exports2);
    __exportStar(require_QueryVector(), exports2);
    __exportStar(require_RpcStatus(), exports2);
    __exportStar(require_ScoredVector(), exports2);
    __exportStar(require_SingleQueryResults(), exports2);
    __exportStar(require_SparseValues(), exports2);
    __exportStar(require_StartImportRequest(), exports2);
    __exportStar(require_StartImportResponse(), exports2);
    __exportStar(require_UpdateRequest(), exports2);
    __exportStar(require_UpsertRequest(), exports2);
    __exportStar(require_UpsertResponse(), exports2);
    __exportStar(require_Usage(), exports2);
    __exportStar(require_Vector(), exports2);
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/apis/BulkOperationsApi.js
var require_BulkOperationsApi = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/apis/BulkOperationsApi.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.BulkOperationsApi = void 0;
    var runtime = __importStar(require_runtime2());
    var index_1 = require_models2();
    var BulkOperationsApi = (
      /** @class */
      function(_super) {
        __extends(BulkOperationsApi2, _super);
        function BulkOperationsApi2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        BulkOperationsApi2.prototype.cancelBulkImportRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.id === null || requestParameters.id === void 0) {
                    throw new runtime.RequiredError("id", "Required parameter requestParameters.id was null or undefined when calling cancelBulkImport.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/bulk/imports/{id}".replace("{".concat("id", "}"), encodeURIComponent(String(requestParameters.id))),
                    method: "DELETE",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response)];
              }
            });
          });
        };
        BulkOperationsApi2.prototype.cancelBulkImport = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.cancelBulkImportRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        BulkOperationsApi2.prototype.describeBulkImportRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.id === null || requestParameters.id === void 0) {
                    throw new runtime.RequiredError("id", "Required parameter requestParameters.id was null or undefined when calling describeBulkImport.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/bulk/imports/{id}".replace("{".concat("id", "}"), encodeURIComponent(String(requestParameters.id))),
                    method: "GET",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.ImportModelFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        BulkOperationsApi2.prototype.describeBulkImport = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.describeBulkImportRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        BulkOperationsApi2.prototype.listBulkImportsRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  queryParameters = {};
                  if (requestParameters.limit !== void 0) {
                    queryParameters["limit"] = requestParameters.limit;
                  }
                  if (requestParameters.paginationToken !== void 0) {
                    queryParameters["paginationToken"] = requestParameters.paginationToken;
                  }
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/bulk/imports",
                    method: "GET",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.ListImportsResponseFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        BulkOperationsApi2.prototype.listBulkImports = function(requestParameters, initOverrides) {
          if (requestParameters === void 0) {
            requestParameters = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.listBulkImportsRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        BulkOperationsApi2.prototype.startBulkImportRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.startImportRequest === null || requestParameters.startImportRequest === void 0) {
                    throw new runtime.RequiredError("startImportRequest", "Required parameter requestParameters.startImportRequest was null or undefined when calling startBulkImport.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/bulk/imports",
                    method: "POST",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.StartImportRequestToJSON)(requestParameters.startImportRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.StartImportResponseFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        BulkOperationsApi2.prototype.startBulkImport = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.startBulkImportRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        return BulkOperationsApi2;
      }(runtime.BaseAPI)
    );
    exports2.BulkOperationsApi = BulkOperationsApi;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/apis/VectorOperationsApi.js
var require_VectorOperationsApi = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/apis/VectorOperationsApi.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.VectorOperationsApi = void 0;
    var runtime = __importStar(require_runtime2());
    var index_1 = require_models2();
    var VectorOperationsApi = (
      /** @class */
      function(_super) {
        __extends(VectorOperationsApi2, _super);
        function VectorOperationsApi2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        VectorOperationsApi2.prototype.deleteVectorsRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.deleteRequest === null || requestParameters.deleteRequest === void 0) {
                    throw new runtime.RequiredError("deleteRequest", "Required parameter requestParameters.deleteRequest was null or undefined when calling deleteVectors.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/vectors/delete",
                    method: "POST",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.DeleteRequestToJSON)(requestParameters.deleteRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response)];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.deleteVectors = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.deleteVectorsRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.describeIndexStatsRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.describeIndexStatsRequest === null || requestParameters.describeIndexStatsRequest === void 0) {
                    throw new runtime.RequiredError("describeIndexStatsRequest", "Required parameter requestParameters.describeIndexStatsRequest was null or undefined when calling describeIndexStats.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/describe_index_stats",
                    method: "POST",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.DescribeIndexStatsRequestToJSON)(requestParameters.describeIndexStatsRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.IndexDescriptionFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.describeIndexStats = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.describeIndexStatsRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.fetchVectorsRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.ids === null || requestParameters.ids === void 0) {
                    throw new runtime.RequiredError("ids", "Required parameter requestParameters.ids was null or undefined when calling fetchVectors.");
                  }
                  queryParameters = {};
                  if (requestParameters.ids) {
                    queryParameters["ids"] = requestParameters.ids;
                  }
                  if (requestParameters.namespace !== void 0) {
                    queryParameters["namespace"] = requestParameters.namespace;
                  }
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/vectors/fetch",
                    method: "GET",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.FetchResponseFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.fetchVectors = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.fetchVectorsRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.listVectorsRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  queryParameters = {};
                  if (requestParameters.prefix !== void 0) {
                    queryParameters["prefix"] = requestParameters.prefix;
                  }
                  if (requestParameters.limit !== void 0) {
                    queryParameters["limit"] = requestParameters.limit;
                  }
                  if (requestParameters.paginationToken !== void 0) {
                    queryParameters["paginationToken"] = requestParameters.paginationToken;
                  }
                  if (requestParameters.namespace !== void 0) {
                    queryParameters["namespace"] = requestParameters.namespace;
                  }
                  headerParameters = {};
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/vectors/list",
                    method: "GET",
                    headers: headerParameters,
                    query: queryParameters
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.ListResponseFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.listVectors = function(requestParameters, initOverrides) {
          if (requestParameters === void 0) {
            requestParameters = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.listVectorsRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.queryVectorsRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.queryRequest === null || requestParameters.queryRequest === void 0) {
                    throw new runtime.RequiredError("queryRequest", "Required parameter requestParameters.queryRequest was null or undefined when calling queryVectors.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/query",
                    method: "POST",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.QueryRequestToJSON)(requestParameters.queryRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.QueryResponseFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.queryVectors = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.queryVectorsRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.updateVectorRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.updateRequest === null || requestParameters.updateRequest === void 0) {
                    throw new runtime.RequiredError("updateRequest", "Required parameter requestParameters.updateRequest was null or undefined when calling updateVector.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/vectors/update",
                    method: "POST",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.UpdateRequestToJSON)(requestParameters.updateRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response)];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.updateVector = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.updateVectorRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.upsertVectorsRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (requestParameters.upsertRequest === null || requestParameters.upsertRequest === void 0) {
                    throw new runtime.RequiredError("upsertRequest", "Required parameter requestParameters.upsertRequest was null or undefined when calling upsertVectors.");
                  }
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/vectors/upsert",
                    method: "POST",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.UpsertRequestToJSON)(requestParameters.upsertRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.UpsertResponseFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        VectorOperationsApi2.prototype.upsertVectors = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.upsertVectorsRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        return VectorOperationsApi2;
      }(runtime.BaseAPI)
    );
    exports2.VectorOperationsApi = VectorOperationsApi;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/apis/index.js
var require_apis2 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/apis/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_BulkOperationsApi(), exports2);
    __exportStar(require_VectorOperationsApi(), exports2);
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/api_version.js
var require_api_version2 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/api_version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.X_PINECONE_API_VERSION = void 0;
    exports2.X_PINECONE_API_VERSION = "2024-10";
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/index.js
var require_db_data = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_runtime2(), exports2);
    __exportStar(require_apis2(), exports2);
    __exportStar(require_models2(), exports2);
    __exportStar(require_api_version2(), exports2);
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/vectorOperationsProvider.js
var require_vectorOperationsProvider = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/vectorOperationsProvider.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.VectorOperationsProvider = void 0;
    var db_data_1 = require_db_data();
    var utils_1 = require_utils2();
    var indexHostSingleton_1 = require_indexHostSingleton();
    var middleware_1 = require_middleware();
    var VectorOperationsProvider = (
      /** @class */
      function() {
        function VectorOperationsProvider2(config2, indexName, indexHostUrl, additionalHeaders) {
          this.config = config2;
          this.indexName = indexName;
          this.indexHostUrl = (0, utils_1.normalizeUrl)(indexHostUrl);
          this.additionalHeaders = additionalHeaders;
        }
        VectorOperationsProvider2.prototype.provide = function() {
          return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  if (this.vectorOperations) {
                    return [2, this.vectorOperations];
                  }
                  if (!this.indexHostUrl) return [3, 1];
                  this.vectorOperations = this.buildDataOperationsConfig();
                  return [3, 3];
                case 1:
                  _a = this;
                  return [4, indexHostSingleton_1.IndexHostSingleton.getHostUrl(this.config, this.indexName)];
                case 2:
                  _a.indexHostUrl = _b.sent();
                  this.vectorOperations = this.buildDataOperationsConfig();
                  _b.label = 3;
                case 3:
                  return [2, this.vectorOperations];
              }
            });
          });
        };
        VectorOperationsProvider2.prototype.buildDataOperationsConfig = function() {
          var headers = this.additionalHeaders || null;
          var indexConfigurationParameters = {
            basePath: this.indexHostUrl,
            apiKey: this.config.apiKey,
            queryParamsStringify: utils_1.queryParamsStringify,
            headers: __assign({ "User-Agent": (0, utils_1.buildUserAgent)(this.config), "X-Pinecone-Api-Version": db_data_1.X_PINECONE_API_VERSION }, headers),
            fetchApi: (0, utils_1.getFetch)(this.config),
            middleware: middleware_1.middleware
          };
          var indexConfiguration = new db_data_1.Configuration(indexConfigurationParameters);
          return new db_data_1.VectorOperationsApi(indexConfiguration);
        };
        return VectorOperationsProvider2;
      }()
    );
    exports2.VectorOperationsProvider = VectorOperationsProvider;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/vectors/list.js
var require_list = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/vectors/list.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.listPaginated = void 0;
    var validateProperties_1 = require_validateProperties();
    var ListOptionsProperties = [
      "prefix",
      "limit",
      "paginationToken"
    ];
    var listPaginated = function(apiProvider, namespace) {
      var validator = function(options) {
        if (options) {
          (0, validateProperties_1.ValidateProperties)(options, ListOptionsProperties);
        }
        if (options.limit && options.limit < 0) {
          throw new Error("`limit` property must be greater than 0");
        }
      };
      return function(options) {
        return __awaiter(void 0, void 0, void 0, function() {
          var listRequest, api;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (options) {
                  validator(options);
                }
                listRequest = __assign(__assign({}, options), { namespace });
                return [4, apiProvider.provide()];
              case 1:
                api = _a.sent();
                return [4, api.listVectors(listRequest)];
              case 2:
                return [2, _a.sent()];
            }
          });
        });
      };
    };
    exports2.listPaginated = listPaginated;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/bulk/startImport.js
var require_startImport = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/bulk/startImport.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StartImportCommand = void 0;
    var db_data_1 = require_db_data();
    var errors_1 = require_errors();
    var StartImportCommand = (
      /** @class */
      function() {
        function StartImportCommand2(apiProvider, namespace) {
          this.apiProvider = apiProvider;
          this.namespace = namespace;
        }
        StartImportCommand2.prototype.run = function(uri, errorMode, integrationId) {
          return __awaiter(this, void 0, void 0, function() {
            var error, req, api;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!uri) {
                    throw new errors_1.PineconeArgumentError("`uri` field is required and must start with the scheme of a supported storage provider.");
                  }
                  error = db_data_1.ImportErrorModeOnErrorEnum.Continue;
                  if (errorMode) {
                    if (errorMode.toLowerCase() !== "continue" && errorMode.toLowerCase() !== "abort") {
                      throw new errors_1.PineconeArgumentError('`errorMode` must be one of "Continue" or "Abort"');
                    }
                    if ((errorMode === null || errorMode === void 0 ? void 0 : errorMode.toLowerCase()) == "abort") {
                      error = db_data_1.ImportErrorModeOnErrorEnum.Abort;
                    }
                  }
                  req = {
                    startImportRequest: {
                      uri,
                      errorMode: { onError: error },
                      integrationId
                    }
                  };
                  return [4, this.apiProvider.provide()];
                case 1:
                  api = _a.sent();
                  return [4, api.startBulkImport(req)];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        return StartImportCommand2;
      }()
    );
    exports2.StartImportCommand = StartImportCommand;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/bulk/listImports.js
var require_listImports = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/bulk/listImports.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ListImportsCommand = void 0;
    var ListImportsCommand = (
      /** @class */
      function() {
        function ListImportsCommand2(apiProvider, namespace) {
          this.apiProvider = apiProvider;
          this.namespace = namespace;
        }
        ListImportsCommand2.prototype.run = function(limit, paginationToken) {
          return __awaiter(this, void 0, void 0, function() {
            var req, api;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  req = {
                    limit,
                    paginationToken
                  };
                  return [4, this.apiProvider.provide()];
                case 1:
                  api = _a.sent();
                  return [4, api.listBulkImports(req)];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        return ListImportsCommand2;
      }()
    );
    exports2.ListImportsCommand = ListImportsCommand;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/bulk/describeImport.js
var require_describeImport = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/bulk/describeImport.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DescribeImportCommand = void 0;
    var DescribeImportCommand = (
      /** @class */
      function() {
        function DescribeImportCommand2(apiProvider, namespace) {
          this.apiProvider = apiProvider;
          this.namespace = namespace;
        }
        DescribeImportCommand2.prototype.run = function(id) {
          return __awaiter(this, void 0, void 0, function() {
            var req, api;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  req = {
                    id
                  };
                  return [4, this.apiProvider.provide()];
                case 1:
                  api = _a.sent();
                  return [4, api.describeBulkImport(req)];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        return DescribeImportCommand2;
      }()
    );
    exports2.DescribeImportCommand = DescribeImportCommand;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/bulk/cancelImport.js
var require_cancelImport = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/bulk/cancelImport.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CancelImportCommand = void 0;
    var CancelImportCommand = (
      /** @class */
      function() {
        function CancelImportCommand2(apiProvider, namespace) {
          this.apiProvider = apiProvider;
          this.namespace = namespace;
        }
        CancelImportCommand2.prototype.run = function(id) {
          return __awaiter(this, void 0, void 0, function() {
            var req, api;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  req = {
                    id
                  };
                  return [4, this.apiProvider.provide()];
                case 1:
                  api = _a.sent();
                  return [4, api.cancelBulkImport(req)];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        return CancelImportCommand2;
      }()
    );
    exports2.CancelImportCommand = CancelImportCommand;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/bulk/bulkOperationsProvider.js
var require_bulkOperationsProvider = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/bulk/bulkOperationsProvider.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.BulkOperationsProvider = void 0;
    var db_data_1 = require_db_data();
    var utils_1 = require_utils2();
    var indexHostSingleton_1 = require_indexHostSingleton();
    var middleware_1 = require_middleware();
    var BulkOperationsProvider = (
      /** @class */
      function() {
        function BulkOperationsProvider2(config2, indexName, indexHostUrl, additionalHeaders) {
          this.config = config2;
          this.indexName = indexName;
          this.indexHostUrl = (0, utils_1.normalizeUrl)(indexHostUrl);
          this.additionalHeaders = additionalHeaders;
        }
        BulkOperationsProvider2.prototype.provide = function() {
          return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  if (this.bulkOperations) {
                    return [2, this.bulkOperations];
                  }
                  if (!this.indexHostUrl) return [3, 1];
                  this.bulkOperations = this.buildBulkOperationsConfig();
                  return [3, 3];
                case 1:
                  _a = this;
                  return [4, indexHostSingleton_1.IndexHostSingleton.getHostUrl(this.config, this.indexName)];
                case 2:
                  _a.indexHostUrl = _b.sent();
                  this.bulkOperations = this.buildBulkOperationsConfig();
                  _b.label = 3;
                case 3:
                  return [2, this.bulkOperations];
              }
            });
          });
        };
        BulkOperationsProvider2.prototype.buildBulkOperationsConfig = function() {
          var headers = this.additionalHeaders || null;
          var indexConfigurationParameters = {
            basePath: this.indexHostUrl,
            apiKey: this.config.apiKey,
            queryParamsStringify: utils_1.queryParamsStringify,
            headers: __assign({ "User-Agent": (0, utils_1.buildUserAgent)(this.config), "X-Pinecone-Api-Version": db_data_1.X_PINECONE_API_VERSION }, headers),
            fetchApi: (0, utils_1.getFetch)(this.config),
            middleware: middleware_1.middleware
          };
          var indexConfiguration = new db_data_1.Configuration(indexConfigurationParameters);
          return new db_data_1.BulkOperationsApi(indexConfiguration);
        };
        return BulkOperationsProvider2;
      }()
    );
    exports2.BulkOperationsProvider = BulkOperationsProvider;
  }
});

// node_modules/@pinecone-database/pinecone/dist/data/index.js
var require_data = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/data/index.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Index = void 0;
    var upsert_1 = require_upsert();
    var fetch_1 = require_fetch2();
    var update_1 = require_update();
    var query_1 = require_query();
    var deleteOne_1 = require_deleteOne();
    var deleteMany_1 = require_deleteMany();
    var deleteAll_1 = require_deleteAll();
    var describeIndexStats_1 = require_describeIndexStats();
    var vectorOperationsProvider_1 = require_vectorOperationsProvider();
    var list_1 = require_list();
    var startImport_1 = require_startImport();
    var listImports_1 = require_listImports();
    var describeImport_1 = require_describeImport();
    var cancelImport_1 = require_cancelImport();
    var bulkOperationsProvider_1 = require_bulkOperationsProvider();
    var Index = (
      /** @class */
      function() {
        function Index2(indexName, config2, namespace, indexHostUrl, additionalHeaders) {
          if (namespace === void 0) {
            namespace = "";
          }
          this.config = config2;
          this.target = {
            index: indexName,
            namespace,
            indexHostUrl
          };
          var dataOperationsProvider = new vectorOperationsProvider_1.VectorOperationsProvider(config2, indexName, indexHostUrl, additionalHeaders);
          this._deleteAll = (0, deleteAll_1.deleteAll)(dataOperationsProvider, namespace);
          this._deleteMany = (0, deleteMany_1.deleteMany)(dataOperationsProvider, namespace);
          this._deleteOne = (0, deleteOne_1.deleteOne)(dataOperationsProvider, namespace);
          this._describeIndexStats = (0, describeIndexStats_1.describeIndexStats)(dataOperationsProvider);
          this._listPaginated = (0, list_1.listPaginated)(dataOperationsProvider, namespace);
          this._fetchCommand = new fetch_1.FetchCommand(dataOperationsProvider, namespace);
          this._queryCommand = new query_1.QueryCommand(dataOperationsProvider, namespace);
          this._updateCommand = new update_1.UpdateCommand(dataOperationsProvider, namespace);
          this._upsertCommand = new upsert_1.UpsertCommand(dataOperationsProvider, namespace);
          var bulkApiProvider = new bulkOperationsProvider_1.BulkOperationsProvider(config2, indexName, indexHostUrl, additionalHeaders);
          this._startImportCommand = new startImport_1.StartImportCommand(bulkApiProvider, namespace);
          this._listImportsCommand = new listImports_1.ListImportsCommand(bulkApiProvider, namespace);
          this._describeImportCommand = new describeImport_1.DescribeImportCommand(bulkApiProvider, namespace);
          this._cancelImportCommand = new cancelImport_1.CancelImportCommand(bulkApiProvider, namespace);
        }
        Index2.prototype.deleteAll = function() {
          return this._deleteAll();
        };
        Index2.prototype.deleteMany = function(options) {
          return this._deleteMany(options);
        };
        Index2.prototype.deleteOne = function(id) {
          return this._deleteOne(id);
        };
        Index2.prototype.describeIndexStats = function() {
          return this._describeIndexStats();
        };
        Index2.prototype.listPaginated = function(options) {
          return this._listPaginated(options);
        };
        Index2.prototype.namespace = function(namespace) {
          return new Index2(this.target.index, this.config, namespace, this.target.indexHostUrl);
        };
        Index2.prototype.upsert = function(data) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._upsertCommand.run(data)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Index2.prototype.fetch = function(options) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._fetchCommand.run(options)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Index2.prototype.query = function(options) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._queryCommand.run(options)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Index2.prototype.update = function(options) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._updateCommand.run(options)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Index2.prototype.startImport = function(uri, errorMode, integration) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._startImportCommand.run(uri, errorMode, integration)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Index2.prototype.listImports = function(limit, paginationToken) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._listImportsCommand.run(limit, paginationToken)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Index2.prototype.describeImport = function(id) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._describeImportCommand.run(id)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        Index2.prototype.cancelImport = function(id) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._cancelImportCommand.run(id)];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        return Index2;
      }()
    );
    exports2.Index = Index;
  }
});

// node_modules/@pinecone-database/pinecone/dist/models/embeddingsList.js
var require_embeddingsList = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/models/embeddingsList.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __spreadArray = exports2 && exports2.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EmbeddingsList = void 0;
    var EmbeddingsList = (
      /** @class */
      function(_super) {
        __extends(EmbeddingsList2, _super);
        function EmbeddingsList2(model, data, usage) {
          if (data === void 0) {
            data = [];
          }
          var _this = _super.apply(this, data) || this;
          Object.setPrototypeOf(_this, EmbeddingsList2.prototype);
          _this.model = model;
          _this.data = data;
          _this.usage = usage;
          return _this;
        }
        EmbeddingsList2.prototype.toString = function() {
          var truncatedData = this.truncateDataForDisplay();
          var dataObject = truncatedData.map(function(embedding) {
            var _a;
            if (typeof embedding === "string") {
              return "    ".concat(embedding);
            }
            var embeddingObject = JSON.stringify(embedding, function(key, value) {
              return key === "values" && Array.isArray(value) ? value : value;
            });
            embeddingObject = embeddingObject.replace(/:/g, ": ");
            var valuesArray = ((_a = embeddingObject.match(/"values": \[(.*?)\]/)) === null || _a === void 0 ? void 0 : _a[1]) || "";
            var formattedEmbedding = valuesArray.split(",").join(", ").replace(/"/g, "");
            embeddingObject = embeddingObject.replace(/("values": )\[(.*?)\]/, "$1[".concat(formattedEmbedding, "]"));
            return "    ".concat(embeddingObject);
          }).join(",\n");
          var usageObject = JSON.stringify(this.usage).replace(/:/g, ": ");
          return "EmbeddingsList({\n" + '  "model": "'.concat(this.model, '",\n') + '  "data": [\n' + "".concat(dataObject, "\n") + "   ],\n" + '  "usage": '.concat(usageObject, "\n") + "  })";
        };
        EmbeddingsList2.prototype.toJSON = function() {
          return {
            model: this.model,
            data: this.truncateDataForDisplay(),
            usage: this.usage
          };
        };
        EmbeddingsList2.prototype.get = function(index) {
          return this[index];
        };
        EmbeddingsList2.prototype.indexOf = function(element) {
          return this.data ? this.data.indexOf(element) : -1;
        };
        EmbeddingsList2.prototype.truncateValuesForDisplay = function(values) {
          if (!values || values.length <= 4) {
            return values ? values : [];
          }
          return __spreadArray(__spreadArray(__spreadArray([], values.slice(0, 2), true), ["..."], false), values.slice(-2), true);
        };
        EmbeddingsList2.prototype.truncateDataForDisplay = function() {
          var _this = this;
          if (!this.data)
            return [];
          if (this.data.length <= 5) {
            return this.data.map(function(embedding) {
              return {
                values: embedding.values ? _this.truncateValuesForDisplay(embedding.values) : []
              };
            });
          }
          return __spreadArray(__spreadArray(__spreadArray([], this.data.slice(0, 2).map(function(embedding) {
            return {
              values: embedding.values ? _this.truncateValuesForDisplay(embedding.values) : []
            };
          }), true), [
            "   ... (".concat(this.data.length - 4, " more embeddings) ...")
          ], false), this.data.slice(-2).map(function(embedding) {
            return {
              values: embedding.values ? _this.truncateValuesForDisplay(embedding.values) : []
            };
          }), true);
        };
        return EmbeddingsList2;
      }(Array)
    );
    exports2.EmbeddingsList = EmbeddingsList;
  }
});

// node_modules/@pinecone-database/pinecone/dist/models/index.js
var require_models3 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/models/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EmbeddingsList = void 0;
    var embeddingsList_1 = require_embeddingsList();
    Object.defineProperty(exports2, "EmbeddingsList", { enumerable: true, get: function() {
      return embeddingsList_1.EmbeddingsList;
    } });
  }
});

// node_modules/@pinecone-database/pinecone/dist/inference/inference.js
var require_inference = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/inference/inference.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Inference = void 0;
    var models_1 = require_models3();
    var errors_1 = require_errors();
    var Inference = (
      /** @class */
      function() {
        function Inference2(inferenceApi) {
          this._inferenceApi = inferenceApi;
        }
        Inference2.prototype._formatInputs = function(data) {
          return data.map(function(str) {
            return { text: str };
          });
        };
        Inference2.prototype.embed = function(model, inputs, params) {
          return __awaiter(this, void 0, void 0, function() {
            var typedAndFormattedInputs, typedRequest, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  typedAndFormattedInputs = this._formatInputs(inputs);
                  typedRequest = {
                    embedRequest: {
                      model,
                      inputs: typedAndFormattedInputs,
                      parameters: params
                    }
                  };
                  return [4, this._inferenceApi.embed(typedRequest)];
                case 1:
                  response = _a.sent();
                  return [2, new models_1.EmbeddingsList(response.model, response.data, response.usage)];
              }
            });
          });
        };
        Inference2.prototype.rerank = function(model, query, documents, options) {
          if (options === void 0) {
            options = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            var _a, topN, _b, returnDocuments, _c, parameters, _d, rankFields, newDocuments, req;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  if (documents.length == 0) {
                    throw new errors_1.PineconeArgumentError("You must pass at least one document to rerank");
                  }
                  if (query.length == 0) {
                    throw new errors_1.PineconeArgumentError("You must pass a query to rerank");
                  }
                  if (model.length == 0) {
                    throw new errors_1.PineconeArgumentError("You must pass the name of a supported reranking model in order to rerank documents. See https://docs.pinecone.io/models for supported models.");
                  }
                  _a = options.topN, topN = _a === void 0 ? documents.length : _a, _b = options.returnDocuments, returnDocuments = _b === void 0 ? true : _b, _c = options.parameters, parameters = _c === void 0 ? {} : _c;
                  _d = options.rankFields, rankFields = _d === void 0 ? ["text"] : _d;
                  newDocuments = documents.map(function(doc) {
                    return typeof doc === "string" ? { text: doc } : doc;
                  });
                  if (!options.rankFields) {
                    if (!newDocuments.every(function(doc) {
                      return typeof doc === "object" && doc.text;
                    })) {
                      throw new errors_1.PineconeArgumentError('Documents must be a list of strings or objects containing the "text" field');
                    }
                  }
                  if (options.rankFields) {
                    rankFields = options.rankFields;
                  }
                  req = {
                    rerankRequest: {
                      model,
                      query,
                      documents: newDocuments,
                      topN,
                      returnDocuments,
                      rankFields,
                      parameters
                    }
                  };
                  return [4, this._inferenceApi.rerank(req)];
                case 1:
                  return [2, _e.sent()];
              }
            });
          });
        };
        return Inference2;
      }()
    );
    exports2.Inference = Inference;
  }
});

// node_modules/@pinecone-database/pinecone/dist/inference/index.js
var require_inference2 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/inference/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_inference(), exports2);
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/runtime.js
var require_runtime3 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/runtime.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TextApiResponse = exports2.BlobApiResponse = exports2.VoidApiResponse = exports2.JSONApiResponse = exports2.canConsumeForm = exports2.mapValues = exports2.querystring = exports2.exists = exports2.COLLECTION_FORMATS = exports2.RequiredError = exports2.FetchError = exports2.ResponseError = exports2.BaseAPI = exports2.DefaultConfig = exports2.Configuration = exports2.BASE_PATH = void 0;
    exports2.BASE_PATH = "https://api.pinecone.io".replace(/\/+$/, "");
    var Configuration = (
      /** @class */
      function() {
        function Configuration2(configuration) {
          if (configuration === void 0) {
            configuration = {};
          }
          this.configuration = configuration;
        }
        Object.defineProperty(Configuration2.prototype, "config", {
          set: function(configuration) {
            this.configuration = configuration;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "basePath", {
          get: function() {
            return this.configuration.basePath != null ? this.configuration.basePath : exports2.BASE_PATH;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "fetchApi", {
          get: function() {
            return this.configuration.fetchApi;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "middleware", {
          get: function() {
            return this.configuration.middleware || [];
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "queryParamsStringify", {
          get: function() {
            return this.configuration.queryParamsStringify || querystring;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "username", {
          get: function() {
            return this.configuration.username;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "password", {
          get: function() {
            return this.configuration.password;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "apiKey", {
          get: function() {
            var apiKey = this.configuration.apiKey;
            if (apiKey) {
              return typeof apiKey === "function" ? apiKey : function() {
                return apiKey;
              };
            }
            return void 0;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "accessToken", {
          get: function() {
            var _this = this;
            var accessToken = this.configuration.accessToken;
            if (accessToken) {
              return typeof accessToken === "function" ? accessToken : function() {
                return __awaiter(_this, void 0, void 0, function() {
                  return __generator(this, function(_a) {
                    return [2, accessToken];
                  });
                });
              };
            }
            return void 0;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "headers", {
          get: function() {
            return this.configuration.headers;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Configuration2.prototype, "credentials", {
          get: function() {
            return this.configuration.credentials;
          },
          enumerable: false,
          configurable: true
        });
        return Configuration2;
      }()
    );
    exports2.Configuration = Configuration;
    exports2.DefaultConfig = new Configuration();
    var BaseAPI = (
      /** @class */
      function() {
        function BaseAPI2(configuration) {
          if (configuration === void 0) {
            configuration = exports2.DefaultConfig;
          }
          var _this = this;
          this.configuration = configuration;
          this.fetchApi = function(url, init) {
            return __awaiter(_this, void 0, void 0, function() {
              var fetchParams, _i, _a, middleware, response, e_1, _b, _c, middleware, _d, _e, middleware;
              return __generator(this, function(_f) {
                switch (_f.label) {
                  case 0:
                    fetchParams = { url, init };
                    _i = 0, _a = this.middleware;
                    _f.label = 1;
                  case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    middleware = _a[_i];
                    if (!middleware.pre) return [3, 3];
                    return [4, middleware.pre(__assign({ fetch: this.fetchApi }, fetchParams))];
                  case 2:
                    fetchParams = _f.sent() || fetchParams;
                    _f.label = 3;
                  case 3:
                    _i++;
                    return [3, 1];
                  case 4:
                    response = void 0;
                    _f.label = 5;
                  case 5:
                    _f.trys.push([5, 7, , 12]);
                    return [4, (this.configuration.fetchApi || fetch)(fetchParams.url, fetchParams.init)];
                  case 6:
                    response = _f.sent();
                    return [3, 12];
                  case 7:
                    e_1 = _f.sent();
                    _b = 0, _c = this.middleware;
                    _f.label = 8;
                  case 8:
                    if (!(_b < _c.length)) return [3, 11];
                    middleware = _c[_b];
                    if (!middleware.onError) return [3, 10];
                    return [4, middleware.onError({
                      fetch: this.fetchApi,
                      url: fetchParams.url,
                      init: fetchParams.init,
                      error: e_1,
                      response: response ? response.clone() : void 0
                    })];
                  case 9:
                    response = _f.sent() || response;
                    _f.label = 10;
                  case 10:
                    _b++;
                    return [3, 8];
                  case 11:
                    if (response === void 0) {
                      if (e_1 instanceof Error) {
                        throw new FetchError(e_1, "The request failed and the interceptors did not return an alternative response");
                      } else {
                        throw e_1;
                      }
                    }
                    return [3, 12];
                  case 12:
                    _d = 0, _e = this.middleware;
                    _f.label = 13;
                  case 13:
                    if (!(_d < _e.length)) return [3, 16];
                    middleware = _e[_d];
                    if (!middleware.post) return [3, 15];
                    return [4, middleware.post({
                      fetch: this.fetchApi,
                      url: fetchParams.url,
                      init: fetchParams.init,
                      response: response.clone()
                    })];
                  case 14:
                    response = _f.sent() || response;
                    _f.label = 15;
                  case 15:
                    _d++;
                    return [3, 13];
                  case 16:
                    return [2, response];
                }
              });
            });
          };
          this.middleware = configuration.middleware;
        }
        BaseAPI2.prototype.withMiddleware = function() {
          var _a;
          var middlewares = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            middlewares[_i] = arguments[_i];
          }
          var next = this.clone();
          next.middleware = (_a = next.middleware).concat.apply(_a, middlewares);
          return next;
        };
        BaseAPI2.prototype.withPreMiddleware = function() {
          var preMiddlewares = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            preMiddlewares[_i] = arguments[_i];
          }
          var middlewares = preMiddlewares.map(function(pre) {
            return { pre };
          });
          return this.withMiddleware.apply(this, middlewares);
        };
        BaseAPI2.prototype.withPostMiddleware = function() {
          var postMiddlewares = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            postMiddlewares[_i] = arguments[_i];
          }
          var middlewares = postMiddlewares.map(function(post) {
            return { post };
          });
          return this.withMiddleware.apply(this, middlewares);
        };
        BaseAPI2.prototype.isJsonMime = function(mime) {
          if (!mime) {
            return false;
          }
          return BaseAPI2.jsonRegex.test(mime);
        };
        BaseAPI2.prototype.request = function(context, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var _a, url, init, response;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, this.createFetchParams(context, initOverrides)];
                case 1:
                  _a = _b.sent(), url = _a.url, init = _a.init;
                  return [4, this.fetchApi(url, init)];
                case 2:
                  response = _b.sent();
                  if (response && (response.status >= 200 && response.status < 300)) {
                    return [2, response];
                  }
                  throw new ResponseError(response, "Response returned an error code");
              }
            });
          });
        };
        BaseAPI2.prototype.createFetchParams = function(context, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var url, headers, initOverrideFn, initParams, overriddenInit, _a, body, init;
            var _this = this;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  url = this.configuration.basePath + context.path;
                  if (context.query !== void 0 && Object.keys(context.query).length !== 0) {
                    url += "?" + this.configuration.queryParamsStringify(context.query);
                  }
                  headers = Object.assign({}, this.configuration.headers, context.headers);
                  Object.keys(headers).forEach(function(key) {
                    return headers[key] === void 0 ? delete headers[key] : {};
                  });
                  initOverrideFn = typeof initOverrides === "function" ? initOverrides : function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      return __generator(this, function(_a2) {
                        return [2, initOverrides];
                      });
                    });
                  };
                  initParams = {
                    method: context.method,
                    headers,
                    body: context.body,
                    credentials: this.configuration.credentials
                  };
                  _a = [__assign({}, initParams)];
                  return [4, initOverrideFn({
                    init: initParams,
                    context
                  })];
                case 1:
                  overriddenInit = __assign.apply(void 0, _a.concat([_b.sent()]));
                  if (isFormData(overriddenInit.body) || overriddenInit.body instanceof URLSearchParams || isBlob(overriddenInit.body)) {
                    body = overriddenInit.body;
                  } else if (this.isJsonMime(headers["Content-Type"])) {
                    body = JSON.stringify(overriddenInit.body);
                  } else {
                    body = overriddenInit.body;
                  }
                  init = __assign(__assign({}, overriddenInit), { body });
                  return [2, { url, init }];
              }
            });
          });
        };
        BaseAPI2.prototype.clone = function() {
          var constructor = this.constructor;
          var next = new constructor(this.configuration);
          next.middleware = this.middleware.slice();
          return next;
        };
        BaseAPI2.jsonRegex = new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$", "i");
        return BaseAPI2;
      }()
    );
    exports2.BaseAPI = BaseAPI;
    function isBlob(value) {
      return typeof Blob !== "undefined" && value instanceof Blob;
    }
    function isFormData(value) {
      return typeof FormData !== "undefined" && value instanceof FormData;
    }
    var ResponseError = (
      /** @class */
      function(_super) {
        __extends(ResponseError2, _super);
        function ResponseError2(response, msg) {
          var _this = _super.call(this, msg) || this;
          _this.response = response;
          _this.name = "ResponseError";
          return _this;
        }
        return ResponseError2;
      }(Error)
    );
    exports2.ResponseError = ResponseError;
    var FetchError = (
      /** @class */
      function(_super) {
        __extends(FetchError2, _super);
        function FetchError2(cause, msg) {
          var _this = _super.call(this, msg) || this;
          _this.cause = cause;
          _this.name = "FetchError";
          return _this;
        }
        return FetchError2;
      }(Error)
    );
    exports2.FetchError = FetchError;
    var RequiredError = (
      /** @class */
      function(_super) {
        __extends(RequiredError2, _super);
        function RequiredError2(field, msg) {
          var _this = _super.call(this, msg) || this;
          _this.field = field;
          _this.name = "RequiredError";
          return _this;
        }
        return RequiredError2;
      }(Error)
    );
    exports2.RequiredError = RequiredError;
    exports2.COLLECTION_FORMATS = {
      csv: ",",
      ssv: " ",
      tsv: "	",
      pipes: "|"
    };
    function exists(json, key) {
      var value = json[key];
      return value !== null && value !== void 0;
    }
    exports2.exists = exists;
    function querystring(params, prefix) {
      if (prefix === void 0) {
        prefix = "";
      }
      return Object.keys(params).map(function(key) {
        return querystringSingleKey(key, params[key], prefix);
      }).filter(function(part) {
        return part.length > 0;
      }).join("&");
    }
    exports2.querystring = querystring;
    function querystringSingleKey(key, value, keyPrefix) {
      if (keyPrefix === void 0) {
        keyPrefix = "";
      }
      var fullKey = keyPrefix + (keyPrefix.length ? "[".concat(key, "]") : key);
      if (value instanceof Array) {
        var multiValue = value.map(function(singleValue) {
          return encodeURIComponent(String(singleValue));
        }).join("&".concat(encodeURIComponent(fullKey), "="));
        return "".concat(encodeURIComponent(fullKey), "=").concat(multiValue);
      }
      if (value instanceof Set) {
        var valueAsArray = Array.from(value);
        return querystringSingleKey(key, valueAsArray, keyPrefix);
      }
      if (value instanceof Date) {
        return "".concat(encodeURIComponent(fullKey), "=").concat(encodeURIComponent(value.toISOString()));
      }
      if (value instanceof Object) {
        return querystring(value, fullKey);
      }
      return "".concat(encodeURIComponent(fullKey), "=").concat(encodeURIComponent(String(value)));
    }
    function mapValues(data, fn) {
      return Object.keys(data).reduce(function(acc, key) {
        var _a;
        return __assign(__assign({}, acc), (_a = {}, _a[key] = fn(data[key]), _a));
      }, {});
    }
    exports2.mapValues = mapValues;
    function canConsumeForm(consumes) {
      for (var _i = 0, consumes_1 = consumes; _i < consumes_1.length; _i++) {
        var consume = consumes_1[_i];
        if ("multipart/form-data" === consume.contentType) {
          return true;
        }
      }
      return false;
    }
    exports2.canConsumeForm = canConsumeForm;
    var JSONApiResponse = (
      /** @class */
      function() {
        function JSONApiResponse2(raw, transformer) {
          if (transformer === void 0) {
            transformer = function(jsonValue) {
              return jsonValue;
            };
          }
          this.raw = raw;
          this.transformer = transformer;
        }
        JSONApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _a = this.transformer;
                  return [4, this.raw.json()];
                case 1:
                  return [2, _a.apply(this, [_b.sent()])];
              }
            });
          });
        };
        return JSONApiResponse2;
      }()
    );
    exports2.JSONApiResponse = JSONApiResponse;
    var VoidApiResponse = (
      /** @class */
      function() {
        function VoidApiResponse2(raw) {
          this.raw = raw;
        }
        VoidApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, void 0];
            });
          });
        };
        return VoidApiResponse2;
      }()
    );
    exports2.VoidApiResponse = VoidApiResponse;
    var BlobApiResponse = (
      /** @class */
      function() {
        function BlobApiResponse2(raw) {
          this.raw = raw;
        }
        BlobApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.raw.blob()];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ;
        return BlobApiResponse2;
      }()
    );
    exports2.BlobApiResponse = BlobApiResponse;
    var TextApiResponse = (
      /** @class */
      function() {
        function TextApiResponse2(raw) {
          this.raw = raw;
        }
        TextApiResponse2.prototype.value = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.raw.text()];
                case 1:
                  return [2, _a.sent()];
              }
            });
          });
        };
        ;
        return TextApiResponse2;
      }()
    );
    exports2.TextApiResponse = TextApiResponse;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/EmbedRequestInputsInner.js
var require_EmbedRequestInputsInner = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/EmbedRequestInputsInner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EmbedRequestInputsInnerToJSON = exports2.EmbedRequestInputsInnerFromJSONTyped = exports2.EmbedRequestInputsInnerFromJSON = exports2.instanceOfEmbedRequestInputsInner = void 0;
    var runtime_1 = require_runtime3();
    function instanceOfEmbedRequestInputsInner(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfEmbedRequestInputsInner = instanceOfEmbedRequestInputsInner;
    function EmbedRequestInputsInnerFromJSON(json) {
      return EmbedRequestInputsInnerFromJSONTyped(json, false);
    }
    exports2.EmbedRequestInputsInnerFromJSON = EmbedRequestInputsInnerFromJSON;
    function EmbedRequestInputsInnerFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "text": !(0, runtime_1.exists)(json, "text") ? void 0 : json["text"]
      };
    }
    exports2.EmbedRequestInputsInnerFromJSONTyped = EmbedRequestInputsInnerFromJSONTyped;
    function EmbedRequestInputsInnerToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "text": value.text
      };
    }
    exports2.EmbedRequestInputsInnerToJSON = EmbedRequestInputsInnerToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/EmbedRequestParameters.js
var require_EmbedRequestParameters = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/EmbedRequestParameters.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EmbedRequestParametersToJSON = exports2.EmbedRequestParametersFromJSONTyped = exports2.EmbedRequestParametersFromJSON = exports2.instanceOfEmbedRequestParameters = void 0;
    var runtime_1 = require_runtime3();
    function instanceOfEmbedRequestParameters(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfEmbedRequestParameters = instanceOfEmbedRequestParameters;
    function EmbedRequestParametersFromJSON(json) {
      return EmbedRequestParametersFromJSONTyped(json, false);
    }
    exports2.EmbedRequestParametersFromJSON = EmbedRequestParametersFromJSON;
    function EmbedRequestParametersFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "inputType": !(0, runtime_1.exists)(json, "input_type") ? void 0 : json["input_type"],
        "truncate": !(0, runtime_1.exists)(json, "truncate") ? void 0 : json["truncate"]
      };
    }
    exports2.EmbedRequestParametersFromJSONTyped = EmbedRequestParametersFromJSONTyped;
    function EmbedRequestParametersToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "input_type": value.inputType,
        "truncate": value.truncate
      };
    }
    exports2.EmbedRequestParametersToJSON = EmbedRequestParametersToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/EmbedRequest.js
var require_EmbedRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/EmbedRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EmbedRequestToJSON = exports2.EmbedRequestFromJSONTyped = exports2.EmbedRequestFromJSON = exports2.instanceOfEmbedRequest = void 0;
    var runtime_1 = require_runtime3();
    var EmbedRequestInputsInner_1 = require_EmbedRequestInputsInner();
    var EmbedRequestParameters_1 = require_EmbedRequestParameters();
    function instanceOfEmbedRequest(value) {
      var isInstance = true;
      isInstance = isInstance && "model" in value;
      isInstance = isInstance && "inputs" in value;
      return isInstance;
    }
    exports2.instanceOfEmbedRequest = instanceOfEmbedRequest;
    function EmbedRequestFromJSON(json) {
      return EmbedRequestFromJSONTyped(json, false);
    }
    exports2.EmbedRequestFromJSON = EmbedRequestFromJSON;
    function EmbedRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "model": json["model"],
        "parameters": !(0, runtime_1.exists)(json, "parameters") ? void 0 : (0, EmbedRequestParameters_1.EmbedRequestParametersFromJSON)(json["parameters"]),
        "inputs": json["inputs"].map(EmbedRequestInputsInner_1.EmbedRequestInputsInnerFromJSON)
      };
    }
    exports2.EmbedRequestFromJSONTyped = EmbedRequestFromJSONTyped;
    function EmbedRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "model": value.model,
        "parameters": (0, EmbedRequestParameters_1.EmbedRequestParametersToJSON)(value.parameters),
        "inputs": value.inputs.map(EmbedRequestInputsInner_1.EmbedRequestInputsInnerToJSON)
      };
    }
    exports2.EmbedRequestToJSON = EmbedRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/Embedding.js
var require_Embedding = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/Embedding.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EmbeddingToJSON = exports2.EmbeddingFromJSONTyped = exports2.EmbeddingFromJSON = exports2.instanceOfEmbedding = void 0;
    var runtime_1 = require_runtime3();
    function instanceOfEmbedding(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfEmbedding = instanceOfEmbedding;
    function EmbeddingFromJSON(json) {
      return EmbeddingFromJSONTyped(json, false);
    }
    exports2.EmbeddingFromJSON = EmbeddingFromJSON;
    function EmbeddingFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "values": !(0, runtime_1.exists)(json, "values") ? void 0 : json["values"]
      };
    }
    exports2.EmbeddingFromJSONTyped = EmbeddingFromJSONTyped;
    function EmbeddingToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "values": value.values
      };
    }
    exports2.EmbeddingToJSON = EmbeddingToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/EmbeddingsListUsage.js
var require_EmbeddingsListUsage = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/EmbeddingsListUsage.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EmbeddingsListUsageToJSON = exports2.EmbeddingsListUsageFromJSONTyped = exports2.EmbeddingsListUsageFromJSON = exports2.instanceOfEmbeddingsListUsage = void 0;
    var runtime_1 = require_runtime3();
    function instanceOfEmbeddingsListUsage(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfEmbeddingsListUsage = instanceOfEmbeddingsListUsage;
    function EmbeddingsListUsageFromJSON(json) {
      return EmbeddingsListUsageFromJSONTyped(json, false);
    }
    exports2.EmbeddingsListUsageFromJSON = EmbeddingsListUsageFromJSON;
    function EmbeddingsListUsageFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "totalTokens": !(0, runtime_1.exists)(json, "total_tokens") ? void 0 : json["total_tokens"]
      };
    }
    exports2.EmbeddingsListUsageFromJSONTyped = EmbeddingsListUsageFromJSONTyped;
    function EmbeddingsListUsageToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "total_tokens": value.totalTokens
      };
    }
    exports2.EmbeddingsListUsageToJSON = EmbeddingsListUsageToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/EmbeddingsList.js
var require_EmbeddingsList = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/EmbeddingsList.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EmbeddingsListToJSON = exports2.EmbeddingsListFromJSONTyped = exports2.EmbeddingsListFromJSON = exports2.instanceOfEmbeddingsList = void 0;
    var Embedding_1 = require_Embedding();
    var EmbeddingsListUsage_1 = require_EmbeddingsListUsage();
    function instanceOfEmbeddingsList(value) {
      var isInstance = true;
      isInstance = isInstance && "model" in value;
      isInstance = isInstance && "data" in value;
      isInstance = isInstance && "usage" in value;
      return isInstance;
    }
    exports2.instanceOfEmbeddingsList = instanceOfEmbeddingsList;
    function EmbeddingsListFromJSON(json) {
      return EmbeddingsListFromJSONTyped(json, false);
    }
    exports2.EmbeddingsListFromJSON = EmbeddingsListFromJSON;
    function EmbeddingsListFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "model": json["model"],
        "data": json["data"].map(Embedding_1.EmbeddingFromJSON),
        "usage": (0, EmbeddingsListUsage_1.EmbeddingsListUsageFromJSON)(json["usage"])
      };
    }
    exports2.EmbeddingsListFromJSONTyped = EmbeddingsListFromJSONTyped;
    function EmbeddingsListToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "model": value.model,
        "data": value.data.map(Embedding_1.EmbeddingToJSON),
        "usage": (0, EmbeddingsListUsage_1.EmbeddingsListUsageToJSON)(value.usage)
      };
    }
    exports2.EmbeddingsListToJSON = EmbeddingsListToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/ErrorResponseError.js
var require_ErrorResponseError2 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/ErrorResponseError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ErrorResponseErrorToJSON = exports2.ErrorResponseErrorFromJSONTyped = exports2.ErrorResponseErrorFromJSON = exports2.instanceOfErrorResponseError = exports2.ErrorResponseErrorCodeEnum = void 0;
    var runtime_1 = require_runtime3();
    exports2.ErrorResponseErrorCodeEnum = {
      Ok: "OK",
      Unknown: "UNKNOWN",
      InvalidArgument: "INVALID_ARGUMENT",
      DeadlineExceeded: "DEADLINE_EXCEEDED",
      QuotaExceeded: "QUOTA_EXCEEDED",
      NotFound: "NOT_FOUND",
      AlreadyExists: "ALREADY_EXISTS",
      PermissionDenied: "PERMISSION_DENIED",
      Unauthenticated: "UNAUTHENTICATED",
      ResourceExhausted: "RESOURCE_EXHAUSTED",
      FailedPrecondition: "FAILED_PRECONDITION",
      Aborted: "ABORTED",
      OutOfRange: "OUT_OF_RANGE",
      Unimplemented: "UNIMPLEMENTED",
      Internal: "INTERNAL",
      Unavailable: "UNAVAILABLE",
      DataLoss: "DATA_LOSS",
      Forbidden: "FORBIDDEN"
    };
    function instanceOfErrorResponseError(value) {
      var isInstance = true;
      isInstance = isInstance && "code" in value;
      isInstance = isInstance && "message" in value;
      return isInstance;
    }
    exports2.instanceOfErrorResponseError = instanceOfErrorResponseError;
    function ErrorResponseErrorFromJSON(json) {
      return ErrorResponseErrorFromJSONTyped(json, false);
    }
    exports2.ErrorResponseErrorFromJSON = ErrorResponseErrorFromJSON;
    function ErrorResponseErrorFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "code": json["code"],
        "message": json["message"],
        "details": !(0, runtime_1.exists)(json, "details") ? void 0 : json["details"]
      };
    }
    exports2.ErrorResponseErrorFromJSONTyped = ErrorResponseErrorFromJSONTyped;
    function ErrorResponseErrorToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "code": value.code,
        "message": value.message,
        "details": value.details
      };
    }
    exports2.ErrorResponseErrorToJSON = ErrorResponseErrorToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/ErrorResponse.js
var require_ErrorResponse2 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/ErrorResponse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ErrorResponseToJSON = exports2.ErrorResponseFromJSONTyped = exports2.ErrorResponseFromJSON = exports2.instanceOfErrorResponse = void 0;
    var ErrorResponseError_1 = require_ErrorResponseError2();
    function instanceOfErrorResponse(value) {
      var isInstance = true;
      isInstance = isInstance && "status" in value;
      isInstance = isInstance && "error" in value;
      return isInstance;
    }
    exports2.instanceOfErrorResponse = instanceOfErrorResponse;
    function ErrorResponseFromJSON(json) {
      return ErrorResponseFromJSONTyped(json, false);
    }
    exports2.ErrorResponseFromJSON = ErrorResponseFromJSON;
    function ErrorResponseFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "status": json["status"],
        "error": (0, ErrorResponseError_1.ErrorResponseErrorFromJSON)(json["error"])
      };
    }
    exports2.ErrorResponseFromJSONTyped = ErrorResponseFromJSONTyped;
    function ErrorResponseToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "status": value.status,
        "error": (0, ErrorResponseError_1.ErrorResponseErrorToJSON)(value.error)
      };
    }
    exports2.ErrorResponseToJSON = ErrorResponseToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/RankedDocument.js
var require_RankedDocument = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/RankedDocument.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RankedDocumentToJSON = exports2.RankedDocumentFromJSONTyped = exports2.RankedDocumentFromJSON = exports2.instanceOfRankedDocument = void 0;
    var runtime_1 = require_runtime3();
    function instanceOfRankedDocument(value) {
      var isInstance = true;
      isInstance = isInstance && "index" in value;
      isInstance = isInstance && "score" in value;
      return isInstance;
    }
    exports2.instanceOfRankedDocument = instanceOfRankedDocument;
    function RankedDocumentFromJSON(json) {
      return RankedDocumentFromJSONTyped(json, false);
    }
    exports2.RankedDocumentFromJSON = RankedDocumentFromJSON;
    function RankedDocumentFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "index": json["index"],
        "score": json["score"],
        "document": !(0, runtime_1.exists)(json, "document") ? void 0 : json["document"]
      };
    }
    exports2.RankedDocumentFromJSONTyped = RankedDocumentFromJSONTyped;
    function RankedDocumentToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "index": value.index,
        "score": value.score,
        "document": value.document
      };
    }
    exports2.RankedDocumentToJSON = RankedDocumentToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/RerankRequest.js
var require_RerankRequest = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/RerankRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RerankRequestToJSON = exports2.RerankRequestFromJSONTyped = exports2.RerankRequestFromJSON = exports2.instanceOfRerankRequest = void 0;
    var runtime_1 = require_runtime3();
    function instanceOfRerankRequest(value) {
      var isInstance = true;
      isInstance = isInstance && "model" in value;
      isInstance = isInstance && "query" in value;
      isInstance = isInstance && "documents" in value;
      return isInstance;
    }
    exports2.instanceOfRerankRequest = instanceOfRerankRequest;
    function RerankRequestFromJSON(json) {
      return RerankRequestFromJSONTyped(json, false);
    }
    exports2.RerankRequestFromJSON = RerankRequestFromJSON;
    function RerankRequestFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "model": json["model"],
        "query": json["query"],
        "topN": !(0, runtime_1.exists)(json, "top_n") ? void 0 : json["top_n"],
        "returnDocuments": !(0, runtime_1.exists)(json, "return_documents") ? void 0 : json["return_documents"],
        "rankFields": !(0, runtime_1.exists)(json, "rank_fields") ? void 0 : json["rank_fields"],
        "documents": json["documents"],
        "parameters": !(0, runtime_1.exists)(json, "parameters") ? void 0 : json["parameters"]
      };
    }
    exports2.RerankRequestFromJSONTyped = RerankRequestFromJSONTyped;
    function RerankRequestToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "model": value.model,
        "query": value.query,
        "top_n": value.topN,
        "return_documents": value.returnDocuments,
        "rank_fields": value.rankFields,
        "documents": value.documents,
        "parameters": value.parameters
      };
    }
    exports2.RerankRequestToJSON = RerankRequestToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/RerankResultUsage.js
var require_RerankResultUsage = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/RerankResultUsage.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RerankResultUsageToJSON = exports2.RerankResultUsageFromJSONTyped = exports2.RerankResultUsageFromJSON = exports2.instanceOfRerankResultUsage = void 0;
    var runtime_1 = require_runtime3();
    function instanceOfRerankResultUsage(value) {
      var isInstance = true;
      return isInstance;
    }
    exports2.instanceOfRerankResultUsage = instanceOfRerankResultUsage;
    function RerankResultUsageFromJSON(json) {
      return RerankResultUsageFromJSONTyped(json, false);
    }
    exports2.RerankResultUsageFromJSON = RerankResultUsageFromJSON;
    function RerankResultUsageFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "rerankUnits": !(0, runtime_1.exists)(json, "rerank_units") ? void 0 : json["rerank_units"]
      };
    }
    exports2.RerankResultUsageFromJSONTyped = RerankResultUsageFromJSONTyped;
    function RerankResultUsageToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "rerank_units": value.rerankUnits
      };
    }
    exports2.RerankResultUsageToJSON = RerankResultUsageToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/RerankResult.js
var require_RerankResult = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/RerankResult.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RerankResultToJSON = exports2.RerankResultFromJSONTyped = exports2.RerankResultFromJSON = exports2.instanceOfRerankResult = void 0;
    var RankedDocument_1 = require_RankedDocument();
    var RerankResultUsage_1 = require_RerankResultUsage();
    function instanceOfRerankResult(value) {
      var isInstance = true;
      isInstance = isInstance && "model" in value;
      isInstance = isInstance && "data" in value;
      isInstance = isInstance && "usage" in value;
      return isInstance;
    }
    exports2.instanceOfRerankResult = instanceOfRerankResult;
    function RerankResultFromJSON(json) {
      return RerankResultFromJSONTyped(json, false);
    }
    exports2.RerankResultFromJSON = RerankResultFromJSON;
    function RerankResultFromJSONTyped(json, ignoreDiscriminator) {
      if (json === void 0 || json === null) {
        return json;
      }
      return {
        "model": json["model"],
        "data": json["data"].map(RankedDocument_1.RankedDocumentFromJSON),
        "usage": (0, RerankResultUsage_1.RerankResultUsageFromJSON)(json["usage"])
      };
    }
    exports2.RerankResultFromJSONTyped = RerankResultFromJSONTyped;
    function RerankResultToJSON(value) {
      if (value === void 0) {
        return void 0;
      }
      if (value === null) {
        return null;
      }
      return {
        "model": value.model,
        "data": value.data.map(RankedDocument_1.RankedDocumentToJSON),
        "usage": (0, RerankResultUsage_1.RerankResultUsageToJSON)(value.usage)
      };
    }
    exports2.RerankResultToJSON = RerankResultToJSON;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/index.js
var require_models4 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/models/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_EmbedRequest(), exports2);
    __exportStar(require_EmbedRequestInputsInner(), exports2);
    __exportStar(require_EmbedRequestParameters(), exports2);
    __exportStar(require_Embedding(), exports2);
    __exportStar(require_EmbeddingsList(), exports2);
    __exportStar(require_EmbeddingsListUsage(), exports2);
    __exportStar(require_ErrorResponse2(), exports2);
    __exportStar(require_ErrorResponseError2(), exports2);
    __exportStar(require_RankedDocument(), exports2);
    __exportStar(require_RerankRequest(), exports2);
    __exportStar(require_RerankResult(), exports2);
    __exportStar(require_RerankResultUsage(), exports2);
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/apis/InferenceApi.js
var require_InferenceApi = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/apis/InferenceApi.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InferenceApi = void 0;
    var runtime = __importStar(require_runtime3());
    var index_1 = require_models4();
    var InferenceApi = (
      /** @class */
      function(_super) {
        __extends(InferenceApi2, _super);
        function InferenceApi2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        InferenceApi2.prototype.embedRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/embed",
                    method: "POST",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.EmbedRequestToJSON)(requestParameters.embedRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.EmbeddingsListFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        InferenceApi2.prototype.embed = function(requestParameters, initOverrides) {
          if (requestParameters === void 0) {
            requestParameters = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.embedRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        InferenceApi2.prototype.rerankRaw = function(requestParameters, initOverrides) {
          return __awaiter(this, void 0, void 0, function() {
            var queryParameters, headerParameters, response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  queryParameters = {};
                  headerParameters = {};
                  headerParameters["Content-Type"] = "application/json";
                  if (this.configuration && this.configuration.apiKey) {
                    headerParameters["Api-Key"] = this.configuration.apiKey("Api-Key");
                  }
                  return [4, this.request({
                    path: "/rerank",
                    method: "POST",
                    headers: headerParameters,
                    query: queryParameters,
                    body: (0, index_1.RerankRequestToJSON)(requestParameters.rerankRequest)
                  }, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [2, new runtime.JSONApiResponse(response, function(jsonValue) {
                    return (0, index_1.RerankResultFromJSON)(jsonValue);
                  })];
              }
            });
          });
        };
        InferenceApi2.prototype.rerank = function(requestParameters, initOverrides) {
          if (requestParameters === void 0) {
            requestParameters = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this.rerankRaw(requestParameters, initOverrides)];
                case 1:
                  response = _a.sent();
                  return [4, response.value()];
                case 2:
                  return [2, _a.sent()];
              }
            });
          });
        };
        return InferenceApi2;
      }(runtime.BaseAPI)
    );
    exports2.InferenceApi = InferenceApi;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/apis/index.js
var require_apis3 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/apis/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_InferenceApi(), exports2);
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/api_version.js
var require_api_version3 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/api_version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.X_PINECONE_API_VERSION = void 0;
    exports2.X_PINECONE_API_VERSION = "2024-10";
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/index.js
var require_inference3 = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_runtime3(), exports2);
    __exportStar(require_apis3(), exports2);
    __exportStar(require_models4(), exports2);
    __exportStar(require_api_version3(), exports2);
  }
});

// node_modules/@pinecone-database/pinecone/dist/inference/inferenceOperationsBuilder.js
var require_inferenceOperationsBuilder = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/inference/inferenceOperationsBuilder.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.inferenceOperationsBuilder = void 0;
    var inference_1 = require_inference3();
    var utils_1 = require_utils2();
    var middleware_1 = require_middleware();
    var inferenceOperationsBuilder = function(config2) {
      var apiKey = config2.apiKey;
      var controllerPath = (0, utils_1.normalizeUrl)(config2.controllerHostUrl) || "https://api.pinecone.io";
      var headers = config2.additionalHeaders || null;
      var apiConfig = {
        basePath: controllerPath,
        apiKey,
        queryParamsStringify: utils_1.queryParamsStringify,
        headers: __assign({ "User-Agent": (0, utils_1.buildUserAgent)(config2), "X-Pinecone-Api-Version": inference_1.X_PINECONE_API_VERSION }, headers),
        fetchApi: (0, utils_1.getFetch)(config2),
        middleware: middleware_1.middleware
      };
      return new inference_1.InferenceApi(new inference_1.Configuration(apiConfig));
    };
    exports2.inferenceOperationsBuilder = inferenceOperationsBuilder;
  }
});

// node_modules/@pinecone-database/pinecone/dist/pinecone.js
var require_pinecone = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/pinecone.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Pinecone = void 0;
    var control_1 = require_control();
    var indexHostSingleton_1 = require_indexHostSingleton();
    var errors_1 = require_errors();
    var data_1 = require_data();
    var inference_1 = require_inference2();
    var inferenceOperationsBuilder_1 = require_inferenceOperationsBuilder();
    var environment_1 = require_environment();
    var validateProperties_1 = require_validateProperties();
    var types_1 = require_types2();
    var Pinecone2 = (
      /** @class */
      function() {
        function Pinecone3(options) {
          if (options === void 0) {
            options = this._readEnvironmentConfig();
          }
          if (!options.apiKey) {
            throw new errors_1.PineconeConfigurationError("The client configuration must have required property: apiKey.");
          }
          (0, validateProperties_1.ValidateProperties)(options, types_1.PineconeConfigurationProperties);
          this.config = options;
          this._checkForBrowser();
          var api = (0, control_1.indexOperationsBuilder)(this.config);
          var infApi = (0, inferenceOperationsBuilder_1.inferenceOperationsBuilder)(this.config);
          this._configureIndex = (0, control_1.configureIndex)(api);
          this._createCollection = (0, control_1.createCollection)(api);
          this._createIndex = (0, control_1.createIndex)(api);
          this._describeCollection = (0, control_1.describeCollection)(api);
          this._deleteCollection = (0, control_1.deleteCollection)(api);
          this._describeIndex = (0, control_1.describeIndex)(api);
          this._deleteIndex = (0, control_1.deleteIndex)(api);
          this._listCollections = (0, control_1.listCollections)(api);
          this._listIndexes = (0, control_1.listIndexes)(api);
          this.inference = new inference_1.Inference(infApi);
        }
        Pinecone3.prototype._readEnvironmentConfig = function() {
          if (typeof process === "undefined" || !process || !process.env) {
            throw new errors_1.PineconeEnvironmentVarsNotSupportedError("Your execution environment does not support reading environment variables from process.env, so a configuration object is required when calling new Pinecone().");
          }
          var environmentConfig = {};
          var requiredEnvVarMap = {
            apiKey: "PINECONE_API_KEY"
          };
          var missingVars = [];
          for (var _i = 0, _a = Object.entries(requiredEnvVarMap); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], envVar = _b[1];
            var value = process.env[envVar] || "";
            if (!value) {
              missingVars.push(envVar);
            }
            environmentConfig[key] = value;
          }
          if (missingVars.length > 0) {
            throw new errors_1.PineconeConfigurationError("Since you called 'new Pinecone()' with no configuration object, we attempted to find client configuration in environment variables but the required environment variables were not set. Missing variables: ".concat(missingVars.join(", "), "."));
          }
          var optionalEnvVarMap = {
            controllerHostUrl: "PINECONE_CONTROLLER_HOST"
          };
          for (var _c = 0, _d = Object.entries(optionalEnvVarMap); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], envVar = _e[1];
            var value = process.env[envVar];
            if (value !== void 0) {
              environmentConfig[key] = value;
            }
          }
          return environmentConfig;
        };
        Pinecone3.prototype.describeIndex = function(indexName) {
          return __awaiter(this, void 0, void 0, function() {
            var indexModel;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._describeIndex(indexName)];
                case 1:
                  indexModel = _a.sent();
                  if (indexModel.host) {
                    indexHostSingleton_1.IndexHostSingleton._set(this.config, indexName, indexModel.host);
                  }
                  return [2, Promise.resolve(indexModel)];
              }
            });
          });
        };
        Pinecone3.prototype.listIndexes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var indexList, i, index;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._listIndexes()];
                case 1:
                  indexList = _a.sent();
                  if (indexList.indexes && indexList.indexes.length > 0) {
                    for (i = 0; i < indexList.indexes.length; i++) {
                      index = indexList.indexes[i];
                      indexHostSingleton_1.IndexHostSingleton._set(this.config, index.name, index.host);
                    }
                  }
                  return [2, Promise.resolve(indexList)];
              }
            });
          });
        };
        Pinecone3.prototype.createIndex = function(options) {
          return this._createIndex(options);
        };
        Pinecone3.prototype.deleteIndex = function(indexName) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, this._deleteIndex(indexName)];
                case 1:
                  _a.sent();
                  indexHostSingleton_1.IndexHostSingleton._delete(this.config, indexName);
                  return [2, Promise.resolve()];
              }
            });
          });
        };
        Pinecone3.prototype.configureIndex = function(indexName, options) {
          return this._configureIndex(indexName, options);
        };
        Pinecone3.prototype.createCollection = function(options) {
          return this._createCollection(options);
        };
        Pinecone3.prototype.listCollections = function() {
          return this._listCollections();
        };
        Pinecone3.prototype.deleteCollection = function(collectionName) {
          return this._deleteCollection(collectionName);
        };
        Pinecone3.prototype.describeCollection = function(collectionName) {
          return this._describeCollection(collectionName);
        };
        Pinecone3.prototype._checkForBrowser = function() {
          if ((0, environment_1.isBrowser)()) {
            console.warn("The Pinecone SDK is intended for server-side use only. Using the SDK within a browser context can expose your API key(s). If you have deployed the SDK to production in a browser, please rotate your API keys.");
          }
        };
        Pinecone3.prototype.getConfig = function() {
          return this.config;
        };
        Pinecone3.prototype.index = function(indexName, indexHostUrl, additionalHeaders) {
          return new data_1.Index(indexName, this.config, void 0, indexHostUrl, additionalHeaders);
        };
        Pinecone3.prototype.Index = function(indexName, indexHostUrl, additionalHeaders) {
          return this.index(indexName, indexHostUrl, additionalHeaders);
        };
        return Pinecone3;
      }()
    );
    exports2.Pinecone = Pinecone2;
  }
});

// node_modules/@pinecone-database/pinecone/dist/index.js
var require_dist = __commonJS({
  "node_modules/@pinecone-database/pinecone/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EmbeddingsList = exports2.Errors = exports2.Index = exports2.Pinecone = void 0;
    var pinecone_1 = require_pinecone();
    Object.defineProperty(exports2, "Pinecone", { enumerable: true, get: function() {
      return pinecone_1.Pinecone;
    } });
    var data_1 = require_data();
    Object.defineProperty(exports2, "Index", { enumerable: true, get: function() {
      return data_1.Index;
    } });
    exports2.Errors = __importStar(require_errors());
    var embeddingsList_1 = require_embeddingsList();
    Object.defineProperty(exports2, "EmbeddingsList", { enumerable: true, get: function() {
      return embeddingsList_1.EmbeddingsList;
    } });
  }
});

// api/batch-recommendations.ts
var batch_recommendations_exports = {};
__export(batch_recommendations_exports, {
  config: () => config,
  default: () => handler
});
module.exports = __toCommonJS(batch_recommendations_exports);

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

// api/batch-recommendations.ts
var import_pinecone = __toESM(require_dist(), 1);
var config = {
  maxDuration: 300
};
async function handler(request) {
  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  console.time(`[MAIN BATCH] Total execution`);
  console.log(`[MAIN BATCH] Started at ${(/* @__PURE__ */ new Date()).toISOString()}`);
  try {
    console.time(`[PINECONE] Client init`);
    const pc = new import_pinecone.Pinecone({ apiKey: process.env.VITE_PINECONE_API_KEY });
    console.timeEnd(`[PINECONE] Client init`);
    console.time(`[SUPABASE] Batch cleanup`);
    const { error: deleteError } = await supabase.from("recommendation_batches").delete().neq("batch_id", -1);
    console.timeEnd(`[SUPABASE] Batch cleanup`);
    if (deleteError) throw deleteError;
    console.time(`[SUPABASE] User count`);
    const { count } = await supabase.from("users").select("*", { count: "exact", head: true });
    console.timeEnd(`[SUPABASE] User count`);
    if (!count) {
      console.log(`[MAIN BATCH] No users found`);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    console.time(`[SUPABASE] Batch setup`);
    const totalBatches = Math.ceil(count / 50);
    const batchInserts = Array.from({ length: totalBatches }, (_, i) => ({
      batch_id: i,
      status: "pending"
    }));
    const { error: insertError } = await supabase.from("recommendation_batches").insert(batchInserts);
    if (insertError) throw insertError;
    console.timeEnd(`[SUPABASE] Batch setup`);
    console.time(`[TRIGGER] First batch`);
    const triggerUrl = `${process.env.BASE_URL}/api/process-batch?batchId=0`;
    await fetch(triggerUrl, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` }
    });
    console.timeEnd(`[TRIGGER] First batch`);
    console.log(`[MAIN BATCH] Initialized ${totalBatches} batches`);
    console.timeEnd(`[MAIN BATCH] Total execution`);
    return new Response(
      JSON.stringify({ success: true, totalBatches }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`[MAIN BATCH ERROR]`, error);
    console.timeEnd(`[MAIN BATCH] Total execution`);
    return new Response(
      JSON.stringify({
        error: "Initialization failed",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500 }
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
//# sourceMappingURL=batch-recommendations.js.map
