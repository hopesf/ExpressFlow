import ApiServices from "../models/ApiServices";
import { IapiAlreadyExists } from "../routes/types";

const apiAlreadyExists = async (registrationInfo: { apiName: string }): Promise<IapiAlreadyExists | null> => {
  const check = await ApiServices.findOne({ name: registrationInfo.apiName });
  return check ? check : null;
};

export default apiAlreadyExists;
