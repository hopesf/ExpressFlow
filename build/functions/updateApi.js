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
const updateApi = (checkExist, registrationInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _instances = checkExist.instances;
        const existingIndex = _instances.findIndex((instance) => instance.url === registrationInfo.url);
        existingIndex !== -1 ? (_instances[existingIndex] = registrationInfo) : _instances.push(registrationInfo);
        yield ApiServices_1.default.findOneAndUpdate({ name: registrationInfo.apiName }, { instances: _instances });
        return true;
    }
    catch (error) {
        throw new Error(`Error while updating api: ${error}`);
    }
});
exports.default = updateApi;
