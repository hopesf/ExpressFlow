import GatewayNetwork from "../models/GatewayNetwork";

export default async function ManageRouterNetwork(originalUrl: string, process: "check" | "delete") {
  try {
    const checkRouter = await GatewayNetwork.findOne({ routePath: originalUrl });

    if (process === "check") {
      if (!checkRouter) {
        (await GatewayNetwork.create({ routePath: originalUrl, count: 1 })).save();
      } else {
        checkRouter.count++;
        await checkRouter.save();
      }

      return true;
    }

    if (process === "delete") {
      if (checkRouter) {
        if (checkRouter.count <= 1) {
          await GatewayNetwork.findOneAndDelete({ routePath: originalUrl });
        } else {
          checkRouter.count--;
          await checkRouter.save();
        }
      }
    }
  } catch (error) {
    throw new Error(`Beklenmeyen bir sorun oluştu. hedef:ManageRouterNetwork, error:${error}`);
  }
}
