import express, { Router, Request, Response } from "express";
import axios from "axios";
import * as fs from "fs";
import registry from "./registry.json";
import IRegistry, { IServiceInstance } from "./types";
import authMiddleware from "../middleware/authMiddleware";
import loadBalancer from "../util/loadBalancer";

const router: Router = express.Router();
const registryData: IRegistry = registry;
const _loadBalancer: any = loadBalancer;

// Route for monitoring
router.get("/monitor", (req: Request, res: Response) => {
  res.render("index", { services: registryData.services });
});

// Route to register services
router.post("/register", authMiddleware, (req: Request, res: Response) => {
  const registrationInfo: IServiceInstance = req.body;
  registrationInfo.url = `${registrationInfo.protocol}://${registrationInfo.host}:${registrationInfo.port}/`;

  if (apiAlreadyExists(registrationInfo)) {
    res.send(`Configuration already exists for '${registrationInfo.apiName}' at '${registrationInfo.url}'`);
  } else {
    registryData.services[registrationInfo.apiName].instances.push({ ...registrationInfo });
    updateRegistryFile(res, "Configuration added for '" + registrationInfo.apiName + "' at '" + registrationInfo.url + "'");
  }
});

// Route to unregister services
router.post("/unregister", authMiddleware, (req: Request, res: Response) => {
  const registrationInfo: IServiceInstance = req.body;

  if (apiAlreadyExists(registrationInfo)) {
    const index = registryData.services[registrationInfo.apiName].instances.findIndex((instance) => {
      return registrationInfo.url === instance.url;
    });

    if (index !== -1) {
      registryData.services[registrationInfo.apiName].instances.splice(index, 1);
      updateRegistryFile(res, `Successfully unregistered '${registrationInfo.apiName}'`);
    } else {
      res.send(`Configuration does not exist for '${registrationInfo.apiName}' at '${registrationInfo.url}'`);
    }
  }
});

// Route to enable/disable services
router.post("/enable/:apiName", (req: Request, res: Response) => {
  const apiName = req.params.apiName;
  const requestBody = req.body;
  const instances = registryData.services[apiName].instances;
  const index = instances.findIndex((srv) => srv.url === requestBody.url);

  if (index === -1) {
    res.send({ status: "error", message: `Could not find '${requestBody.url}' for service '${apiName}'` });
  } else {
    instances[index].enabled = requestBody.enabled;
    updateRegistryFile(res, `Successfully enabled/disabled '${requestBody.url}' for service '${apiName}'`);
  }
});

// Route to redirect services
router.all("/:apiName/:path", (req: Request, res: Response) => {
  const service = registryData.services[req.params.apiName];
  if (service) {
    if (!service.loadBalanceStrategy) {
      service.loadBalanceStrategy = "ROUND_ROBIN";
      updateRegistryFile(res, "Couldn't write load balance strategy");
    }

    const newIndex = _loadBalancer[service.loadBalanceStrategy](service);
    const url = service.instances[newIndex].url;
    axios({
      method: req.method,
      url: url + req.params.path,
      headers: req.headers,
      data: req.body,
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        res.send("");
      });
  } else {
    res.send("API Name doesn't exist");
  }
});

const apiAlreadyExists = (registrationInfo: IServiceInstance) => {
  return registryData.services[registrationInfo.apiName].instances.some((instance) => instance.url === registrationInfo.url);
};

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
