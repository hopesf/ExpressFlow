import express, { Router, Request, Response } from "express";
import axios from "axios";
import { promises as fs } from "fs";
import registry from "./registry.json";
import Registry, { ServiceInstance } from "./types";
import * as loadBalancer from "../util/loadBalancer";

// const _loadBalancer: loadBalancer.LoadBalancer = loadBalancer;
const router: Router = express.Router();
const registryData: Registry = registry;
const _loadBalancer: any = loadBalancer;

// Enable/Disable API Endpoint
router.post("/enable/:apiName", async (req: Request, res: Response) => {
  const apiName: string = req.params.apiName;
  const requestBody: { url: string; enabled: boolean } = req.body;
  const instances = registryData.services[apiName].instances;
  const index = instances.findIndex((srv) => {
    return srv.url === requestBody.url;
  });
  if (index == -1) {
    res.send({ status: "error", message: "Could not find '" + requestBody.url + "' for service '" + apiName + "'" });
  } else {
    instances[index].enabled = requestBody.enabled;
    try {
      await fs.writeFile("./src/routes/registry.json", JSON.stringify(registryData));
      res.status(200).json({ status: "success", message: `Successfully enabled/disabled '${requestBody.url}' for service '${apiName}'` });
    } catch (error) {
      res.status(500).json({ status: "error", message: `Could not enable/disable '${requestBody.url}' for service '${apiName}':\n${error}` });
    }
  }
});

// Route to handle API requests
router.all("/:apiName/:path", async (req: Request, res: Response) => {
  const apiName: string = req.params.apiName;
  const service = registryData.services[apiName];

  if (service) {
    if (!service.loadBalanceStrategy) {
      service.loadBalanceStrategy = "ROUND_ROBIN";
      try {
        await fs.writeFile("./src/routes/registry.json", JSON.stringify(registryData));
      } catch (error) {
        res.status(500).json({ status: "error", message: `Couldn't write load balance strategy: ${error}` });
        return;
      }
    }

    const newIndex = _loadBalancer[service.loadBalanceStrategy](service);
    const url = service.instances[newIndex].url;
    console.log(url);
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

// Register API
router.post("/register", async (req, res) => {
  const registrationInfo = req.body;
  registrationInfo.url = registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + "/";

  if (apiAlreadyExists(registrationInfo)) {
    res.send("Configuration already exists for '" + registrationInfo.apiName + "' at '" + registrationInfo.url + "'");
  } else {
    registryData.services[registrationInfo.apiName].instances.push({ ...registrationInfo });
    try {
      await fs.writeFile("./src/routes/registry.json", JSON.stringify(registryData));
      res.status(200).json({ status: "success", message: `Successfully registered '${registrationInfo.apiName}'` });
    } catch (error) {
      res.status(500).json({ status: "error", message: `Could not register '${registrationInfo.apiName}':\n${error}` });
    }
  }
});

// Unregister API
router.post("/unregister", async (req: Request, res: Response) => {
  const registrationInfo = req.body;

  if (apiAlreadyExists(registrationInfo)) {
    const index = registryData.services[registrationInfo.apiName].instances.findIndex((instance) => {
      return registrationInfo.url === instance.url;
    });
    registryData.services[registrationInfo.apiName].instances.splice(index, 1);
    try {
      await fs.writeFile("./src/routes/registry.json", JSON.stringify(registryData));
      res.status(200).json({ status: "success", message: `Successfully unregistered '${registrationInfo.apiName}'` });
    } catch (error) {
      res.status(500).json({ status: "error", message: `Could not unregister '${registrationInfo.apiName}':\n${error}` });
    }
  } else {
    res.status(400).json({ status: "error", message: `Configuration does not exist for '${registrationInfo.apiName}' at '${registrationInfo.url}'` });
  }
});

const apiAlreadyExists = (registrationInfo: ServiceInstance) => {
  let exists = false;

  const checkExistService = registryData.services[registrationInfo.apiName];
  if (!checkExistService) {
    return exists;
  }

  registryData.services[registrationInfo.apiName].instances.forEach((instance) => {
    if (instance.url === registrationInfo.url) {
      exists = true;
      return;
    }
  });

  return exists;
};

export default router;
