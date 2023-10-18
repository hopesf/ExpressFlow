// .env imports
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// other imports
import express, { NextFunction, Request, Response } from "express";
import compression from "compression";
import helmet from "helmet";

// router import
import routes from "./routes";
import registry from "./routes/registry.json";
import Registry from "./routes/types";

// app started
const app = express();
const registryData: Registry = registry;

// app usages
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(compression());
app.use(express.json());
app.use(helmet());

const { PORT, NODE_ENV } = process.env;

const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const url = req.protocol + "://" + req.hostname + PORT + req.path;
  const authString = Buffer.from(req.headers.authorization as string, "base64").toString("utf8");
  const authParts = authString.split(":");
  const username = authParts[0];
  const password = authParts[1];

  console.log(username + " | " + password);
  const user = registryData.auth.users[username];
  if (user) {
    if (user.username === username && user.password === password) {
      next();
    } else {
      res.send({ authenticated: false, path: url, message: "Authentication Unsuccessful: Incorrect password." });
    }
  } else {
    res.send({ authenticated: false, path: url, message: "Authentication Unsuccessful: User " + username + " does not exist." });
  }
};

app.get("/ui", (req, res) => {
  res.render("index", { services: registryData.services });
});
app.use(auth);
app.use("/", routes);

// app listen

app.listen(PORT, () => console.log(`[${NODE_ENV}] Gate açıldı ${PORT}`));
