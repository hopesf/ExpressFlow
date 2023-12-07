"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ApiServicesSchema = new mongoose_1.Schema({
    name: String,
    loadBalanceStrategy: String,
    index: Number,
    instances: [
        {
            _id: false,
            protocol: String,
            host: String,
            port: String,
            enabled: { type: Boolean, default: true },
            url: String,
        },
    ],
}, { versionKey: false, collection: "ApiServices" });
const ApiServices = (0, mongoose_1.model)("ApiServices", ApiServicesSchema);
exports.default = ApiServices;
