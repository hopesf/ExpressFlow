// .env imports
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// connect mongodb
import connectDb from "./helpers/connectDb";
connectDb();

// other imports
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import cors from "cors";
import compression from "compression";
import helmet from "helmet";

// router import
import authMiddleware from "./middleware/authMiddleware";
import routes from "./routes";

// app started
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  //   transports: ["websocket"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let isFirstConnection = true;

io.on("connection", (socket) => {
  console.log("Bir kullanıcı ana sunucuya bağlandı", socket.id);

  socket.on("mesaj", (data: any) => {
    console.log("frontdan gelen mesaj:", data);
  });

  // Server1'den Server2'ye bağlantı kur
  // const server2Socket = require("socket.io-client")("http://localhost:2002");

  // server2Socket.on("cevap", (data: any) => {
  //   console.log("Server2'den gelen cevap:", data);
  // });
  //   socket.emit("cevapdon", "xasdasdasdad");
});

// app usages
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(authMiddleware);
app.use(routes);

// app listen
const { PORT, NODE_ENV } = process.env;
httpServer.listen(PORT, () => console.log(`[${NODE_ENV}] Gate açıldı ${PORT}`));

export default app;
