"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const apiLogsSchema = new mongoose_1.Schema({ modelCode: String, merchant: String, responseStatus: String, type: String, description: String }, { versionKey: false, collection: "ApiRobots" });
const ApiLogs = (0, mongoose_1.model)("ApiLogs", apiLogsSchema, "ApiLogs");
exports.default = ApiLogs;
