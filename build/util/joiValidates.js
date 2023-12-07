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
exports.jois = void 0;
const joi_1 = __importDefault(require("joi"));
const registerSchema = {
    apiName: joi_1.default.string().required(),
    protocol: joi_1.default.string().required(),
    host: joi_1.default.string().required(),
    port: joi_1.default.string().required(),
    enabled: joi_1.default.boolean().required(),
};
const unRegisterSchema = {
    apiName: joi_1.default.string().required(),
    url: joi_1.default.string().required(),
};
const enableDisableSchema = {
    apiName: joi_1.default.string().required(),
    enabled: joi_1.default.boolean().required(),
    url: joi_1.default.string().required(),
};
function validateBodyData(schema, validateData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield joi_1.default.object(schema).validateAsync(validateData);
        }
        catch (error) {
            const validationError = error;
            if (validationError.details) {
                // Handle the validation error here, you can log it or perform other actions
                throw validationError;
            }
            throw new Error("Validation error occurred.");
        }
    });
}
exports.jois = {
    register: registerSchema,
    unregister: unRegisterSchema,
    enableDisable: enableDisableSchema,
    validateFunc: validateBodyData,
};
