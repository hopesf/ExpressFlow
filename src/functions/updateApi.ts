import ApiServices from "../models/ApiServices";
import { IServiceInstance, IapiAlreadyExists } from "../routes/types";

const updateApi = async (checkExist: IapiAlreadyExists, registrationInfo: IServiceInstance): Promise<true | undefined> => {
  try {
    const _instances = checkExist.instances;
    const existingIndex = _instances.findIndex((instance) => instance.url === registrationInfo.url);

    existingIndex !== -1 ? (_instances[existingIndex] = registrationInfo) : _instances.push(registrationInfo);
    await ApiServices.findOneAndUpdate({ name: registrationInfo.apiName }, { instances: _instances });

    return true;
  } catch (error) {
    throw new Error(`Error while updating api: ${error}`);
  }
};

export default updateApi;
