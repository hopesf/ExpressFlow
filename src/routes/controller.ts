import { Request, Response } from "express";
import axios from "axios";

import { IServiceInstance } from "./types";

import ApiServices from "../models/ApiServices";
import { jois } from "../util/joiValidates";
import { apiAlreadyExists, checkApiUrlExist, createNewApi, updateApi } from "../functions";
import loadBalancer from "../util/loadBalancer";

// controllers
const mainController = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Service Available" });
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
      const urlCheck = await checkApiUrlExist(registrationInfo.url);
      if (urlCheck) {
        return res.status(200).json({ error: "Bu url zaten kullanımda" });
      } else {
        await createNewApi(registrationInfo);
        res.status(201).json({ message: "Api oluşturuldu" });
      }
    } else {
      await updateApi(checkExist, registrationInfo);
      res.status(201).json({ message: "Servis güncellendi" });
    }
  } catch (error) {
    if (error instanceof Error) {
      // Doğrulama hatası olursa buraya ulaşılır
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Beklenmeyen bir sorun oluştu. hedef:registerController" });
    }
  }
};

const unregisterController = async (req: Request, res: Response) => {
  try {
    const registrationInfo: IServiceInstance = req.body;
    //validate
    await jois.validateFunc(jois.unregister, registrationInfo);

    // burada apiName'i mongodbde arayacağız.
    const checkExist = await apiAlreadyExists(registrationInfo);
    if (!checkExist) return res.status(400).json({ error: "Servis Bulunamadı" });

    const _instances = checkExist.instances;
    const existingIndex = _instances.findIndex((instance) => instance.url === registrationInfo.url);
    if (existingIndex === -1) return res.status(400).json({ error: "Servis Bulunamadı" });

    _instances.splice(existingIndex, 1);
    await ApiServices.findOneAndUpdate({ name: registrationInfo.apiName }, { instances: _instances });

    res.status(200).json({ message: "Api silindi" });
  } catch (error) {
    if (error instanceof Error) {
      // Doğrulama hatası olursa buraya ulaşılır
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Beklenmeyen bir sorun oluştu. hedef:unregisterController" });
    }
  }
};

const enableController = async (req: Request, res: Response) => {
  try {
    const registrationInfo: IServiceInstance = req.body;
    // validate
    await jois.validateFunc(jois.enableDisable, registrationInfo);

    // burada apiName'i mongodbde arayacağız.
    const checkExist = await apiAlreadyExists(registrationInfo);
    if (!checkExist) return res.status(400).json({ error: "Servis bulunamadı" });

    const _instances = checkExist.instances;
    const existingIndex = _instances.findIndex((instance) => instance.url === registrationInfo.url);
    if (existingIndex === -1) return res.status(400).json({ error: "Servis Bulunamadı" });

    _instances[existingIndex].enabled = registrationInfo.enabled;
    await ApiServices.findOneAndUpdate({ name: registrationInfo.apiName }, { instances: _instances });

    res.status(200).json({ message: "Servis güncellendi" });
  } catch (error) {
    if (error instanceof Error) {
      // Doğrulama hatası olursa buraya ulaşılır
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Beklenmeyen bir sorun oluştu. hedef:enableController" });
    }
  }
};

const redirectController = async (req: Request, res: Response) => {
  try {
    const apiName = req.params.apiName;

    // burada apiName'i mongodbde arayacağız.
    const checkExist = await apiAlreadyExists({ apiName });
    if (!checkExist) return res.status(400).json({ error: "Servis Bulunamadı" });

    if (!checkExist.loadBalanceStrategy) {
      checkExist.loadBalanceStrategy = "ROUND_ROBIN";
      checkExist.index = 0;
      await ApiServices.findOneAndUpdate({ name: apiName }, { index: 0, loadBalanceStrategy: "ROUND_ROBIN" });
    }

    const index = loadBalancer[checkExist.loadBalanceStrategy](checkExist);
    const url = checkExist.instances[index].url;

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
  } catch (error) {
    if (error instanceof Error) {
      // Doğrulama hatası olursa buraya ulaşılır
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Beklenmeyen bir sorun oluştu. hedef:redirectController" });
    }
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
