import { Types, Schema, model } from "mongoose";

interface IMerchantPool {
  documentId: Types.ObjectId;
  merchant: string;
  process: string;
}

const MerchantPoolSchema = new Schema<IMerchantPool>(
  {
    documentId: Types.ObjectId,
    merchant: String,
    process: String,
  },
  { versionKey: false, collection: "MerchantPool" }
);

const MerchantPool = model<IMerchantPool>("MerchantPool", MerchantPoolSchema, "MerchantPool");
export default MerchantPool;
