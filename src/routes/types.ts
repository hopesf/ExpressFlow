export interface ServiceInstance {
  apiName: string;
  protocol: string;
  host: string;
  port: string;
  url: string;
  enabled?: boolean;
}

export interface Service {
  index: number;
  instances: ServiceInstance[];
  loadBalanceStrategy?: string;
}

export interface Registry {
  services: Record<string, Service>; // Define services as a dictionary
  auth: {
    users: Record<string, { username: string; password: string }>;
  };
}

export default Registry;
