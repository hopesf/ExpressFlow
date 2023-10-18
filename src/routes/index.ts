import express, { Router, Request, Response } from "express";
import axios from "axios";
import { promises as fs } from "fs";
import registry from "./registry.json";
import Registry, { ServiceInstance } from "./types";
import * as loadBalancer from "../util/loadBalancer";
import authMiddleware from "../middleware/authMiddleware";

// const _loadBalancer: loadBalancer.LoadBalancer = loadBalancer;
const router: Router = express.Router();
const registryData: Registry = registry;
const _loadBalancer: any = loadBalancer;

router.get("/monitor", (req: Request, res: Response) => res.render("index", { services: registryData.services }));

router.post("/register", authMiddleware, async (req: Request, res: Response) => {
  const registrationInfo = req.body;
  registrationInfo.url = registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + "/";

  if (apiAlreadyExists(registrationInfo)) {
    res.send("Configuration already exists for '" + registrationInfo.apiName + "' at '" + registrationInfo.url + "'");
  } else {
    registryData.services[registrationInfo.apiName].instances.push({ ...registrationInfo });
    await fs.writeFile("./src/routes/registry.json", JSON.stringify(registryData));
    res.send("Configuration added for '" + registrationInfo.apiName + "' at '" + registrationInfo.url + "'");
  }
});

router.post("/unregister", authMiddleware, async (req: Request, res: Response) => {
  const registrationInfo = req.body;

  if (apiAlreadyExists(registrationInfo)) {
    const index = registryData.services[registrationInfo.apiName].instances.findIndex((instance) => {
      return registrationInfo.url === instance.url;
    });

    registryData.services[registrationInfo.apiName].instances.splice(index, 1);
    await fs.writeFile("./src/routes/registry.json", JSON.stringify(registryData));
    res.send("Successfully unregistered '" + registrationInfo.apiName + "'");
  } else {
    res.send("Configuration does not exist for '" + registrationInfo.apiName + "' at '" + registrationInfo.url + "'");
  }
});

const apiAlreadyExists = (registrationInfo: ServiceInstance) => {
  let exists = false;

  registryData.services[registrationInfo.apiName].instances.forEach((instance) => {
    if (instance.url === registrationInfo.url) {
      exists = true;
      return;
    }
  });

  return exists;
};

export default router;
