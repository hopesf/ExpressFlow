// util/loadBalancer.ts

import { IService } from '../routes/types.ts';

type LoadBalanceStrategy = (service: IService) => number;

const isEnabled = (
  service: IService,
  index: number,
  loadBalanceStrategy: LoadBalanceStrategy,
): number => {
  return service.instances[index].enabled ? index : loadBalanceStrategy(service);
};

const ROUND_ROBIN: LoadBalanceStrategy = (service: IService): number => {
  const helperService = { ...service };

  const newIndex =
    helperService.index + 1 >= helperService.instances.length ? 0 : helperService.index + 1;
  return isEnabled(helperService, newIndex, ROUND_ROBIN);
};
// disable eslint for this line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadBalancer: any = {
  isEnabled,
  ROUND_ROBIN,
};

export default loadBalancer;
