import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    // .connect("mongodb+srv://selimcoder:coderb053348@selimcoder.ctgzku3.mongodb.net/Firebase")

    // eslint-disable-next-line no-console
    console.log(`[${process.env.NODE_ENV}] MongoDB Connected`);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Database connection error');
    }
  }
};

export default connectDb;
