import { NextFunction, Request, Response } from "express";
import registry from "../routes/registry.json";
import Registry from "../routes/types";

const registryData: Registry = registry;
const { PORT } = process.env;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const url = req.protocol + "://" + req.hostname + PORT + req.path;

  if (!req.headers.authorization) {
    res.send({ authenticated: false, path: url, message: "Authentication Unsuccessful: No Authorization Header." });
  } else {
    const authString = Buffer.from(req.headers.authorization as string, "base64").toString("utf8");
    const authParts = authString.split(":");

    const username = authParts[0];
    const password = authParts[1];

    const user = registryData.auth.users[username];

    if (!user) {
      return res.send({ authenticated: false, path: url, message: "Authentication Unsuccessful: User " + username + " does not exist." });
    }

    if (user.username === username && user.password === password) {
      next();
    } else {
      res.send({ authenticated: false, path: url, message: "Authentication Unsuccessful: Incorrect password." });
    }
  }
};

export default authMiddleware;
