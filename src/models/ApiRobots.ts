import { Schema, model } from "mongoose";

interface IApiRobots {
  name: string;
  status: string;
  merchant: string;
  queue?: number;
}

const apiRobotsSchema = new Schema<IApiRobots>({ name: String, status: String, merchant: String }, { versionKey: false, collection: "ApiRobots" });
const ApiRobots = model<IApiRobots>("ApiRobots", apiRobotsSchema, "ApiRobots");

export default ApiRobots;
