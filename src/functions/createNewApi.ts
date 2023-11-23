import ApiServices from "../models/ApiServices";
import { IServiceInstance } from "../routes/types";

const createNewApi = async (registrationInfo: IServiceInstance) => {
  try {
    const initialObj = {
      name: registrationInfo.apiName,
      loadBalanceStrategy: "ROUND_ROBIN",
      index:0,
      instances: [registrationInfo]
    };

    const newApi = new ApiServices(initialObj);
    await newApi.save();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw error;
    } else {
      console.error("yeni api oluşturulurken bir sorun oluştu.");
      throw new Error(`Error while creating new api:${error}`);
    }
  }
};

export default createNewApi;
