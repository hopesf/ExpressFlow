"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ApiAuthorizationsSchema = new mongoose_1.Schema({ username: String, password: String }, { versionKey: false, collection: "ApiAuthorizations" });
const ApiAuthorizations = (0, mongoose_1.model)("ApiAuthorizations", ApiAuthorizationsSchema, "ApiAuthorizations");
exports.default = ApiAuthorizations;
