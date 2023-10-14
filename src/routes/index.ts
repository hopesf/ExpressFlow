import fs from "fs";
import express from "express";
import axios from "axios";
import registry from "./registry.json";

interface Service {
  apiName: string;
  host: string;
  port: number;
  url: string;
}

interface Registry {
  services: { [key: string]: Service };
}

const _registry: Registry = registry;

const router = express.Router();

router.all("/:projectName/:path", (req, res) => {
  const serviceName = req.params.projectName;
  const service = _registry.services[serviceName];

  if (service) {
    const apiUrl = `${service.url}/${req.params.path}`;

    axios({
      method: req.method,
      url: apiUrl,
      headers: req.headers,
      data: req.body,
    }).then((response) => {
      res.send(response.data);
    });
  } else {
    res.status(404).send("Service not found");
  }
});

router.post("/newProject", async (req, res) => {
  const projectInfo = req.body;
  projectInfo.port = parseInt(projectInfo.port.toString());
  _registry.services[projectInfo.apiName] = { ...projectInfo };

  fs.writeFile("./src/routes/registry.json", JSON.stringify(_registry), (err) => {
    if (err) {
      res.send("Yeni proje kaydedilemedi " + projectInfo.apiName + "\n" + err);
    } else {
      res.send("Yeni proje kaydedildi " + projectInfo.apiName);
    }
  });
});

export default router;
