// .env imports
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// other imports
import express from "express";
import compression from "compression";
import helmet from "helmet";

// router import
import routes from "./routes";

// app started
const app = express();

// app usages
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(compression());
app.use(express.json());
app.use(helmet());

app.use("/", routes);

// app listen
const { PORT, NODE_ENV } = process.env;
app.listen(PORT, () => console.log(`[${NODE_ENV}] Gate açıldı ${PORT}`));

export default app;
