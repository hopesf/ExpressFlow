import express, { Router, Response } from "express";
import * as fs from "fs";
import registry from "./registry.json";
import IRegistry from "./types";
import loadBalancer from "../util/loadBalancer";
import controllers from "./controller";

const router: Router = express.Router();
const registryData: IRegistry = registry;
const _loadBalancer: any = loadBalancer;

router.get("/", controllers.main);
router.post("/register", controllers.register);
router.post("/unregister", controllers.unregister);
router.post("/enable/:apiName", controllers.enable);
router.all("/:apiName/:path", controllers.redirect);

const updateRegistryFile = (res: Response, message: string) => {
  fs.writeFile("./src/routes/registry.json", JSON.stringify(registryData), (error) => {
    if (error) {
      res.send("Couldn't write to registry.json" + error);
    } else {
      res.send(message);
    }
  });
};

export default router;
