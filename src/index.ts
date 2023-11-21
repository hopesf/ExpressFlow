// .env imports
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// connect mongodb
import connectDb from "./helpers/connectDb";

// other imports
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import cors from "cors";
import { rateLimit } from "express-rate-limit";
import compression from "compression";
import * as os from "os-utils";
import cron from "node-cron";
import helmet from "helmet";

// router import
import routes from "./routes";

// app started
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// app usages
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(limiter);
// app.use(authMiddleware);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const helperRequests: any[] = [];

app.use(async (req, res, next) => {
  const originalUrl = req.originalUrl;
  const checkExist = helperRequests.find((item: { routerPath: string }) => item.routerPath === originalUrl);

  if (!checkExist) {
    helperRequests.push({ routerPath: originalUrl, count: checkExist ? checkExist.count++ : 1, ready: false });
  } else {
    checkExist.count++;
  }
  next();
});

app.use(async (req, res, next) => {
  const originalUrl = req.originalUrl;
  const checkExist = helperRequests.find((item: { routerPath: string }) => item.routerPath === originalUrl);

  res.on("finish", async function () {
    if (checkExist) {
      checkExist.ready = true;
    }
    io.emit("helperRequests", helperRequests);
  });
  next();
});

app.use(routes);

cron.schedule("*/5 * * * * *", () => {
  if (helperRequests.length > 0) {
    const getElement = helperRequests[0];
    if (getElement.ready) {
      helperRequests.shift();
    }
  }
  io.emit("helperRequests", helperRequests);
});

let tick = 0;

(async () => {
  await connectDb()
    .then(async () => {
      io.on("connection", async (socket) => {
        setInterval(() => {
          os.cpuUsage((cpuPercent) => {
            socket.emit("cpu", {
              name: tick++,
              value: cpuPercent,
            });
          });
        }, 5000);
      });

      // app listen
      const { PORT, NODE_ENV } = process.env;
      httpServer.listen(PORT, () => console.log(`[${NODE_ENV}] Gate açıldı ${PORT}`));
    })
    .catch((err) => console.log(err));
})();

export default app;
