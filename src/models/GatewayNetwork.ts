import { Schema, model } from "mongoose";

interface IGatewayNetwork {
  routePath: string;
  count: number;
}

const GatewayNetworkSchema = new Schema<IGatewayNetwork>(
  { routePath: String, count: Number },
  { versionKey: false, collection: "ApiAuthorizations" }
);

const GatewayNetwork = model<IGatewayNetwork>("GatewayNetwork", GatewayNetworkSchema, "GatewayNetwork");
export default GatewayNetwork;
