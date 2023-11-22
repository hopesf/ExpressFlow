import { ApiServices } from "../models";

const getServiceLists = async () => {
  const result = await ApiServices.aggregate([
    { $project: { name: "$name", loadBalancerType: "$loadBalanceStrategy", instances: "$instances" } },
    {
      $addFields: {
        status: {
          $map: {
            input: "$instances",
            as: "each",
            in: { $cond: { if: { $eq: ["$$each.enabled", true] }, then: true, else: false } },
          },
        },
      },
    },
  ]);

  const updatedStatus = result.map((item) => {
    item.status = item.status.includes(true) ? true : false;
    return item;
  });

  return updatedStatus;
};
export default getServiceLists;
