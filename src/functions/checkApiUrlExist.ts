import ApiServices from '../models/ApiServices.ts';

// eslint-disable-next-line @typescript-eslint/ban-types
const checkApiUrlExist = async (url: string): Promise<Boolean> => {
  try {
    const allUrls = await ApiServices.aggregate([
      { $unwind: { path: '$instances', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$instances.url' } },
      { $project: { url: '$_id', _id: false } },
    ]);

    const result = allUrls.some((item) => item.url === url);
    return !!result;
  } catch (error) {
    return false;
  }
};

export default checkApiUrlExist;
