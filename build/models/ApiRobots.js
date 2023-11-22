"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const apiRobotsSchema = new mongoose_1.Schema({ name: String, status: String, merchant: String }, { versionKey: false, collection: "ApiRobots" });
const ApiRobots = (0, mongoose_1.model)("ApiRobots", apiRobotsSchema, "ApiRobots");
exports.default = ApiRobots;
