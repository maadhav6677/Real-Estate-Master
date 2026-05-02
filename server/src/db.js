import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log("MONGO_URI not set. API will use in-memory sample listings.");
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed. Falling back to sample listings.");
    console.warn(error.message);
    return false;
  }
}
