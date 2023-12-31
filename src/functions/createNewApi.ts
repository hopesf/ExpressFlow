import ApiServices from '../models/ApiServices.ts';
import { IServiceInstance } from '../routes/types.ts';

const createNewApi = async (registrationInfo: IServiceInstance) => {
  try {
    const initialObj = {
      name: registrationInfo.apiName,
      loadBalanceStrategy: 'ROUND_ROBIN',
      instances: [registrationInfo],
    };

    const newApi = new ApiServices(initialObj);
    await newApi.save();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      // console.error('yeni api oluşturulurken bir sorun oluştu.');
      throw new Error(`Error while creating new api:${error}`);
    }
  }
};

export default createNewApi;
