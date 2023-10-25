import { Request, Response } from "express";
import { IServiceInstance, Ix } from "./types";

import ApiServices from "../models/ApiServices";
import { jois } from "../util/joiValidates";

// helper funcs
const apiAlreadyExists = async (registrationInfo: IServiceInstance): Promise<Ix | null> => {
  const check = await ApiServices.findOne({ name: registrationInfo.apiName });
  return check ? check : null;
  //   return registryData.services[registrationInfo.apiName].instances.some((instance) => instance.url === registrationInfo.url);
};

const createNewApi = async (registrationInfo: IServiceInstance) => {
  try {
    const initialObj = {
      name: registrationInfo.apiName,
      loadBalanceStrategy: "ROUND_ROBIN",
      instances: [registrationInfo],
    };

    const newApi = new ApiServices(initialObj);
    await newApi.save();
  } catch (error: any) {
    throw new Error(`Error while creating new api:${error}`);
  }
};

// controllers
const mainController = (_: Request, res: Response) => {
  res.status(503).send("Service Unavailable");
};

const registerController = async (req: Request, res: Response) => {
  try {
    const registrationInfo: IServiceInstance = req.body;
    // eğer bir sorun yoksa aşağıdaki kodlar devam edecek. sorun varsa direkt catche düşecek zaten
    await jois.validateFunc(jois.register, registrationInfo);
    registrationInfo.url = `${registrationInfo.protocol}://${registrationInfo.host}:${registrationInfo.port}/`;

    // burada apiName'i mongodbde arayacağız.
    const checkExist = await apiAlreadyExists(registrationInfo);

    if (!checkExist) {
      // eğer apiName yoksa mongodb'ye kaydedeceğiz.
      await createNewApi(registrationInfo);
      res.status(201).json({ message: "Api oluşturuldu" });
    } else {
      console.log("mongoda zaten bu api varmış, o yüzden instanceları güncellenecek");

      const _instances = checkExist.instances;
      console.log("_instances", _instances);
    }

    // generate url address
  } catch (error: any) {
    // Doğrulama hatası olursa buraya ulaşılır
    res.status(400).json({ error: error.message });
  }

  // if (!registryData.services[registrationInfo.apiName]) {
  //   registryData.services[registrationInfo.apiName] = {
  //     index: 0,
  //     instances: [registrationInfo],
  //     loadBalanceStrategy: "ROUND_ROBIN",
  //   };
  //   updateRegistryFile(res, "Configuration added for '" + registrationInfo.apiName + "' at '" + registrationInfo.url + "'");
  // } else {
  //   if (apiAlreadyExists(registrationInfo)) {
  //     res.send(`Configuration already exists for '${registrationInfo.apiName}' at '${registrationInfo.url}'`);
  //   } else {
  //     registryData.services[registrationInfo.apiName].instances.push({ ...registrationInfo });
  //     updateRegistryFile(res, "Configuration added for '" + registrationInfo.apiName + "' at '" + registrationInfo.url + "'");
  //   }
  // }
};

const unregisterController = (req: Request, res: Response) => {
  const registrationInfo: IServiceInstance = req.body;

  // if (apiAlreadyExists(registrationInfo)) {
  //   const index = registryData.services[registrationInfo.apiName].instances.findIndex((instance) => {
  //     return registrationInfo.url === instance.url;
  //   });

  //   if (index !== -1) {
  //     registryData.services[registrationInfo.apiName].instances.splice(index, 1);
  //     updateRegistryFile(res, `Successfully unregistered '${registrationInfo.apiName}'`);
  //   } else {
  //     res.send(`Configuration does not exist for '${registrationInfo.apiName}' at '${registrationInfo.url}'`);
  //   }
  // }
};

const enableController = (req: Request, res: Response) => {
  //   const apiName = req.params.apiName;
  //   const requestBody = req.body;
  //   const instances = registryData.services[apiName].instances;
  //   const index = instances.findIndex((srv) => srv.url === requestBody.url);
  //   if (index === -1) {
  //     res.send({ status: "error", message: `Could not find '${requestBody.url}' for service '${apiName}'` });
  //   } else {
  //     instances[index].enabled = requestBody.enabled;
  //     updateRegistryFile(res, `Successfully enabled/disabled '${requestBody.url}' for service '${apiName}'`);
  //   }
};

const redirectController = (req: Request, res: Response) => {
  //   const service = registryData.services[req.params.apiName];
  // if (service) {
  //   if (!service.loadBalanceStrategy) {
  //     service.loadBalanceStrategy = "ROUND_ROBIN";
  //     updateRegistryFile(res, "Couldn't write load balance strategy");
  //   }
  //   const newIndex = _loadBalancer[service.loadBalanceStrategy](service);
  //   const url = service.instances[newIndex].url;
  //   axios({
  //     method: req.method,
  //     url: url + req.params.path,
  //     headers: req.headers,
  //     data: req.body,
  //   })
  //     .then((response) => {
  //       res.send(response.data);
  //     })
  //     .catch((error) => {
  //       res.send(error);
  //     });
  // } else {
  //   res.send("API Name doesn't exist");
  // }
};

const controllers = {
  main: mainController,
  register: registerController,
  unregister: unregisterController,
  enable: enableController,
  redirect: redirectController,
};

export default controllers;
