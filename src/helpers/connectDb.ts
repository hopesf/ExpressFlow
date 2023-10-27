import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    // .connect("mongodb+srv://selimcoder:coderb053348@selimcoder.ctgzku3.mongodb.net/Firebase")
    console.log(`[${process.env.NODE_ENV}] MongoDB Connected`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw error;
    } else {
      console.error("Beklenmeyen veritabanına bağlantı hatası oluştu.");
      throw new Error("Database connection error");
    }
  }
};

export default connectDb;
