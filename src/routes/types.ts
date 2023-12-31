export interface IServiceInstance {
  apiName: string;
  protocol: string;
  host: string;
  port: string;
  url: string;
  enabled: boolean;
}

export interface IService {
  index: number;
  instances: IServiceInstance[];
  loadBalanceStrategy?: string;
}

export interface IRegistry {
  services: Record<string, IService>; // Define services as a dictionary
  auth: {
    users: Record<string, { username: string; password: string }>;
  };
}

export interface IapiAlreadyExists {
  name: string;
  loadBalanceStrategy: string;
  index: number;
  instances: [
    {
      protocol: string;
      host: string;
      port: string;
      enabled: boolean;
      url: string;
    },
  ];
}

export default IRegistry;
