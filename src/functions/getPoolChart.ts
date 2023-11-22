import { MerchantPool } from "../models";

const getPoolChart = async () => {
  return await MerchantPool.aggregate([
    { $addFields: { total: 0 } },
    { $group: { _id: "$merchant", total: { $sum: 1 } } },
    { $project: { _id: false, name: "$_id", total: "$total" } },
  ]);
};

export default getPoolChart;
