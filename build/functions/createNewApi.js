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
const createNewApi = (registrationInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const initialObj = {
            name: registrationInfo.apiName,
            loadBalanceStrategy: "ROUND_ROBIN",
            instances: [registrationInfo],
        };
        const newApi = new ApiServices_1.default(initialObj);
        yield newApi.save();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            throw error;
        }
        else {
            console.error("yeni api oluşturulurken bir sorun oluştu.");
            throw new Error(`Error while creating new api:${error}`);
        }
    }
});
exports.default = createNewApi;
