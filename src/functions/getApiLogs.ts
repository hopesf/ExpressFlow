import { ApiLogs } from "../models";


const getApiLogs = async () => await ApiLogs.find().sort({ _id: -1 }).limit(100);
export default getApiLogs;
