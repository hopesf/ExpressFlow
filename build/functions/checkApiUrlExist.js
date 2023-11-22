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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiServices_1 = __importDefault(require("../models/ApiServices"));
// eslint-disable-next-line @typescript-eslint/ban-types
const checkApiUrlExist = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUrls = yield ApiServices_1.default.aggregate([
            { $unwind: { path: "$instances", preserveNullAndEmptyArrays: false } },
            { $group: { _id: "$instances.url" } },
            { $project: { url: "$_id", _id: false } },
        ]);
        const result = allUrls.some((item) => item.url === url);
        return result ? true : false;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
exports.default = checkApiUrlExist;
