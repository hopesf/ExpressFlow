import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    // .connect("mongodb+srv://selimcoder:coderb053348@selimcoder.ctgzku3.mongodb.net/Firebase")
    console.log(`[${process.env.NODE_ENV}] MongoDB Connected`);
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export default connectDb;
