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
import helmet from "helmet";

// router import
import swaggerDocs from "./util/swagger";
import routes from "./routes";
import cronFunc from "./util/cronJob";

// app started
export const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: "*" } });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// swagger docs here
swaggerDocs(app, Number(process.env.PORT));

// app usages
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(limiter);
// app.use(authMiddleware);

app.use(cronFunc);
app.use(routes);

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
