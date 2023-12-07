"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ApiServices_1 = __importDefault(require("../models/ApiServices"));
const joiValidates_1 = require("../util/joiValidates");
const functions_1 = require("../functions");
const loadBalancer_1 = __importDefault(require("../util/loadBalancer"));
// controllers
const mainController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    res.status(503).send("Service Unavailable");
  });
const registerController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const registrationInfo = req.body;
      // eğer bir sorun yoksa aşağıdaki kodlar devam edecek. sorun varsa direkt catche düşecek zaten
      yield joiValidates_1.jois.validateFunc(joiValidates_1.jois.register, registrationInfo);
      registrationInfo.url = `${registrationInfo.protocol}://${registrationInfo.host}:${registrationInfo.port}/`;
      // burada apiName'i mongodbde arayacağız.
      const checkExist = yield (0, functions_1.apiAlreadyExists)(registrationInfo);
      if (!checkExist) {
        // eğer apiName yoksa mongodb'ye kaydedeceğiz.
        const urlCheck = yield (0, functions_1.checkApiUrlExist)(registrationInfo.url);
        if (urlCheck) {
          return res.status(200).json({ error: "Bu url zaten kullanımda" });
        } else {
          yield (0, functions_1.createNewApi)(registrationInfo);
          res.status(201).json({ message: "Api oluşturuldu" });
        }
      } else {
        yield (0, functions_1.updateApi)(checkExist, registrationInfo);
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
  });
const unregisterController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const registrationInfo = req.body;
      //validate
      yield joiValidates_1.jois.validateFunc(joiValidates_1.jois.unregister, registrationInfo);
      // burada apiName'i mongodbde arayacağız.
      const checkExist = yield (0, functions_1.apiAlreadyExists)(registrationInfo);
      if (!checkExist) return res.status(400).json({ error: "Servis Bulunamadı" });
      const _instances = checkExist.instances;
      const existingIndex = _instances.findIndex((instance) => instance.url === registrationInfo.url);
      if (existingIndex === -1) return res.status(400).json({ error: "Servis Bulunamadı" });
      _instances.splice(existingIndex, 1);
      yield ApiServices_1.default.findOneAndUpdate({ name: registrationInfo.apiName }, { instances: _instances });
      res.status(200).json({ message: "Api silindi" });
    } catch (error) {
      if (error instanceof Error) {
        // Doğrulama hatası olursa buraya ulaşılır
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Beklenmeyen bir sorun oluştu. hedef:unregisterController" });
      }
    }
  });
const enableController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const registrationInfo = req.body;
      // validate
      yield joiValidates_1.jois.validateFunc(joiValidates_1.jois.enableDisable, registrationInfo);
      // burada apiName'i mongodbde arayacağız.
      const checkExist = yield (0, functions_1.apiAlreadyExists)(registrationInfo);
      if (!checkExist) return res.status(400).json({ error: "Servis Bulunamadı" });
      const _instances = checkExist.instances;
      const existingIndex = _instances.findIndex((instance) => instance.url === registrationInfo.url);
      if (existingIndex === -1) return res.status(400).json({ error: "Servis Bulunamadı" });
      _instances[existingIndex].enabled = registrationInfo.enabled;
      yield ApiServices_1.default.findOneAndUpdate({ name: registrationInfo.apiName }, { instances: _instances });
      res.status(200).json({ message: "Servis güncellendi" });
    } catch (error) {
      if (error instanceof Error) {
        // Doğrulama hatası olursa buraya ulaşılır
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Beklenmeyen bir sorun oluştu. hedef:enableController" });
      }
    }
  });
const redirectController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const apiName = req.params.apiName;
      // burada apiName'i mongodbde arayacağız.
      const checkExist = yield (0, functions_1.apiAlreadyExists)({ apiName });
      if (!checkExist) return res.status(400).json({ error: "Servis Bulunamadı" });
      if (!checkExist.loadBalanceStrategy) {
        checkExist.loadBalanceStrategy = "ROUND_ROBIN";
        checkExist.index = 0;
        yield ApiServices_1.default.findOneAndUpdate({ name: apiName }, { index: 0, loadBalanceStrategy: "ROUND_ROBIN" });
      }
      const index = loadBalancer_1.default[checkExist.loadBalanceStrategy](checkExist);
      const url = checkExist.instances[index].url;
      (0, axios_1.default)({
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
      yield ApiServices_1.default.findOneAndUpdate({ name: apiName }, { index });
    } catch (error) {
      if (error instanceof Error) {
        // Doğrulama hatası olursa buraya ulaşılır
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Beklenmeyen bir sorun oluştu. hedef:redirectController" });
      }
    }
  });
const controllers = {
  main: mainController,
  register: registerController,
  unregister: unregisterController,
  enable: enableController,
  redirect: redirectController,
};
exports.default = controllers;
