import { Request, Response } from "express";
import axios from "axios";

import { IServiceInstance, IapiAlreadyExists } from "./types";

import ApiServices from "../models/ApiServices";
import { jois } from "../util/joiValidates";
import { apiAlreadyExists, createNewApi, updateApi } from "../functions";
import loadBalancer from "../util/loadBalancer";

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
      // console.log("mongoda zaten bu api varmış, o yüzden instanceları güncellenecek");
      await updateApi(checkExist, registrationInfo);
      res.status(201).json({ message: "Api Güncellendi" });
    }
  } catch (error: any) {
    // Doğrulama hatası olursa buraya ulaşılır
    res.status(400).json({ error: error.message });
  }
};

const unregisterController = async (req: Request, res: Response) => {
  try {
    const registrationInfo: IServiceInstance = req.body;
    //validate
    await jois.validateFunc(jois.unregister, registrationInfo);

    // burada apiName'i mongodbde arayacağız.
    const checkExist = await apiAlreadyExists(registrationInfo);
    if (!checkExist) return res.status(400).json({ error: "Api bulunamadı" });

    const _instances = checkExist.instances;
    const existingIndex = _instances.findIndex((instance) => instance.url === registrationInfo.url);
    if (existingIndex === -1) return res.status(400).json({ error: "Api bulunamadı" });

    _instances.splice(existingIndex, 1);
    await ApiServices.findOneAndUpdate({ name: registrationInfo.apiName }, { instances: _instances });

    res.status(200).json({ message: "Api silindi" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const enableController = async (req: Request, res: Response) => {
  try {
    const registrationInfo: IServiceInstance = req.body;
    // validate
    await jois.validateFunc(jois.enableDisable, registrationInfo);

    // burada apiName'i mongodbde arayacağız.
    const checkExist = await apiAlreadyExists(registrationInfo);
    if (!checkExist) return res.status(400).json({ error: "Api bulunamadı" });

    const _instances = checkExist.instances;
    const existingIndex = _instances.findIndex((instance) => instance.url === registrationInfo.url);
    if (existingIndex === -1) return res.status(400).json({ error: "Api bulunamadı" });

    _instances[existingIndex].enabled = registrationInfo.enabled;
    await ApiServices.findOneAndUpdate({ name: registrationInfo.apiName }, { instances: _instances });

    res.status(200).json({ message: "Api güncellendi" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const redirectController = async (req: Request, res: Response) => {
  try {
    const apiName = req.params.apiName;
    // burada apiName'i mongodbde arayacağız.
    const checkExist = await apiAlreadyExists({ apiName });
    if (!checkExist) return res.status(400).json({ error: "Api bulunamadı" });

    if (!checkExist.loadBalanceStrategy) {
      checkExist.loadBalanceStrategy = "ROUND_ROBIN";
      checkExist.index = 0;
      await ApiServices.findOneAndUpdate({ name: apiName }, { index: 0, loadBalanceStrategy: "ROUND_ROBIN" });
    }

    const index = loadBalancer[checkExist.loadBalanceStrategy](checkExist);
    const url = checkExist.instances[index].url;

    console.log(url);

    axios({
      method: req.method,
      url: url + req.params.path,
      headers: req.headers,
      data: req.body,
    })
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.json(error);
      });

    // update index in mongodb
    await ApiServices.findOneAndUpdate({ name: apiName }, { index });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const controllers = {
  main: mainController,
  register: registerController,
  unregister: unregisterController,
  enable: enableController,
  redirect: redirectController,
};

export default controllers;