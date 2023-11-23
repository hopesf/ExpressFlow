"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// .env imports
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
// connect mongodb
const connectDb_1 = __importDefault(require("./helpers/connectDb"));
// other imports
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = require("express-rate-limit");
const compression_1 = __importDefault(require("compression"));
const os = __importStar(require("os-utils"));
const node_cron_1 = __importDefault(require("node-cron"));
const helmet_1 = __importDefault(require("helmet"));
// router import
const routes_1 = __importDefault(require("./routes"));
const getPoolChart_1 = __importDefault(require("./functions/getPoolChart"));
const getServiceLists_1 = __importDefault(require("./functions/getServiceLists"));
const getGatewayNetworkChart_1 = __importDefault(require("./functions/getGatewayNetworkChart"));
const getApiRobots_1 = __importDefault(require("./functions/getApiRobots"));
const getApiLogs_1 = __importDefault(require("./functions/getApiLogs"));
const getCounters_1 = __importDefault(require("./functions/getCounters"));
const models_1 = require("./models");
// app started
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, { transports: ["polling", "websocket",], cors: { origin: ["https://gateway.czlondon.com/"] } });
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
// app usages
app.disable("x-powered-by");
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(limiter);
app.set('trust proxy', 1);
// app.use(authMiddleware);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const helperRequests = [];
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const originalUrl = req.originalUrl;
    const checkExist = helperRequests.find((item) => item.routerPath === originalUrl);
    if (!checkExist) {
        helperRequests.push({ routerPath: originalUrl, count: checkExist ? checkExist.count++ : 1, ready: false });
    }
    else {
        checkExist.count++;
    }
    next();
}));
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const originalUrl = req.originalUrl;
    const checkExist = helperRequests.find((item) => item.routerPath === originalUrl);
    res.on("finish", function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (checkExist) {
                checkExist.ready = true;
            }
            io.emit("helperRequests", helperRequests);
        });
    });
    next();
}));
app.use(routes_1.default);
node_cron_1.default.schedule("*/5 * * * * *", () => {
    if (helperRequests.length > 0) {
        const getElement = helperRequests[0];
        if (getElement.ready) {
            helperRequests.shift();
        }
    }
    io.emit("helperRequests", helperRequests);
});
let tick = 0;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connectDb_1.default)()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
            socket.emit("poolChart", yield (0, getPoolChart_1.default)());
            socket.emit("serviceLists", yield (0, getServiceLists_1.default)());
            socket.emit("gatewayNetworkChart", yield (0, getGatewayNetworkChart_1.default)());
            socket.emit("apiRobots", yield (0, getApiRobots_1.default)());
            socket.emit("apiLogs", yield (0, getApiLogs_1.default)());
            socket.emit("counters", yield (0, getCounters_1.default)());
            setInterval(() => {
                os.cpuUsage((cpuPercent) => {
                    socket.emit("cpu", {
                        name: tick++,
                        value: cpuPercent,
                    });
                });
            }, 5000);
        }));
        // Merchant pool chartı için
        models_1.MerchantPool.watch().on("change", () => __awaiter(void 0, void 0, void 0, function* () {
            io.emit("poolChart", yield (0, getPoolChart_1.default)());
            io.emit("apiRobots", yield (0, getApiRobots_1.default)());
        }));
        // servis listesi için
        models_1.ApiServices.watch().on("change", () => __awaiter(void 0, void 0, void 0, function* () {
            io.emit("serviceLists", yield (0, getServiceLists_1.default)());
            io.emit("counters", yield (0, getCounters_1.default)());
        }));
        // api gateway anlık chart grafiği
        models_1.GatewayNetwork.watch().on("change", () => __awaiter(void 0, void 0, void 0, function* () { return io.emit("gatewayNetworkChart", yield (0, getGatewayNetworkChart_1.default)()); }));
        // api robots listesi
        models_1.ApiRobots.watch().on("change", () => __awaiter(void 0, void 0, void 0, function* () {
            io.emit("apiRobots", yield (0, getApiRobots_1.default)());
            io.emit("counters", yield (0, getCounters_1.default)());
        }));
        // api logs listesi
        models_1.ApiLogs.watch().on("change", () => __awaiter(void 0, void 0, void 0, function* () { return io.emit("apiLogs", yield (0, getApiLogs_1.default)()); }));
        // app listen
        const { PORT, NODE_ENV } = process.env;
        httpServer.listen(PORT, () => console.log(`[${NODE_ENV}] Gate açıldı ${PORT}`));
    }))
        .catch((err) => console.log(err));
}))();
exports.default = app;
