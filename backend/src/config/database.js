import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    process.exit(1);
  }
};

const dropDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log("MongoDB dropped successfully");
  } catch (error) {
    console.error("MongoDB drop error:", error);
    process.exit(1);
  }
};

export { disconnectDB, dropDB };

export default connectDB;
