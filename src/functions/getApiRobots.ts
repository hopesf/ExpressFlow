import { ApiRobots } from "../models";



const getApiRobots = async () => {
  return await ApiRobots.aggregate([
    {
      $lookup: {
        from: "MerchantPool",
        localField: "merchant",
        foreignField: "merchant",
        as: "pool",
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        status: 1,
        merchant: 1,
        queue: {
          $size: "$pool",
        },
      },
    },
  ]);
};

export default getApiRobots;
