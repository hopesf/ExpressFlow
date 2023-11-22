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
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const models_1 = require("../models");
const router = express_1.default.Router();
router.get("/", controller_1.default.main);
// this router should be update robot status for manage robots
router.post("/changeRobotStatus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body)
        return res.status(400).json({ message: "body is required" });
    if (!body.name)
        return res.status(400).json({ message: "name is required" });
    if (!body.status)
        return res.status(400).json({ message: "status is required" });
    if (!body.merchant)
        return res.status(400).json({ message: "merchant is required" });
    const { name, status, merchant } = body;
    models_1.ApiRobots.updateOne({ name, merchant }, { $set: { status: status === "on" ? "off" : "on" } }, { upsert: true })
        .then(() => res.json({ message: "success" }))
        .catch((err) => res.status(400).json({ message: err }));
}));
// this router should be update service status for manage services inside of instances
router.post("/changeServiceInstanceStatus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body)
        return res.status(400).json({ message: "body is required" });
    const { serviceName, instanceUrl, newStatus } = body;
    models_1.ApiServices.updateOne({ name: serviceName, "instances.url": instanceUrl }, { $set: { "instances.$.enabled": newStatus } }, { upsert: true })
        .then(() => res.json({ message: "success" }))
        .catch((err) => res.status(400).json({ message: err }));
}));
router.post("/register", controller_1.default.register);
router.post("/unregister", controller_1.default.unregister);
router.post("/enable/:apiName", controller_1.default.enable);
router.all("/:apiName/:path", controller_1.default.redirect);
exports.default = router;
