// .env imports
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// other imports
import express from "express";
import compression from "compression";

// router import
import router from "./routes";

// app started
const app = express();

// app usages
app.use(compression());
app.use(express.json());
app.use(router);

// app listen
const { PORT, NODE_ENV } = process.env;
app.listen(PORT, () => console.log(`[${NODE_ENV}] Dua Kapıları açıldı ${PORT}`));
