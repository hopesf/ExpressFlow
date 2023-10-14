"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// .env imports
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
// other imports
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
// router import
const routes_1 = __importDefault(require("./routes"));
// app started
const app = (0, express_1.default)();
// app usages
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(routes_1.default);
// app listen
const { PORT, NODE_ENV } = process.env;
app.listen(PORT, () => console.log(`[${NODE_ENV}] Dua Kapıları açıldı ${PORT}`));
