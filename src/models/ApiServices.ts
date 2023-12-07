import { Schema, model } from 'mongoose';

interface IApiServices {
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

const ApiServicesSchema = new Schema<IApiServices>(
  {
    name: String,
    loadBalanceStrategy: String,
    index: Number,
    instances: [
      {
        _id: false,
        protocol: String,
        host: String,
        port: String,
        enabled: { type: Boolean, default: true },
        url: String,
      },
    ],
  },
  { versionKey: false, collection: 'ApiServices' },
);

const ApiServices = model<IApiServices>('ApiServices', ApiServicesSchema);
export default ApiServices;
