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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const getApiRobots = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.ApiRobots.aggregate([
        {
            $lookup: {
                from: "MerchantPool",
                localField: "merchant",
                foreignField: "merchant",
                as: "pool",
            },
        },
        {
            $project: {
                _id: 0,
                name: 1,
                status: 1,
                merchant: 1,
                queue: {
                    $size: "$pool",
                },
            },
        },
    ]);
});
exports.default = getApiRobots;
