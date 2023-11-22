"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const getCounters = () => __awaiter(void 0, void 0, void 0, function* () {
    // services lengths
    const serviceLength = yield models_1.ApiServices.countDocuments();
    const activeServiceLength = yield models_1.ApiServices.countDocuments({ "instances.enabled": true });
    const deactiveServiceLength = yield models_1.ApiServices.countDocuments({ "instances.enabled": false });
    // robots length
    const robotLength = yield models_1.ApiRobots.countDocuments();
    const activeRobotLength = yield models_1.ApiRobots.countDocuments({ status: "on" });
    const deactiveRobotLength = yield models_1.ApiRobots.countDocuments({ status: "off" });
    return [
        { title: "Toplam Servis", count: serviceLength },
        { title: "Aktif Servisler", count: activeServiceLength },
        { title: "Devredışı Servisler", count: deactiveServiceLength },
        { title: "Toplam Robot", count: robotLength },
        { title: "Aktif Robot", count: activeRobotLength },
        { title: "Devredışı Robot", count: deactiveRobotLength },
    ];
});
exports.default = getCounters;
