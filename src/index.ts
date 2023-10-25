// .env imports
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// connect mongodb
import connectDb from "./helpers/connectDb";
connectDb();

// other imports
import express from "express";
import compression from "compression";
import helmet from "helmet";

// router import
import authMiddleware from "./middleware/authMiddleware";
import routes from "./routes";

// app started
const app = express();

// app usages
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(authMiddleware);
app.use(routes);

// app listen
const { PORT, NODE_ENV } = process.env;
app.listen(PORT, () => console.log(`[${NODE_ENV}] Gate açıldı ${PORT}`));

export default app;
