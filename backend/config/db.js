import mongoose from "mongoose";

const FALLBACK_MONGO_URI =
  "mongodb+srv://helloworld736731_db_user:DBPASSWORD123@cluster0.kictqyw.mongodb.net/?appName=Cluster0";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || FALLBACK_MONGO_URI;
  try {
    if (!uri) {
      throw new Error("MONGO_URI environment variable is missing.");
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
  }
};
