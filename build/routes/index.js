"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const router = express_1.default.Router();
router.get("/", controller_1.default.main);
router.get("/:id", (req, res) => {
    res.send("list");
});
router.post("/register", controller_1.default.register);
router.post("/unregister", controller_1.default.unregister);
router.post("/enable/:apiName", controller_1.default.enable);
router.all("/:apiName/:path", controller_1.default.redirect);
exports.default = router;
