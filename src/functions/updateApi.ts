import ApiServices from '../models/ApiServices.ts';
import { IServiceInstance, IapiAlreadyExists } from '../routes/types.ts';

const updateApi = async (
  checkExist: IapiAlreadyExists,
  registrationInfo: IServiceInstance,
): Promise<true | undefined> => {
  try {
    const helperInstances = checkExist.instances;
    const existingIndex = helperInstances.findIndex(
      (instance) => instance.url === registrationInfo.url,
    );

    if (existingIndex !== -1) {
      helperInstances[existingIndex] = registrationInfo;
    } else {
      helperInstances.push(registrationInfo);
    }

    await ApiServices.findOneAndUpdate(
      { name: registrationInfo.apiName },
      { instances: helperInstances },
    );

    return true;
  } catch (error) {
    throw new Error(`Error while updating api: ${error}`);
  }
};

export default updateApi;
