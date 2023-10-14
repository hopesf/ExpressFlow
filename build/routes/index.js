"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.all("/:projectName", (req, res, next) => res.send(req.params.projectName));
exports.default = router;
/localhost:3000/aeegnnorsty;
