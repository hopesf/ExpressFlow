"use strict";
// util/loadBalancer.ts
Object.defineProperty(exports, "__esModule", { value: true });
const isEnabled = (service, index, loadBalanceStrategy) => {
    return service.instances[index].enabled ? index : loadBalanceStrategy(service);
};
const ROUND_ROBIN = (service) => {
    const newIndex = ++service.index >= service.instances.length ? 0 : service.index;
    service.index = newIndex;
    // return newIndex;
    return isEnabled(service, newIndex, ROUND_ROBIN);
};
// disable eslint for this line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadBalancer = {
    isEnabled,
    ROUND_ROBIN,
};
exports.default = loadBalancer;
