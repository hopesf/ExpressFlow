import { GatewayNetwork } from "../models";

const getGatewayNetworkChart = async () => await GatewayNetwork.find({});
export default getGatewayNetworkChart;
