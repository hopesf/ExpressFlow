import ApiServices from "../models/ApiServices";
import { IServiceInstance, IapiAlreadyExists } from "../routes/types";

const apiAlreadyExists = async (registrationInfo: IServiceInstance): Promise<IapiAlreadyExists | null> => {
  const check = await ApiServices.findOne({ name: registrationInfo.apiName });
  return check ? check : null;
};

export default apiAlreadyExists;
