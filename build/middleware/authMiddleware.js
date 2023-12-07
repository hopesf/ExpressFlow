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
const ApiAuthorizations_1 = __importDefault(require("../models/ApiAuthorizations"));
const { PORT } = process.env;
const checkDbForAuth = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const check = yield ApiAuthorizations_1.default.findOne({ username, password });
        return check ? true : false;
    }
    catch (error) {
        console.log(error, "checkDbForAuth func error");
        return null;
    }
});
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.protocol + "://" + req.hostname + PORT + req.path;
    if (!req.headers.authorization) {
        res.send({ authenticated: false, path: url, message: "Authentication Unsuccessful: No Authorization Header." });
    }
    else {
        const authParts = Buffer.from(req.headers.authorization.split(" ")[1], "base64").toString().split(":");
        const username = authParts[0];
        const password = authParts[1];
        const result = yield checkDbForAuth(username, password);
        if (result === null) {
            return res.send({
                authenticated: false,
                path: url,
                message: "Something went wrong while authenticating user: " + username + " password: " + password,
            });
        }
        if (result === false) {
            return res.send({
                authenticated: false,
                path: url,
                message: "Authentication unsuccessful",
            });
        }
        else {
            next();
        }
    }
});
exports.default = authMiddleware;
