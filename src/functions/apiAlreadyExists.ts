import ApiServices from '../models/ApiServices.ts';
import { IapiAlreadyExists } from '../routes/types.ts';

const apiAlreadyExists = async (registrationInfo: {
  apiName: string;
}): Promise<IapiAlreadyExists | null> => {
  const check = await ApiServices.findOne({ name: registrationInfo.apiName });
  return check || null;
};

export default apiAlreadyExists;
