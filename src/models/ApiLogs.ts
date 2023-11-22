import { Schema, model } from "mongoose";

interface IApiLogs {
  modelCode: string;
  merchant: string;
  responseStatus: string;
  type: string;
  description: string;
}

const apiLogsSchema = new Schema<IApiLogs>(
  { modelCode: String, merchant: String, responseStatus: String, type: String, description: String },
  { versionKey: false, collection: "ApiRobots" }
);
const ApiLogs = model<IApiLogs>("ApiLogs", apiLogsSchema, "ApiLogs");

export default ApiLogs;
