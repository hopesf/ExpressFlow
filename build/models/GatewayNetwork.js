"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GatewayNetworkSchema = new mongoose_1.Schema({ routePath: String, count: Number }, { versionKey: false, collection: "ApiAuthorizations" });
const GatewayNetwork = (0, mongoose_1.model)("GatewayNetwork", GatewayNetworkSchema, "GatewayNetwork");
exports.default = GatewayNetwork;
