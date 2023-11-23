// util/loadBalancer.ts

import { IService } from "../routes/types";
type LoadBalanceStrategy = (service: IService) => number;

const isEnabled = (service: IService, index: number, loadBalanceStrategy: LoadBalanceStrategy): number => {
  return service.instances[index].enabled ? index : loadBalanceStrategy(service);
};

const ROUND_ROBIN: LoadBalanceStrategy = (service: IService): number => {
  const newIndex = ++service.index >= service.instances.length ? 0 : service.index;
  service.index = newIndex;

  return isEnabled(service, newIndex, ROUND_ROBIN);
};

// disable eslint for this line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadBalancer: any = {
  isEnabled,
  ROUND_ROBIN,
};

export default loadBalancer;
