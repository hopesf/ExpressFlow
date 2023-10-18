import { IService } from "../routes/types";

export interface ILoadBalancer {
  ROUND_ROBIN?(service: IService): number;
  isEnabled?(service: IService, index: number, loadBalanceStrategy: Function): number;
}
