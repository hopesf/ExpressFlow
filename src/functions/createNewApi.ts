import ApiServices from "../models/ApiServices";
import { IServiceInstance } from "../routes/types";

const createNewApi = async (registrationInfo: IServiceInstance) => {
  try {
    const initialObj = {
      name: registrationInfo.apiName,
      loadBalanceStrategy: "ROUND_ROBIN",
      instances: [registrationInfo],
    };

    const newApi = new ApiServices(initialObj);
    await newApi.save();
  } catch (error: any) {
    throw new Error(`Error while creating new api:${error}`);
  }
};

export default createNewApi;
