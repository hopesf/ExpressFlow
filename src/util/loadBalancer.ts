// util/loadBalancer.ts

import { IService } from "../routes/types";
import { ILoadBalancer } from "./types";

const isEnabled = (service: IService, index: number, loadBalanceStrategy: Function): number => {
  return service.instances[index].enabled ? index : loadBalanceStrategy(service);
};

const ROUND_ROBIN = (service: IService): number => {
  const newIndex = ++service.index >= service.instances.length ? 0 : service.index;
  service.index = newIndex;

  return isEnabled(service, newIndex, ROUND_ROBIN);
};

const loadBalancer: ILoadBalancer = {
  isEnabled,
  ROUND_ROBIN,
};

export default loadBalancer;
