"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MerchantPoolSchema = new mongoose_1.Schema({
    documentId: mongoose_1.Types.ObjectId,
    merchant: String,
    process: String,
}, { versionKey: false, collection: "MerchantPool" });
const MerchantPool = (0, mongoose_1.model)("MerchantPool", MerchantPoolSchema, "MerchantPool");
exports.default = MerchantPool;
