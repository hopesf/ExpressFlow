// util/loadBalancer.ts

import { Service } from "../routes/types";

export const ROUND_ROBIN = (service: Service): number => {
  const newIndex = ++service.index >= service.instances.length ? 0 : service.index;
  service.index = newIndex;
  return isEnabled(service, newIndex, ROUND_ROBIN);
};

export const isEnabled = (service: Service, index: number, loadBalanceStrategy: Function): number => {
  return service.instances[index].enabled ? index : loadBalanceStrategy(service);
};
