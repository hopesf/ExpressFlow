import { NextFunction, Request, Response } from "express";
import ApiAuthorizations from "../models/ApiAuthorizations";

const { PORT } = process.env;

const checkDbForAuth = async (username: string, password: string) => {
  try {
    const check = await ApiAuthorizations.findOne({ username, password });
    return check ? true : false;
  } catch (error) {
    console.log(error, "checkDbForAuth func error");
    return null;
  }
};

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const url = req.protocol + "://" + req.hostname + PORT + req.path;

  if (!req.headers.authorization) {
    res.send({ authenticated: false, path: url, message: "Authentication Unsuccessful: No Authorization Header." });
  } else {
    const authParts = Buffer.from(req.headers.authorization.split(" ")[1], "base64").toString().split(":");

    const username = authParts[0];
    const password = authParts[1];

    const result = await checkDbForAuth(username, password);

    if (result === null) {
      return res.send({
        authenticated: false,
        path: url,
        message: "Something went wrong while authenticating user: " + username + " password: " + password,
      });
    }

    if (result === false) {
      return res.send({
        authenticated: false,
        path: url,
        message: "Authentication unsuccessful",
      });
    } else {
      next();
    }
  }
};

export default authMiddleware;
