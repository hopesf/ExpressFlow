import express, { Router, Request, Response } from "express";
import axios from "axios";
import * as fs from "fs";
import registry from "./registry.json";
import Registry, { ServiceInstance } from "./types";
import * as loadBalancer from "../util/loadBalancer";
import authMiddleware from "../middleware/authMiddleware";

const router: Router = express.Router();
const registryData: Registry = registry;
const _loadBalancer: any = loadBalancer;

// watch gateway
router.get("/monitor", (req: Request, res: Response) => res.render("index", { services: registryData.services }));

// register services
router.post("/register", authMiddleware, (req: Request, res: Response) => {
  const registrationInfo = req.body;
  registrationInfo.url = registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + "/";

  if (apiAlreadyExists(registrationInfo)) {
    res.send("Configuration already exists for '" + registrationInfo.apiName + "' at '" + registrationInfo.url + "'");
  } else {
    registryData.services[registrationInfo.apiName].instances.push({ ...registrationInfo });
    fs.writeFile("./src/routes/registry.json", JSON.stringify(registryData), (error) => {
      if (error) {
        res.send("Couldn't write to registry.json" + error);
      }
    });
    res.send("Configuration added for '" + registrationInfo.apiName + "' at '" + registrationInfo.url + "'");
  }
});

router.post("/unregister", authMiddleware, (req: Request, res: Response) => {
  const registrationInfo = req.body;

  if (apiAlreadyExists(registrationInfo)) {
    const index = registryData.services[registrationInfo.apiName].instances.findIndex((instance) => {
      return registrationInfo.url === instance.url;
    });

    registryData.services[registrationInfo.apiName].instances.splice(index, 1);
    fs.writeFile("./src/routes/registry.json", JSON.stringify(registryData), (error) => {
      if (error) {
        res.send("Couldn't write to registry.json" + error);
      }
    });
    res.send("Successfully unregistered '" + registrationInfo.apiName + "'");
  } else {
    res.send("Configuration does not exist for '" + registrationInfo.apiName + "' at '" + registrationInfo.url + "'");
  }
});

// get services
router.all("/:apiName/:path", (req, res) => {
  const service = registryData.services[req.params.apiName];
  if (service) {
    if (!service.loadBalanceStrategy) {
      service.loadBalanceStrategy = "ROUND_ROBIN";
      fs.writeFile("./src/routes/registry.json", JSON.stringify(registryData), (error) => {
        if (error) {
          res.send("Couldn't write load balance strategy" + error);
        }
      });
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
