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
const GatewayNetwork_1 = __importDefault(require("../models/GatewayNetwork"));
function ManageRouterNetwork(originalUrl, process) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkRouter = yield GatewayNetwork_1.default.findOne({ routePath: originalUrl });
            if (process === "check") {
                if (!checkRouter) {
                    (yield GatewayNetwork_1.default.create({ routePath: originalUrl, count: 1 })).save();
                }
                else {
                    checkRouter.count++;
                    yield checkRouter.save();
                }
                return true;
            }
            if (process === "delete") {
                if (checkRouter) {
                    if (checkRouter.count <= 1) {
                        yield GatewayNetwork_1.default.findOneAndDelete({ routePath: originalUrl });
                    }
                    else {
                        checkRouter.count--;
                        yield checkRouter.save();
                    }
                }
            }
        }
        catch (error) {
            throw new Error(`Beklenmeyen bir sorun oluştu. hedef:ManageRouterNetwork, error:${error}`);
        }
    });
}
exports.default = ManageRouterNetwork;
