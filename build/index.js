"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// .env imports
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
// connect mongodb
const connectDb_1 = __importDefault(require("./helpers/connectDb"));
(0, connectDb_1.default)();
// other imports
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
// router import
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware"));
const routes_1 = __importDefault(require("./routes"));
// app started
const app = (0, express_1.default)();
// app usages
app.disable("x-powered-by");
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(authMiddleware_1.default);
app.use(routes_1.default);
// app listen
const { PORT, NODE_ENV } = process.env;
app.listen(PORT, () => console.log(`[${NODE_ENV}] Gate açıldı ${PORT}`));
exports.default = app;
